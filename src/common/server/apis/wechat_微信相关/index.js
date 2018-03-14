const Wechat = require("server/util/wechat");
const log = require("server/util/log");
const token = require("server/util/token");

let wechats = {};

async function getWechat(name) {
  if (!wechats[name]) {
    let wechat = new Wechat(name);
    let ret = await wechat.init();
    if (ret) {
      wechats[name] = wechat;
    } else {
      log.error("微信初始化失败，微信ID没有配置？");
    }
  }

  return wechats[name];
}

module.exports = [{
  method: 'GET',
  path: "/wechat/signature/:name",
  desc: "微信获取签名",
  validate: {
    params: {
      name: "String|required"
    },
    query: {
      url: "String|required"
    }
  },
  handler: async function handler(ctx) {
    let {url} = ctx.request.query;
    let name = ctx.request.params.name;
    let wechat = await getWechat(name);
    if(wechat){
      try {
        ctx.body = await wechat.getSignature(url);
      } catch(e) {
        ctx.body = "调用微信接口发生错误";
        ctx.status = 400;
        log.error(e);
      }

    }else{
      ctx.status = 400;
      ctx.body = "找不到对应的微信公众号配置："+ name;
    }
  }
}, {
  method: 'GET',
  path: "/wechat/link/:name",
  desc: "生成微信默认跳转链接",
  validate: {
    params: {
      name: "String|required"
    },
    query: {
      url: "String|required",
      state: "String|required"
    }
  },
  handler: async function(ctx) {
    let {url, state} = ctx.request.query;
    let name = ctx.request.params.name;

    let wechat = await getWechat(name);
    if (wechat.getType() === "corp") {
      let conf = wechat.getConf();
      let link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${conf.appId}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_base&state=${encodeURIComponent(state)}#wechat_redirect`
      ctx.body = `<pre>${link}</pre><a href=${link}>跳转</a>`;
    }

  }
}, {
  method: 'GET',
  path: "/wechat/redirect/:name",
  desc: "微信默认跳转",
  validate: {
    params: {
      name: "String|required"
    },
    query: {
      code: "String|required",
      state: "String|required"
    }
  },
  handler: async function (ctx) {
    let {code, state} = ctx.request.query;
    let name = ctx.request.params.name;

    let message;
    let handler = Wechat.getRedirectHandler(state);
    let wechat = await getWechat(name);
    let user;
    try {
      user = await wechat.getUserInfo(code);

      if (handler) {
        // 正常跳转
        return handler(ctx, user);
      } else {
        message = "没有为状态" + state + "定义处理器，用户信息：" + JSON.stringify(user);
        log.warn(message);
      }
    } catch(e) {
      message = "获取用户信息失败" + e;
      log.warn("获取用户信息失败", e);
    }

    ctx.body = message || "发生错误，请稍后再试";
  }
}];
