import React, { Component } from "react";
import Form from "./index";

const ComponentPackage = require("./components/");


// 只作为childrne里的摆设
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {}
    };
  }

  render() {
    let setting = {
      item: this.props,
      content: this.props.content,
      defaultValue: this.props.defaultValue,
      onChange: this.handleChange.bind(this),
      component: this.props.component,
      standaloneComponent: this.props.standaloneComponent,     // 为独立组件准备的嵌套
      mode: this.props.mode || "edit"
    };

    return <div className="formItem">
      <ComponentPackage ref="component" {...setting} key={this.props.uuid} />
    </div>;
  }

  handleChange(item, content) {
    this.state.content = content;
    if (this.props.onChange) {
      this.props.onChange(content);
    }
  }

  focus() {
    this.refs.component.focus();
  }

  getData() {
    return this.state.content;
  }

  validate() {
    return this.refs.component.validate();
  }

}
