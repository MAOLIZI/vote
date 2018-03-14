import React, { Component, Link } from "react";
require("./index.less");


export default class BackDrop extends Component {
  
  render() {
    return <div className="backdrop component">
      {this.props.children}
      <span className="btn iconfont icon-wrong close-button" onClick={this.props.onClose}></span>
    </div>;
  }
  
}
