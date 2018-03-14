import React, { Component } from "react";
import ComponentPackage from "./components/";

require("./index.less");

// PropTypes: {
//   items: React.PropTypes.array,  // 表单组件列表：如： [{type: "text", name: "项目1"}, {type: "text", name: "项目2"}]
//   content: React.PropTypes.object,     // 表单各项目内容：如： {"项目1": "项目名称", “项目2”:“项目名称”}
//   onChange: React.PropTypes.function,   // 发生修改时回调函数
//   component: React.PropTypes.any      // 使用的组件
// }

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.content || {};
  }

  render() {
    return <div className={"formItem row " + (this.props.className || "")}>
      {this.renderItems()}
    </div>;
  }

  componentWillReceiveProps(nextProps) {
    this.state = nextProps.content || {};
  }

  componentWillMount() {
    if (this.props.items) {
      return;
    }
    // 如果没有提供items，争取从children中获取
    let items = [];
    React.Children.map(this.props.children, function(child) {
      let item = $.extend({}, child.props);
      items.push(item);
    });
    this.items = items;
  }

  renderItems() {
    var items = this.items || this.props.items;
    let inputs = {};
    this.inputs = inputs;

    return items.map(function(item, index) {
      if (!item.uuid) {
        item.uuid = item.name;
      }
      let props = {
        item: item,
        tabIndex: index * 2 + 1 + (this.props.startTabIndex || 0),
        content: this.state[item.uuid || item.name],
        onChange: this.handleChange.bind(this),
        component: this.props.component || InputComponentWrap,
        mode: this.props.mode || "edit"
      };
      return <ComponentPackage {...props} key={props.item.uuid} ref={(ref) => {
        inputs[props.item.uuid] = ref;
      }} />;
    }.bind(this));
  }

  handleChange(item, value) {
    // 在正常模式,发生修改不更新state, 防止结构过度更新
    let content = this.state;
    let name = item.uuid || item.name;
    content[name] = value;

    if (this.props.onChange) {
      this.props.onChange(content);
    }
  }

  validate() {
    let inputs = this.inputs;
    let ret = true;
    for (let key in inputs) {
      let input = inputs[key];
      let isValid = input.validate();
      if (!isValid) {
        ret = false;
      }
    }

    return ret;
  }

  forceGetContent() {
    for (let uuid in this.inputs) {
      let item = this.inputs[uuid];
      if(item.forceGetContent) item.forceGetContent();
    }
  }
}


let InputComponentWrap;
Form.setComponent = function(Component) {
  InputComponentWrap = Component;
}

export {Form};
