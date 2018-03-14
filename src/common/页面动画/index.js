import React, { Component, Link } from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES5 with npm

require("./index.less");


const transitions = {
  "淡入淡出": {
    name: "ui-fade",
    enterDuration: 2000,
    leaveDuration: 2000
  },
  "左移": {
    name: "ui-slide-left",
    enterDuration: 1000,
    leaveDuration: 1000
  },
  "右移": {
    name: "ui-slide-right",
    enterDuration: 3000,
    leaveDuration: 3000
  },
  "缩小淡入": {
    name: "ui-fade-zoom",
    enterDuration: 2000,
    leaveDuration: 3000
  }
};


export default class Transition extends Component {
  render() {
    let transition = transitions[this.props.type] || transitions["淡入淡出"];

    return <ReactCSSTransitionGroup
      transitionName={transition.name}
      transitionEnterTimeout={transition.enterDuration}
      transitionLeaveTimeout={transition.leaveDuration}
    >
      {this.props.children}
    </ReactCSSTransitionGroup>;
  }
}
