const React = require("react");
const numeral = require("numeral");

module.exports = React.createClass({
  notion: function(item, mode) {
    return (item.postfix || "元") + (item.required?"(必填)":"");
  },

  render() {
    let item = this.props.item;
    let content = this.props.content;

    return <div><input ref="input"
      type={item.type==="password"?"password":"text"}
      className="form-control"
      defaultValue={content}
      placeholder={item.placeholder || ""}
      onBlur={this.handleBlur}

      tabIndex={this.props.tabIndex}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onKeyPress={this.props.onKeyPress}
      disabled = {this.props.mode === "read"}

    /><div className="notion">{item.postfix || "元"}</div></div>;
  },

  handleBlur() {
    let content = $(this.refs.input).val();
    let text = format(content);
    $(this.refs.input).val(text);
    if (this.props.onBlur) {this.props.onBlur();}
  },

  getContent: function() {
    return numeral($(this.refs.input).val()).value();
  },

  setContent: function(val) {
    let text = format(val);
    $(this.refs.input).val(text);
  }
});


function format(content) {
  if (!content) return "";
  return numeral(content).format("0,0.00");
}
