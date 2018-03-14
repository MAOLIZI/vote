const React = require("react");

module.exports = React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;

    return <textarea ref="input"
      className="form-control"
      defaultValue={content}
      placeholder={item.placeholder || ""}
      tabIndex={this.props.tabIndex}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onBlur={this.props.onBlur}
      disabled = {this.props.mode === "read"}

     />;
  },

  componentDidMount() {
    if (this.props.item.autoResize !== false) {
      let input = $(this.refs.input);
      input.css("minHeight", 20);

      input.css("height", this.refs.input.scrollHeight);

      input.on("change keyup", () => {
        input.css("height", this.refs.input.scrollHeight);
      });
    }
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
