import React, { Component } from "react";
import server from "通用/服务器";
import cache from "通用/缓存";

import ApiForm from "./接口信息";
import JSONResult from "./JSON结果";
import List from "组件库/列表 - List";
import Form from "表单";
import Input from "表单/组件";


class Histroy extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  render() {
    return <div className="row list"  ref="list" >
      <div className="col-xs-6 api">{this.props.method+" "+this.props.url}</div>
      <div className="col-xs-5 date">{this.props.now}</div>
      <div className="col-xs-1 lookBtnArea">
        <button className="btn"onClick={this.handleSetting.bind(this)} ref="look">查看</button>
      </div>
      <div className="col-xs-12" style={{display:"none"}} ref="detail">
        <div className="row">
          <h3 className="col-xs-12">成功</h3>
          <div className="col-xs-12">
            参数：
            {
              (this.getParams()).length>0?this.renderParams(this.getParams()):" 无"
            }
          </div>
          <div className="col-xs-12 reSendBtnArea">
            <button className="btn" onClick={this.handleReSend.bind(this)}>重新发送</button>
          </div>
        </div>
      </div>
    </div>;
  }

  handleReSend() {
    if(this.props.onHistroySend){

      let now = new Date();
      let date = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();

      //改变重新发送的时间，保持实时时间。
      this.state['now'] = date;
     this.props.onHistroySend(this.state);
    }
  }

  getParams() {
    let params = Object.keys(this.props).filter(d=>{
      //排除url、method、now
      return d !=="url" && d !=="method" && d !=="now"  && d !== "list_index" && d !== "onHistroySend";
    })
    return params;
  }

  renderParams(params) {
    let items = params.map(d=>{
      return {
        type:"text",
        name:d,
        uuid:d,
        size:"half",
      }
    })
    return <Form items = {items} content = {this.props} />;
  }

  handleSetting() {
    $(this.refs.list).toggleClass("opened");
    if($(this.refs.list).hasClass("opened")){
      $(this.refs.detail).slideDown();
      $(this.refs.look).text("关闭");
    }else{
      $(this.refs.detail).slideUp();
      $(this.refs.look).text("查看");
    }
  }
}



export default class PosterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apis: [],
      response: {},
      histroy: cache.get("histroy")
    };
  }

  render() {
    return <div ref="page" className="row test-page">
      <div className="col-xs-4 histroy">
        <div className="row">
          <h3 className="col-xs-6">历史访问</h3>
          <div className="col-xs-6 delAllHistroy">
            <button className="btn" onClick={this.handleDelAllHistroy.bind(this)}>清除所有历史</button>
          </div>
        </div>

        <List items = {this.state.histroy ||[]}>
          <Histroy  onHistroySend={this.handleSend.bind(this)}/>
        </List>
      </div>
      <div className="col-xs-8 inner">
        <ApiForm apis={this.state.apis} onSend={this.handleSend.bind(this)}/>
        <JSONResult {...this.state.response}/>
      </div>
    </div>;
  }

  componentDidMount() {
    server.get("/api/apis").then(apis =>{
      this.setState({apis: apis});
    });
  }

  refreshHistroy(histroy){
    this.setState({histroy:histroy});
  }

  handleDelAllHistroy(){
    cache.del("histroy");
    this.setState({histroy:[]});
  }

  setCache(content){
    let histroy = cache.get("histroy");
    if(histroy){
      histroy.push(content);
      cache.set("histroy",histroy);
    }else{
      cache.set("histroy",[content]);
    }
    this.refreshHistroy(cache.get("histroy"));
  }

  handleSend(content) {
    if(content){
      let url = content.url;
      let method = content.method.toLowerCase();
      if (method === "delete") method = "sendDelete";
      let that = this;
      server[method](url, content).then(function(json) {
        $(that.refs.page).removeClass("error");
        that.setState({
          response:{
            responseType: "success",
            response: json,
            responseStatus: this.response?this.response.status:""
          }
        });

        that.setCache(content);

      }, function (error) {
        $(that.refs.page).addClass("error");
        that.setState({
          response: {
            responseType: "error",
            response: error,
            responseStatus: this.response?this.response.status:""
          }
        });
      });
    }
  }

}
