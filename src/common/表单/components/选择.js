
const React = require("react");

module.exports =  React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;

    var options = [].concat(item.options);

    if(item.placeholder && options.indexOf(item.placeholder) < 0) {
      options.unshift(item.placeholder);
    }

    if (options.indexOf(content) < 0) {
      content = item.placeholder;
    }

    return <div className="input-select"><select ref="input"
          className="form-control"
          defaultValue={content?content:item.placeholder}

          onChange={this.props.onChange}
          tabIndex={this.props.tabIndex}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          disabled = {this.props.mode === "read"}
          >

          {options.map(function(d) {
            return <option>{d}</option>;
          })}
        </select>{this.props.mode==="edit"?<div className="notion">选择</div>:""}</div>;
  },

  getContent () {
    return $(this.refs.input).val();
  },

  setContent (content) {
    $(this.refs.input).val(content);
  }
});
