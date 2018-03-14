import React, { Component, Link } from "react";
require('./index.less');


export default class GroupBox extends Component {

  render() {
    return <div className='groupBox component'>{this.props.children}</div>;
  }

}
