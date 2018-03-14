const React = require("react");

let componentMap  = {
  "text": require("./文字"),
  "password": require("./文字"),
  "currency": require("./货币"),
  "search": require("./搜索"),
  "multi": require("./多行文字"),
  "time": require("./时间"),
  "select" :require("./选择"),
  "image": require("./图片"),
  "duration": require("./期限"),
  "region": require("./地区"),
  "user": require("./用户"),
  "date": require("./日期"),

  "title": require("./标题"),
  "titleEdit": require("./标题编辑"),
  "omniEdit": require("./多功能文字"),
  "rich": require("./富文本")
};


// 默认用来渲染输入空间的外壳
const DefaultComponent = React.createClass({
  render() {
    if (this.props.standalone) {
      return <div>{this.props.children}</div>;
    }
    return <div className={"row item multi-line " + (this.props.mode) + (this.props.hasError?" hasError":"") }>
      <div className=" item-head" onClick={this.props.onClick}>
        {this.props.icon}
        {this.props.label}
        {this.props.required?<span className="iconfont icon-star"></span>:""}
      </div>
      <div className={"item-input " + this.props.mode}>
        {this.props.children}
      </div>
    </div>;
  }
});

module.exports = React.createClass({
  propTypes: {
    item: React.PropTypes.object,
    content: React.PropTypes.any
  },

  getInitialState: function() {
    return {content: this.props.content || this.props.defaultValue, hasError: false};
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.content !== nextProps.content) {
      this.state.content = nextProps.content || "";
      if (typeof nextProps.content === "object") {
        this.state.content = Object.assign({}, nextProps.content);
      }
      this.changed = true;
    } else {
      this.changed = false;
    }
  },

  render: function() {
    let item = this.props.item;
    let content = this.state.content;
    let Component = this.props.component || DefaultComponent;

    let type = item.type;
    let Input = componentMap[type];

    let handlers = {
      onChange: this._handleChange,
      onFocus: this._handleFocus,
      onBlur: this._handleBlur,
      onKeyPress: this._handleKeyPress
    };

    let size = item.size;
    let col = "col-xs-12";
    switch(size) {
      case "half":
      case "1/2":
        col = "col-xs-6";
        break;
      case "third":
      case "1/3":
        col = "col-xs-4";
        break;
      case "2/3":
        col = "col-xs-8";
        break;
      default:
        col = "col-xs-12";
    }

    return <div ref="body" className={"item-wrap " + col}>
      <Component ref="component"
        onClick={this.focus}
        icon = {item.icon?<span className={"iconfont icon-" + (item.icon || this.defaultIcon || "menu")} />:""}
        label={<span className="item-label">{item.name}</span>}
        required = {item.required}
        hasError = {this.state.hasError}
        mode = {this.props.mode}
        {...this.props}
        standalone = {Input.standalone}
      >
        {Input?<Input ref="input" {...this.props} {...handlers} />:<div></div>}
      </Component>
    </div>;
  },

  componentDidUpdate() {
    let content = this.state.content;
    let input = this.refs.input;
    if (this.changed !== false && input && JSON.stringify(content) != JSON.stringify(input.getContent()) && input.setContent) {
      input.setContent(content);
    }
  },

  focus() {
    if (this.refs.input && this.refs.input.focus) {
      this.refs.input.focus();
    }
  },

  _handleChange(){
    if (this.props.onChange) {
      let content = this.refs.input.getContent();
      this.state.content = content;
      this.props.onChange(this.props.item, content);
    }
    this.validate();
  },

  _handleFocus() {
    $(this.refs.body).addClass("active");
  },

  _handleBlur() {
    $(this.refs.body).removeClass("active");
  },

  _handleKeyPress(event) {
    if (event.key === "Enter") {
      let thisInput = $(this.refs.body).find("input");
      let nextInput = $(':input:eq(' + ($(':input').index(thisInput) + 1) + ')');
      nextInput.focus();
    }
  },

  forceGetContent() {
    this._handleChange();
  },

  validate() {
    let hasError =  this.validateValue() === false;
    if (this.state.hasError !== hasError) {
      this.setState({hasError: hasError});
    }
    return !hasError;
  },

  // 验证当前输入内容是否符合要求
  validateValue() {
    let item = this.props.item;
    let required = item.required;
    let validate = item.validate;

    if (required && (this.state.content === undefined || this.state.content === "")) {
      return false;
    }

    if (validate && validate(this.state.content) === false) {
      return false;
    }

    return true;
  }
});
