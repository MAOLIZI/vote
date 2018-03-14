const React = require("react");

module.exports = React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;

    return <input ref="input"
      type={item.type==="password"?"password":"text"}
      className="form-control"
      defaultValue={content || this.props.defaultValue}
      placeholder={item.placeholder || ""}
      tabIndex={this.props.tabIndex}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onBlur={this.props.onBlur}
      onKeyPress={this.handleKeyPress}
     />;
  },

  focus() {
    $(this.refs.input).focus();
  },

  getContent: function() {
    return $(this.refs.input).val();
  },

  setContent: function(val) {
    //搜索框无法设置内容
    //$(this.refs.input).val(val);
  },

  handleKeyPress(event) {
    if (event.key === "Enter") {
      if (this.props.item.onPressEnter) {
        this.props.item.onPressEnter(event);
      } else if (this.props.onKeyPress) {
        this.props.onKeyPress(event);
      }
    }
  }
});
