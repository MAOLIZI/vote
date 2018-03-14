
const React = require("react");
const ImageInput = require("./图片");

const OmniEdit = React.createClass({
  getInitialState: function() {
    let content = Object.assign({}, this.props.content || this.props.defaultValue);
    return {content: content, imageMode: Array.isArray(content.value)};
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.content) {
      this.state.content = nextProps.content;
      this.state.imageMode = Array.isArray((this.state.content || {}).value);
    }
  },

  render() {
    let item = this.props.item;
    let content = this.state.content || {};
    let imageMode = this.state.imageMode;
    let mode = item.mode || this.props.mode || "edit";

    console.log("PROPS", this.props);
    return <div className={"col-xs-12 item omniEdit "  + mode}>
      <div className="item-head">
        <input ref="head_input"
          type="text"
          className="form-control"
          defaultValue={content.key || this.props.defaultValue}
          placeholder={item.headPlaceholder || ""}
          tabIndex={this.props.tabIndex}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onKeyPress={this.props.onKeyPress}
          disabled = {mode === "read"}

        />
      </div>
      <div className="item-input" style={{position: "relative"}}>
        {!this.state.imageMode?
          <textarea ref="input"
            type="text"
            className= {"form-control" + (this.eligibleForMulti(content.value)?" multi":"")}
            defaultValue={content.value || this.props.defaultValue}
            placeholder={item.placeholder || ""}
            tabIndex={this.props.tabIndex + 1}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onKeyUp={this.handleKeyUp}
            disabled = {mode === "read"}
          />:
          <ImageInput ref="image"
            {...this.props}
            defaultValue={content.value}
            content={content.value}
            onChange={this.handleImageChange}
            mode = {mode}
          />}

        <div ref="camera" onClick={this.switchMode} className={"camera-button" + (content.value?" hide":"")}><span className={"iconfont " + (this.state.imageMode?" icon-edit":" icon-camera")} /></div>
      </div>

    </div>;
  },

  focus() {
    if (this.state.imageMode) {
      return this.refs.image.focus();
    }
    $(this.refs.input).focus();
  },

  getContent: function() {
    return {
      key: $(this.refs.head_input).val(),
      value: this.state.imageMode?this.refs.image.getContent():$(this.refs.input).val()
    };
  },

  setContent: function(val) {
    if (typeof val !== "object") {
      val = {};
    }
    $(this.refs.head_input).val(val.key);
    if (Array.isArray(val.value) && this.refs.image) {
      this.refs.image.setContent(val)
    } else {
      $(this.refs.input).val(val.value);
    }
  },

  eligibleForMulti(content) {
    content = content !== undefined?content:$(this.refs.input).val();
    if (content && (content.length > 30 || content.indexOf("\n") >= 0)) {
      // 切换至多行显示
      return true;
    }
    return false;
  },

  handleKeyUp: function() {
    let content = $(this.refs.input).val();
    if (this.eligibleForMulti(content)) {
      // 切换至多行显示
      $(this.refs.input).addClass("multi");
    } else {
      // 切换至单行显示
      $(this.refs.input).removeClass("multi");
    }
    if (!content) {
      $(this.refs.camera).removeClass("hide");
    } else if (!$(this.refs.camera).hasClass("hide")) {
      $(this.refs.camera).addClass("hide");
    }
  },

  switchMode() {
    this.setState({imageMode: !this.state.imageMode});
  },

  handleImageChange() {
    if (!$(this.refs.camera).hasClass("hide")) {
      $(this.refs.camera).addClass("hide");
    }
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
});

OmniEdit.standalone = true;

export {OmniEdit};
