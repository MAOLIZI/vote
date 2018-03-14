require("babel-polyfill");

import React, {Component} from "react";
const render = require("react-dom").render;
import {Router, Route, Link, browserHistory, IndexRoute, IndexRedirect, applyRouterMiddleware } from "react-router";


// 清除页面样式，帮助livereload
if (window.debug) {
  $("head style").remove();
}

window.PHANTOM_HTML_TO_PDF_READY = true;


// 设置服务器模块默认发送的头字段
const server = require("通用/服务器");
server.setAuthorizationKey("adminToken");

const cache = require("通用/缓存");
if (cache.disableLocalStorage) cache.disableLocalStorage();      // 不使用本地缓存

// 如果未登录，跳转登录页面
if (!server.getAuthorizationToken()) {
  browserHistory.push("/admin/login");
}


render(
  <Router history={browserHistory}>
    <Route path ="/admin">
      <IndexRedirect to="/admin/login" />
      <Route path="login" component={require('登录')}></Route>
      <Route path="" component={require('主界面')}>

      </Route>
    </Route>
  </Router>,
  document.getElementById('page_holder')
);

// $('#page_holder').css("minHeight", $(window).height() + "px");
