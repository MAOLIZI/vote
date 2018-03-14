import React, {Component, Link} from "react";
import {browserHistory} from "react-router";

import Transition from "页面动画";
import server from "通用/服务器";
import cache from "通用/缓存";

import Background from "组件库/背景 - Background";
import Subfield from "组件库/页面分栏 - Subfield";
import Sidebar from "组件库/边栏 - Sidebar";

const dateUtility = require("通用/日期");

const navbarHeight = 64; // 统一顶部搜索区的高度
const sidebarW = 220; // 左侧边栏的宽度

function getItems(access) {
  return items;
}

// 左上角的系统logo
let LeftTopLogo = React.createClass({
  render() {
    return <div className='system_logo_area' onClick={() => {
      browserHistory.push('/admin/home');
    }}>
      <img src={window.ossPath + 'img/' + this.props.logo} alt='系统图标'/>
    </div>;
  }
});

// 顶部搜索和右上角的基本信息
let MainpageTop = React.createClass({
  render() {
    return <div className='mainpage-top row' style={{
      "paddingLeft": sidebarW,
      "zIndex": "190",
      "position": "fixed",
      "top": "0",
      "right": "0"
    }}>
      <div className="top-title col-xs-8">{this.props.title || "第五届“方大特钢杯”全省百万职工学法、用法知识答题竞赛暨“百万网民学法律”知识竞赛"}</div>
      <div className='username_area'>
        <span className='username'>{(cache.get('adminUserName') || cache.get('adminRealName')) || ''}</span>
        <span className='iconfont icon-user'></span>
        <span ref='userRole' className='userRole' data-toggle="tooltip">{cache.get('adminRole') || ''}</span>
      </div>
    </div>;
  },
  componentDidMount() {
    $(this.refs.userRole).tooltip({
      trigger: 'hover', //触发方式
      placement: 'bottom',
      title: "你好，超级管理员"
    });
  }
});

export default class MainPage extends Component {
  render() {
    let pathname = this.props.location.pathname;
    let names = pathname.split("/");

    let realName = names[3] ? (names[2] + "/" + names[3]) : names[2];
    let previousName = this.previousName || "";

    let duration;
    this.previousName = realName;

    let access = cache.get("access");
    let items = getItems(access || {});

    let tagName = "";
    // 为标签增加active属性 并获取当前标签的名称 tagName
    items.forEach((item) => {
      if (("/admin/" + realName).indexOf(item.link || "") >= 0) {
        item.active = true;
        tagName = item.name; // =>> <MainpageTop title={tagName} />
      } else {
        item.active = false;
      }
    });

    return <div className="main-page ui">
      <div className="ui-body">
        <Subfield percent={false} number={sidebarW}>
          <div key='sidebar' className="sidebar-col" style={{minHeight: $(window).height()}}>
            <LeftTopLogo logo='login_logo.png' />
            <Sidebar items={require("./边栏项.js")} />
          </div>
          <div className="ui-content" style={{position: "relative"}}>
            <MainpageTop/>
            <div className="ui-content-inner" style={{position: "relative"}}>
              <Transition type="左移">
                <div key={pathname}>
                  {this.props.children}
                </div>
              </Transition>
            </div>
          </div>
        </Subfield>
      </div>
    </div>;
  }
}
