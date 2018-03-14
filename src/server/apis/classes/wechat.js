//微信相关的各种方法和验证
const store = require("server/store")();
const jsSHA = require("jssha");
const Wechat = require("../models/wechat");
const request = require("server/util/async-request");

class WeChat{
  constructor(name, url) {
    this.name = name;
    this.url = url;
    // 1小时后过期，需要重新获取数据后计算签名
    this.expireTime = 3600;
    //公众号的配置信息
    this.conf = {};
  }

  //获取微信公众号的配置信息
  async getConf(){
    let wechat = await Wechat.find({where: {name: this.name}});
    if(wechat){
      return wechat[0];
    }else{
      return {};
    }
  }

  // 随机字符串产生函数
  createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  }

  // 时间戳产生函数
  createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + '';
  }

  // 计算签名
  calcSignature (ticket, noncestr, ts, url) {
    let str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
    let shaObj = new jsSHA("SHA-1", 'TEXT');
    shaObj.update(str);
    return shaObj.getHash('HEX');
  }

  // 获取微信签名所需的ticket
  async getTicket() {
    let signatureObj = await store.get(this.name + "_" + this.url) || {};
    // 如果缓存中已存在签名，则直接返回签名
    if(signatureObj && signatureObj.timestamp){
      let t = this.createTimeStamp() - signatureObj.timestamp;
      // 未过期，并且访问的是同一个地址
      // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
      if(t < this.expireTime && signatureObj.url == this.url){
        return signatureObj;
      }
    }

    let appId = this.conf.appId;
    let accessData = await this.getAccessToken();
    let response = await request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessData.access_token +'&type=jsapi');
    let ts = this.createTimeStamp();
    let nonceStr = this.createNonceStr();
    let ticket = JSON.parse(response.body).ticket;
    let signature = this.calcSignature(ticket, nonceStr, ts, this.url);
    let obj = {
      nonceStr: nonceStr,
      appId: appId,
      timestamp: ts,
      signature: signature,
      url: this.url
    };
    store.set(this.name + "_" + this.url, {
      nonceStr: nonceStr,
      appId: appId,
      timestamp: ts,
      signature: signature,
      url: this.url
    });
    return obj;
  }

  // 获取微信签名所需的access_token
  async getAccessToken(){
    let accessTokenCache = await store.get("WeChat_accessToken") || {};
    if(!(accessTokenCache.timestamp && (this.createTimeStamp() - accessTokenCache.timestamp) < this.expireTime)){
      let response = await request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ this.conf.appId +'&secret=' + this.conf.appSecret);
      accessTokenCache = JSON.parse(response.body);
      store.set("WeChat_accessToken", accessTokenCache);
    }
    return accessTokenCache;
  }

  async init(){
    let url = this.url;
    let name = this.name;
    this.conf = await this.getConf();
    if(!url){return "缺少url参数";}
    if(!name) {return "缺少name参数";}
    if (!this.conf || !this.conf.appId || !this.conf.appSecret) {return "没有配置微信AppId";}
    return true;
  }

  //获取签名的方法
  async getSignature(){
    return this.getTicket();
  }
}

module.exports = WeChat;
