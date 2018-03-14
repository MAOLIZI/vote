const React = require("react");

function split(text) {
  let parts = text.split(" ");
  let unit = parts.pop();
  return {
    text: parts.join(" "),
    unit: unit
  }
}

module.exports = React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;
    if (content) {
      content = split(content);
    }

    return <div className="input-duration"><input ref="input"
      type={item.type==="password"?"password":"text"}
      className="form-control"
      defaultValue={content?content.text:this.props.defaultValue}
      placeholder={item.placeholder || ""}
      tabIndex={this.props.tabIndex}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onBlur={this.props.onBlur}
      onKeyPress={this.props.onKeyPress}
      style={{textAlign: item.postfix?"right":"left"}}
      disabled = {this.props.mode === "read"}
    />
    <select ref="unitInput"
        className="form-control"
        defaultValue={content?content.unit:(item.options || [])[0]}
        onChange={this.props.onChange}
        tabIndex={this.props.tabIndex + 1}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        disabled = {this.props.mode === "read"}

        >
        {(item.options || []).map(function(d) {
          return <option>{d}</option>;
        })}
      </select>
    </div>;
  },

  focus() {
    $(this.refs.input).focus();
  },

  getContent: function() {
    return $(this.refs.input).val() + " " + $(this.refs.unitInput).val();
  },

  setContent: function(val) {
    let value = split(val);
    $(this.refs.input).val(value.text);
    $(this.refs.unitInput).val(value.unit);
  }
});
