import React, { Component, Link } from "react";
import {browserHistory} from "react-router";
import server from "通用/服务器";
import cache from "通用/缓存";

import loadScript from "./动态载入脚本";


let wechatAppInited = false;

class WechatApp extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }

  componentWillMount() {
    // 初始化微信
    if (wechatAppInited === false) {
      wechatAppInited = true;
      this.initWechat();
    }
  }

  initWechat() {
    // 初始化微信ID
    let {id, filter} = this.props.location.query;
    let wechatId = id;
    if (wechatId) {
      cache.set("wechatId", wechatId);
      cache.set("filter", filter);
    } else {
      wechatId = cache.get("wechatId");
      filter = cache.get("filter");
    }

    // 删去状态栏的id
    if (wechatId) {
      let pathname = this.props.location.pathname;
      setTimeout(() => {
        browserHistory.replace(this.props.location.pathname)
      });
    }

    // 如果有onWechatId属性，调用之
    if (this.props.route.onWechatId) {
      this.props.route.onWechatId(wechatId, filter);
    }

    // 初始化微信API
    let name = this.props.route.name;
    if (!name) throw "请指定微信APP对应的公众号名称，通过name属性设置";

    if (this.props.route.onWechatApi) {
      // 如果指定了相关事件，注册事件监听
      Wechat.whenAPIReady(this.props.route.onWechatApi);
    }

    Wechat.initWechatApi(name);
  }
}



// 包装微信调用函数，自动生成promise和调用checkJSAPI检查API可用性
function checkWechatAPIs(apis, success, cancel) {
  let promise = $.Deferred();
  Wechat.whenAPIReady(() => {
    wx.checkJsApi({
      jsApiList: Array.isArray(apis)?apis:[apis],
      success: ({checkResult}) => {
        let ret = success(checkResult || {}, promise);
        // 如果返回值是同一个promise，留给函数自行解决promise
        if (ret !== promise) {
          promise.resolve(ret);
        }
      },

      cancel() {
        if (cancel) {
          let ret = cancel();
          if (ret !== promise) {
            promise.reject(true);
          }
        } else {
          promise.reject(true);
        }
      }
    })
  })

  return promise;
}

let callbacks = [];
let wechatInited = false;   // 微信脚本是否初始化
let wechatReady = false;    // 微信API是否可用


const Wechat = {
  // 输出微信API
  WechatApp: WechatApp,

  // 给定微信公众号名称，初始化微信API
  initWechatApi(name) {
    // 避免重复初始化
    if (wechatInited === true) return;

    wechatInited = true;
    loadScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js").then( () => {

      // 配置微信
      server.get(`/api/wechat/signature/${name}`, {
        url: window.location.href.split("#")[0]
      }, false).then(function(json) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: json.appId, // 必填，公众号的唯一标识
          timestamp: json.timestamp, // 必填，生成签名的时间戳
          nonceStr: json.nonceStr, // 必填，生成签名的随机串
          signature: json.signature,// 必填，签名，见附录1
          jsApiList: ["chooseImage","previewImage","uploadImage","getLocation","downloadImage","startRecord","stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice","stopVoice","onVoicePlayEnd","uploadVoice","downloadVoice","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"]
        });

        wx.ready(function(){
          // 说明微信API已经设置好了
          Wechat.triggerAPIReady();
        });
      });
    });
  },

  // 当API可用时调用
  whenAPIReady(callback) {
    // 如果微信API已经可用，调用之
    if (wechatReady === true) {
      callback(this);
    } else {
      // 否则加入事件中
      callbacks.push(callback);
    }
  },

  triggerAPIReady () {
    wechatReady = true;
    callbacks.forEach(callback=> {callback(Wechat);});
    callbacks = [];
  },

  setShareMessage(shareObj) {
    return checkWechatAPIs(["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"],
      (checkResult) => {
        if (checkResult.onMenuShareQQ) wx.onMenuShareQQ(shareObj);
        if (checkResult.onMenuShareTimeline) wx.onMenuShareTimeline(shareObj);
        if (checkResult.onMenuShareWeibo) wx.onMenuShareWeibo(shareObj);
        if (checkResult.onMenuShareAppMessage) wx.onMenuShareAppMessage(shareObj);
        if (checkResult.onMenuShareQQ) wx.onMenuShareQZone(shareObj);
      }
    )
  },

  chooseImage(props) {
    return checkWechatAPIs(["chooseImage"],
      (checkResult, promise) => {
        if (!checkResult.chooseImage) {promise.reject(true); return promise;}
        wx.chooseImage($.extend({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ["camera", "album"]
        }, props || {}, {
          success: function({localIds}) {
            promise.resolve(localIds || []);
          },
          cancel() {promise.reject(true);}
        }));

        return promise;
      }
    );
  },

  uploadImage(localId) {
    return checkWechatAPIs(["uploadImage"],
      (checkResult, promise) => {
        if (!checkResult.uploadImage) {promise.reject(true); return promise;}

        wx.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function ({serverId}) {
            promise.resolve(serverId);
          },
          cancel() {promise.reject(true);}
        });

        return promise;
      }
    );
  }
};


export {Wechat};
