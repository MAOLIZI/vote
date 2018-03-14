import React, { Component, Link } from "react";
import {browserHistory} from "react-router";
import Background from "组件库/背景 - Background";
import server from "通用/服务器";
import cache from "通用/缓存";


export default class PosterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logined: false
    };
  }

  async componentWillMount() {
    if ( !cache.get("wechatId") ) {
      alert("请先关注“南昌电务段”微信公众号，再进入投票！");
      browserHistory.push("/qrcode");
    }
    
    try {
      let user = await server.post("/api/user/login", {
        wechatId: cache.get("wechatId"),
        filter: cache.get("filter")
      }, false);

      if(user) {
        server.setAuthorizationToken(user.userToken);
        this.state.logined = true;
      }
    }catch (e) {
      let user = await server.post("/api/user/register", {
        wechatId: cache.get("wechatId"),
        filter: cache.get("filter")
      }, false);

      if(user) {
        server.setAuthorizationToken(user.userToken);
        this.state.logined = true;
      }
    }

    this.forceUpdate();
  }

  render() {
    return <div>
      {
        this.state.logined ?
        <div className="poster-page" style={{height: $(window).height()+"px"}} onClick={this.handleTo.bind(this)}>
          <Background image="poster.jpg" />
        </div> :
        undefined
      }
    </div>;
  }

  handleTo() {
    browserHistory.push("/main/list");
  }

}
