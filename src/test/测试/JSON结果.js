const React = require('react');
module.exports = React.createClass({
  render() {
    return <div>
      <div className="responseLabel">{this.props.responseType==="error"?`服务器错误${this.props.responseStatus || ""}`:"服务器返回"}</div>
      <div className="response" ref= "response">{this.renderResponse()}</div>
    </div>;
  },

  renderResponse() {
    let type = this.props.responseType;
    let response = this.props.response || "";
    if (typeof response !== "string") response = JSON.stringify(response, null, 2);
    return <div>
      <pre>{response}</pre>
    </div> ;
  }
});
