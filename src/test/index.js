
require("babel-polyfill");

const React = require("react");
const render = require("react-dom").render;
const {Router, Route, Redirect, Link, browserHistory, IndexRoute, IndexRedirect, applyRouterMiddleware } = require("react-router");

// 清除页面样式，帮助livereload
if (window.debug) {
  $("head style").remove();
}

// 设置服务器模块默认发送的头字段
const server = require("通用/服务器");
server.setAuthorizationKey("adminToken");

render(
  (<Router history={browserHistory}>
    <Route path ="/test" >
      <IndexRoute component = {require('测试')} />
      <Redirect path="*" to="/test" />
    </Route>
  </Router>),
  document.getElementById('page_holder')
);
