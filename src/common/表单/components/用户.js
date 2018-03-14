
const React = require("react");
const server = require("通用/服务器");

let rolesCache = {};

let Input =  React.createClass({
  getInitialState() {
    return {users: []};
  },
  render() {
    let item = this.props.item;
    let content = this.props.content;
    let mode = item.mode || this.props.mode || "edit";

    var options = this.state.users.map(u => u.realname || u.name);
    options.unshift("");

    return <div className="input-select"><select ref="input"
          className="form-control"
          defaultValue={content?content:item.placeholder}

          onChange={this.props.onChange}
          tabIndex={this.props.tabIndex}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          disabled = {mode === "read"}

          >

          {options.map(function(d) {
            return <option>{d}</option>;
          })}
        </select>{mode==="edit"?<div className="notion">选择</div>:""}</div>;
  },

  componentDidMount() {
    this.loadUserList(this.props.item.match);
  },

  componentWillReceiveProps(nextProps) {
    this.loadUserList(nextProps.item.match);
  },

  async loadUserList(match) {
    if (match) {
      let users = await Input.loadUserList(match);
      this.setState({users: users});

      if (this.props.content) {
        window.setTimeout(() => this.setContent(this.props.content), 1);
      }
    }
  },

  getContent () {
    return $(this.refs.input).val();
  },

  setContent (content) {
    $(this.refs.input).val(content);
  }
});

Input.loadUserList = async function(match) {
  // 使用用户缓存，避免多次发送请求
  let users = rolesCache[match];
  if(!users) {
    users = await server.post("/api/adminusers/query", {
      role: match
    });
    rolesCache[match] = users;
  }

  return users;
};

module.exports = Input;
