import React, { Component, Link } from "react";


export default class QRCode extends Component {
  render() {
    return <div className="qrcode-page maolizi-bgimg" style={{
      minHeight: $(window).height()+"px",
      backgroundImage: `url("${window.ossPath}img/qrcode_bg.jpg")`
    }}>
      <div className="qrcode">
        <div className="qr-head">
          <img src={window.ossPath+"img/qrcode.jpg"} />
        </div>
        <div className="qr-body">
          <div className="title intro maolizi-ellipsis">快来关注“南昌电务段”公众微信号</div>
          <div className="subtitle intro maolizi-ellipsis">点击下方“最美信号工”进入投票系统</div>
        </div>
      </div>
    </div>;
  }
}
