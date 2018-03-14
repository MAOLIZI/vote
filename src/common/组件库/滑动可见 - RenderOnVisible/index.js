
import {whenVisible} from "通用/当可见";

const RenderOnVisible = React.createClass({
  getInitialState: function() {
    return {visible: false};
  },
  render: function() {
    if (!this.state.visible) {
      return <div ref="body" style={{minHeight: "80px"}}></div>;
    } else {
      return <div ref="body" style={{minHeight: "80px"}}>{this.props.children || ""}</div>;
    }
  },

  componentDidMount: function() {
    whenVisible(this.refs.body, ()=>this.setState({visible: true}));
  }
});

export {RenderOnVisible};