import React, {Component, Link} from "react";
import {browserHistory} from "react-router";

import Background from "组件库/背景 - Background";
import server from "通用/服务器";
import cache from "通用/缓存";

import Form from "antd/lib/form";
const FormItem = Form.Item;

import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Message from "antd/lib/message";


class NormalLoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && this.props.onSure) {
        this.props.onSure(values);
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入账号'
              }
            ]
          })(
            <Input prefix={< Icon type = "user" style = {{ fontSize: 13 }}/>} placeholder="账号"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码'
              }
            ]
          })(
            <Input prefix={< Icon type = "lock" style = {{ fontSize: 13 }}/>} type="password" placeholder="密码"/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  render() {
    return <div className="row loginBox" style={{height: "100%"}}>
      <div className="col-xs-8 imgArea"></div>
      <div className="col-xs-4 loginArea">
        <div className="company-logo">
          <img src={window.ossPath + 'img/companyLogo.jpg'} style={{width: "80px", height: "auto"}} />
        </div>
        <div className="company-name">2017年“普通南供人”评选</div>
        <WrappedNormalLoginForm onSure ={this.handleLogin}/>
      </div>
    </div>;
  }

  handleLogin(data) {
    let _username = data.username;
    let _password = data.password;

    server.post("/api/adminusers/login", {
      username: _username,
      password: _password
    }, false).then((user) => {
      if(user) {
        cache.set("user", user);
        cache.set("adminToken", user.adminToken);
        cache.set("access", user.access);
        this.props.router.push("/admin/" + Object.keys(user.access)[0]);
      }else {
        Message.error("用户名或密码错误");
      }
    }, function() {
      if(_username.length === undefined || _password.length === undefined) {
        Message.error("请输入用户名或密码");
      }else {
        Message.error("用户名或密码错误");
      }
    });
  }
}



export default class LoginPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className='login-page'>
      <Background image="loginBG-b.jpg"/>
      <div className='unit'>
        <LoginForm {...this.props}/>
      </div>
    </div>;
  }
}
