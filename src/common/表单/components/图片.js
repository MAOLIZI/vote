const React = require("react");
const Dropzone = require('react-dropzone');
const server = require("通用/服务器");
const List = require("组件库/列表 - List");
const cache = require("通用/服务器");
const download = require("通用/下载");

const ImageBox = React.createClass({
  render() {
    let extension = this.props.src.split(".").pop();
    extension = extension.toLowerCase();
    let filename = decodeURIComponent(this.props.src.split("/").pop() || "");
    let src = this.props.src;
    if (["jpg", "jpeg", "png", "gif"].indexOf(extension) >= 0) {
      return <div className="form-imagebox" style={{backgroundImage: `url(${this.props.src})`}}>
        {this.props.mode==="edit"?<div className="iconfont icon-wrong remove-button button" onClick={() => this.props.onDelete(this.props.src)}></div>:""}
        <div className="iconfont icon-download download-button button" onClick={this.handleDownload}></div>
      </div>;
    } else {
      return <div className="form-imagebox">
        {this.props.mode === "edit"?<div className="iconfont icon-wrong remove-button button" onClick={() => this.props.onDelete(this.props.src)}></div>:""}
        <a className="iconfont icon-download download-button button" href={this.props.src} download={decodeURIComponent(this.props.src.split("/").pop())}></a>
        <div className="filename">
          <div className="iconfont icon-email" />
          {filename}
        </div>
      </div>;
    }
  },

  handleDownload() {
    download(this.props.src);
  }
})

module.exports = React.createClass({
  getInitialState() {
    return {content: this.props.content || []}
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.content) {
      this.state.content = nextProps.content;
    }
  },

  render() {
    let item = this.props.item;
    let content = this.state.content;
    let singleImage = item.single === true;

    if (!Array.isArray(content) ) {content = [];}
    content = [].concat(content).map(d=> {return {src: d};});
    return <div className={"form-upload " + this.props.mode}>
      <List items={content}>
        <ImageBox onDelete={this.handleDelete} mode={this.props.mode}/>
      </List>
      {
        (!singleImage || content.length === 0)?<div className="form-dropzone">
          <Dropzone onDrop={this.onDrop} style={{
            width: "180px",
            height: "120px",
            borderWidth: 2,
            borderColor: "#666",
            borderStyle:"dashed",
            borderRadius: 5
          }}>
            <div><span className="iconfont icon-icon1"></span></div>
          </Dropzone>
        </div>:""
      }

    </div>;
  },

  handleDelete(src) {
    let index = this.state.content.indexOf(src);
    if (index >= 0) {
      this.state.content.splice(index, 1);
    }
    this.forceUpdate();
    if (this.props.onChange) {
      this.props.onChange()
    }
  },

  onDrop(files) {
    server.upload("/api/upload", files).then((urls) => {
      if (!Array.isArray(this.state.content)) this.state.content = [];
      this.state.content= this.state.content.concat(urls);

      this.forceUpdate();
      if (this.props.onChange) {
        this.props.onChange()
      }
    });
  },

  getContent: function() {
    return this.state.content;
  },

  setContent: function(content) {
    let ret = content;

    // 将非数组的对象转换为数组
    if (!Array.isArray(content) && typeof content === "object") {
      ret = [];
      for (let key in content) {
        if (typeof content[key] === "string") {
          ret.push(content[key]);
        }
      }
    }
    this.state.content = content;
    this.forceUpdate();
  }
});
