const React = require("react");

module.exports = React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;

    return <div><input ref="input"
      type={item.type==="password"?"password":"text"}
      className="form-control"
      defaultValue={content || this.props.defaultValue}
      placeholder={item.placeholder || ""}
      tabIndex={this.props.tabIndex}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onBlur={this.props.onBlur}
      onKeyPress={this.props.onKeyPress}
      style={{textAlign: item.postfix?"right":"left"}}
      disabled = {this.props.mode === "read"}
    />{item.postfix?<div className="notion">{item.postfix}</div>:""}</div>;
  },

  focus() {
    $(this.refs.input).focus();
  },

  getContent: function() {
    return $(this.refs.input).val();
  },

  setContent: function(val) {
    $(this.refs.input).val(val);
  }
});
