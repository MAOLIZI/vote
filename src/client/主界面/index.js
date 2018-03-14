import React, { Component, Link } from "react";
import {browserHistory} from "react-router";

import Transition from "页面动画";
import server from "通用/服务器";
import cache from "通用/缓存";


export default class MainPage extends Component {
  render() {
    let pathname = this.props.location.pathname;
    let names = pathname.split("/");

    let realName = names[2] ? (names[1] + "/" +  names[2]) : names[1];
    let previousName = this.previousName || "";

    let duration;
    this.previousName = realName;

    return <div className="main-page">
      <Transition type="左移">
        <div key={pathname}>
          {this.props.children}
        </div>
      </Transition>
    </div>;
  }
}
