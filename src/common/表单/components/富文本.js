const loadScript = require("通用/动态载入脚本");

const RichText = React.createClass({
  render() {
    let item = this.props.item;
    let content = this.props.content;
    let id = "editor" + Date.now();
    this.id = id;
    return <div className="item richtext">
      <div className="item-head">{item.name}</div>
      <div className="item-input">
        <textarea ref="input"
          id={id}
          className={"richtext " + id}
          defaultValue={content}
          placeholder={item.placeholder || ""}
          tabIndex={this.props.tabIndex}
          onChange={this.props.onChange}
        />
      </div>
    </div>;
  },

  async componentDidMount() {
    try {
      await loadScript("/admin/ext/ueditor/ueditor.config.js");
      await loadScript("/admin/ext/ueditor/ueditor.all.min.js");
      await loadScript("/admin/ext/ueditor/lang/zh-cn/zh-cn.js");
      if (!window.UE) {
        throw "UE没有正确载入";
      }
    } catch(e) {
      return alert("载入编辑脚本失败，请检查网络链接，刷新重试");
    }

    const UE = window.UE;
    this.editor = UE.getEditor(this.id);
    this.editor.addListener("ready", () => {
      this.setContent(this.props.content);
    });
  },

  componentWillUnmount() {
    if (this.editor) {
      this.editor.destroy();
    }
  },

  focus() {
    $(this.refs.input).focus();
  },

  getContent: function() {
    if (this.editor) {
      return this.editor.getContent();
    }
    return "";
  },

  setContent: function(val) {
    if (this.editor && val !== undefined) {
      this.editor.setContent(val || "");
    }
  }
});

RichText.standalone = true;

export {RichText};
