const React = require("react");
const server = require("通用/服务器");
const Form = require("表单");
const Input = require("表单/组件");

const InputComponent = React.createClass({
  render() {
    return <div className="row">
      <div className="form-label">{this.props.label}</div>
      <div className="form-input">{this.props.children}</div>
    </div>
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    return {apiIndex: 0, group: ""};
  },

  render: function() {
    let apis = this.props.apis || [];
    let groups = {};
    for (let api of apis) {
      if (Array.isArray(api.method)) {
        for (let m of api.method) {
          let a = $.extend({}, api);
          a.method = m.toUpperCase();
          let group = a.group || "未编组";
          if (!groups[group]) groups[group] = [];
          groups[group].push(a);
        }
      } else {
        api.method = api.method.toUpperCase();
        let group = api.group || "未编组";
        if (!groups[group]) groups[group] = [];
        groups[group].push(api);
      }
    }
    let group = this.state.group || Object.keys(groups)[0];
    let currentAPI = ((groups[group]||[])[this.state.apiIndex] || {});
    return <div className="" ref="body">
      <div className="sendPanel">
        <div className="apiPanel">
          <div>
            <select ref="group" className="apiSelect form-control" onChange={this.handleGroupChange} value={group}>
              {Object.keys(groups).map(function(group) {return <option value={group}>{group} </option>;})}
            </select>
          </div>
          <div>
            <select ref="api" className="apiSelect form-control" onChange={this.handleApiChange} value={this.state.api}>
              {(groups[group]||[]).map(function(api, index) {return <option value={index}>{api.method + " " + api.path} </option>;})}
            </select>
          </div>
        </div>
        <div className="desc" ref="desc">{(currentAPI.desc || "")}</div>
        <div className="params">
          {this.renderInput(groups[group]||[])}
        </div>
        <div>
          <Form ref="form" component = {InputComponent} className="form-group" content={{url: "/api" + currentAPI.path, method: currentAPI.method}}>
            <Input type="text" name = "地址" uuid="url" />
            <Input type="select" name="方式" uuid="method" options={["GET", "POST", "PUT", "DELETE"]}/>
          </Form>

          {/* {params.map(function(field) {
            return <div className="form-group" >
              <div className="col-xs-4 control-label">{typeof field === "string"?field:field.name}</div>
              <div className="col-xs-8">
                {that.renderInput(field)}
              </div>
            </div>;
          })} */}

        </div>
        <div>
          <button className="btn sendButton" onClick = {this.handleSend}>发送</button>
        </div>
      </div>
    </div>;
  },
  renderInput(arr){
    //拿过滤后的数组再去通过apiIndex去显示接口名称
    if(arr.length>0){
      let obj = arr[this.state.apiIndex].validate;
      let params = $.extend({},obj.params?obj.params:{},obj.body?obj.body:{});

      let paramsArr = Object.keys(params).map(key=>{
        return {
          type:"text",
          name:key,
          uuid:key,
          size:"half",
          placeholder:params[key].indexOf("required")>0?"必填":"选填"
        }
      });
      return (
          <div>
            <div>输入以下参数</div>
            <Form ref ="params" items = {paramsArr} />
          </div>
      )

     }


  },
  // renderInput(def) {
  //   let type = typeof def === "string"?"input":def.type;
  //   let name = typeof def === "string"?def:def.name;
  //
  //   if (typeof def === "string" && def.toLowerCase().indexOf("token") >= 0 && stream.get(def)) {
  //     type = "token";
  //   }
  //   switch(type) {
  //     case "input":
  //       return 	<input className= "form-control" type="text" placeholder = {translation[name] || name} data-name={name} key={name}/>;
  //     case "select":
  //       return <select className="form-control" data-name={name} key={name}>{
  //         (def.selection || []).map(d=><option>{d}</option>)
  //       }</select>;
  //     case "fix":
  //       return 	<input className= "form-control readonly" type="text" readonly={true} placeholder = {translation[name] || name} data-name={name} key={name} value={def.value}/>;
  //     case "token":
  //       return 	<input className= "form-control readonly" type="text" readonly={true} placeholder = {translation[name] || name} data-name={name} key={name} value={stream.get(name)}/>;
  //     default:
  //       return <div>该字段定义错误，请更改api.js</div>;
  //   }
  // },

  handleGroupChange: function() {
    let group = $(this.refs.group).val();
    //每次更新接口组别，apiIndex都从帅选出组别的第一个元素里面去填充这个接口对应的参数。
    this.setState({group:group, apiIndex: 0});
  },

  handleApiChange: function() {
    let apiIndex = $(this.refs.api).val();
    this.setState({apiIndex: apiIndex});
  },

  handleSend: function() {
    let now = new Date();
    let date = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
    let content = $.extend({}, this.refs.form.state,this.refs.params.state,{now:date});
    if (this.props.onSend) {
      this.props.onSend(content);
    }
  }
});
