//微信相关的各种方法和验证
const store = require("server/store")();
const jsSHA = require("jssha");
const Wechat = require("server/util/models/wechat");
const request = require("server/util/async-request");
const log = require("server/util/log");

const EXPIRE_TIME = 3600;
let lastValidResult;

class WechatClass {
  constructor(name,url) {
    this.name = name;
    // 1小时后过期，需要重新获取数据后计算签名
    //公众号的配置信息
    this.conf = {};
  }

  async init(){
    let name = this.name;
    if(!name) {return "缺少name参数";}

    let wechat = await Wechat.find({where: {name: this.name}});
    if (wechat) {
      this.conf = wechat[0];
      this.wechatRecord = wechat[0];
    }
    if (!this.conf || !this.conf.appId || !this.conf.appSecret) {
      log.info("微信ID没有配置", name);
      return false;
    } else {
      return true;
    }
  }

  getType() {return (this.conf || {}).type;}
  getConf() {return this.conf || {};}

  // 获取微信签名所需的ticket
  async getTicket(url) {
    let appId = this.conf.appId;
    let accessToken = await this.getAccessToken();
    let response = await request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessToken +'&type=jsapi');
    let ticket = JSON.parse(response.body).ticket;
    return ticket;
  }

  // 获取微信签名所需的access_token
  async getAccessToken(){
    let conf = this.conf;
    let {appId, appSecret, type} = conf;
    let now = this.createTimeStamp();

    // 从缓存中取
    let accessTokenCache = await store.get("WeChat_accessToken") || {};
    if(accessTokenCache && accessTokenCache.timestamp && (now - accessTokenCache.timestamp) < EXPIRE_TIME){
      if (await this.isValidAccessToken(accessTokenCache.access_token)) {
        log.info("使用内存缓存中的access_token", accessTokenCache.access_token);
        return accessTokenCache.access_token;
      }
    }

    // 从数据库取
    if (this.wechatRecord) {
      await this.wechatRecord.reload();
      let accessToken = this.wechatRecord.accessToken;

      if(accessToken && accessToken.timestamp && (now - accessToken.timestamp) < EXPIRE_TIME){
        if (await this.isValidAccessToken(accessToken.access_token)) {
          log.info("使用数据库中的access_token", accessToken.accessToken);
          store.set("WeChat_accessToken", accessToken);
          return accessToken.access_token;
        }
      }
    }

    return await this.fetchAccessToken();
  }

  async isValidAccessToken(accessToken) {
    let conf = this.conf;
    let {appId, appSecret, type} = conf;

    // 减少反复验证token的次数
    if (lastValidResult && lastValidResult.accessToken === accessToken && Date.now() - lastValidResult.timeStamp < 60000) {
      return true;
    }

    log.info("验证access_token", accessToken);
    let url = `https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=${accessToken}`;
    if (type === "corp") {
      url = `https://qyapi.weixin.qq.com/cgi-bin/agent/list?access_token=${accessToken}`
    }
    let response = await request(url);
    let body = response.body;
    try {
      let data = JSON.parse(body);
      if (data.errcode != '0') {
        log.info("access_toekn无效", data);
        return false;
      }
    } catch(e) {
      return false;
    }

    lastValidResult = {
      accessToken: accessToken,
      timeStamp: Date.now()
    };

    return true;
  }

  // 获取微信签名所需的access_token
  async fetchAccessToken(){
    let conf = this.conf;
    let {appId, appSecret, type} = conf;

    let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appId +'&secret=' + appSecret;
    if (type === "corp") {
      // 企业号
      url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${appId}&corpsecret=${appSecret}`;
    }

    try {
      // 获取token
      let response = await request(url);
      log.info("重新获取access_token", response.body);
      let accessTokenCache = JSON.parse(response.body);

      if (!accessTokenCache.access_token) {
        log.warn("获取accessToken返回错误");
        return;
      }

      accessTokenCache.timestamp = this.createTimeStamp();

      // 保存至缓存
      store.set("WeChat_accessToken", accessTokenCache);

      // 异步保存至数据库
      this.wechatRecord.accessToken = accessTokenCache;
      await this.wechatRecord.save();

      return accessTokenCache.access_token;


    } catch(e) {
      log.info("获取accessToken出错", e);
      return;
    }
  }

  createTimeStamp() {
    return parseInt(new Date().getTime() / 1000);
  }

  //获取签名的方法
  async getSignature(url){
    // 先从缓存中获取
    let signatureObj = await store.get(this.name + "_" + url) || {};
    // 如果缓存中已存在签名，则直接返回签名
    if(signatureObj && signatureObj.timestamp){
      let t = this.createTimeStamp() - signatureObj.timestamp;
      // 未过期，并且访问的是同一个地址
      // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
      if(t < EXPIRE_TIME && signatureObj.url == url){
        return signatureObj;
      }
    }

    // 重新计算
    let appId = this.conf.appId;
    let ts = parseInt(new Date().getTime() / 1000) + '';
    let nonceStr = Math.random().toString(36).substr(2, 15);
    let ticket = await this.getTicket();
    let signature = calcSignature(ticket, nonceStr, ts, url);
    let obj = {
      nonceStr: nonceStr,
      appId: appId,
      timestamp: ts,
      signature: signature,
      url: url
    };
    store.set(this.name + "_" + url, obj);
    return obj;
  }

  // authCode是微信自动回调时传送的
  async getUserInfo(authCode) {
    let accessToken = await this.getAccessToken();

    let response = await request(`https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${authCode}`);
    let body = JSON.parse(response.body);
    log.info("USERINFO", body);
    return body;
  }

}

module.exports = WechatClass;

// 管理跳转接口
Object.assign(WechatClass, require("./handler"));

// 计算签名
function calcSignature (ticket, noncestr, ts, url) {
  let str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
  log.info("SIGNATURE", str);
  let shaObj = new jsSHA("SHA-1", 'TEXT');
  shaObj.update(str);
  return shaObj.getHash('HEX');
}
