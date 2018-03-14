const React = require("react");
const dateUtil = require("通用/日期");

module.exports = React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;
    content = dateUtil.formatDate(content);

    return <div><input ref="input"
      type={item.type==="password"?"password":"text"}
      className="form-control"
      defaultValue={content || this.props.defaultValue}
      placeholder={item.placeholder || ""}
      tabIndex={this.props.tabIndex}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onBlur={this.handleBlur}
      onKeyPress={this.props.onKeyPress}
      style={{textAlign: item.postfix?"right":"left"}}
      disabled = {this.props.mode === "read"}
    />{item.postfix?<div className="notion">{item.postfix}</div>:""}</div>;
  },

  focus() {
    $(this.refs.input).focus();
  },

  handleBlur(event) {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    this.setContent(this.getContent());
  },

  getContent: function() {
    let val =  $(this.refs.input).val();
    return dateUtil.formatDate(val);
  },

  setContent: function(val) {
    val = dateUtil.formatDate(val);
    $(this.refs.input).val(val);
  }
});
