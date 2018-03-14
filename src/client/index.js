require("babel-polyfill");

import React, {Component} from "react";
const render = require("react-dom").render;
import {
  Router,
  Route,
  Link,
  browserHistory,
} from "react-router";

import {Wechat} from "通用/微信";
const {WechatApp, initWechatApi, setShareMessage} = Wechat;


// 清除页面样式，帮助livereload
if (window.debug) {
  $("head style").remove();
}

// 设置服务器模块默认发送的头字段
import server from "通用/服务器";
server.setAuthorizationKey("userToken");

render(
  <Router history={browserHistory}>
    <Route path="/" component={WechatApp} name="dwd">
      <Route path="qrcode" component={require("[B]二维码")} />

      <Route path="main" component={require("主界面")}>
        <IndexRedirect to="poster" />
        <Route path="poster" component={require("海报界面")} />
        <Route path="rule" component={require("投票规则")} />

        <Route path="list" component={require('列表界面')} />
        <Route path="detail/:id" component={require('详情界面')} />
        <Route path="ranking" component={require('排行榜')} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('page_holder')
);


$(document.body).ready(() => {
  if (window.location.href.indexOf("?") >= 0) {
    window.location.href = window.location.href.split("?")[0];
  }
  // 微信分享
  if (window.location.href.indexOf("?") < 0) {
    setShareMessage({
      title: "2017年“十大最美信号工”评选",
      link: "http://railwaydwd.streamsoft.cn/main/poster",
      imgUrl: "http://store.streamsoft.cn/railway-dwd/img/share.jpg",
      desc: "快来为您支持的TA投票吧~"
    })
  }
});
