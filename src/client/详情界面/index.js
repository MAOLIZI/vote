import React, {Component, Link} from "react";
import {browserHistory} from "react-router";
import server from "通用/服务器";
import cache from "通用/缓存";

import Background from "组件库/背景 - Background";
import Slider from 'react-slick';
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";
import Message from "antd/lib/message";
import {DataMap} from "投票信息";
import {cutString} from "通用/截取指定长度字符串";


export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true    // 若文件是视频，则进入页面后默认不播放视频
    };
  }

  render() {
    let itemId = parseInt(this.props.params.id, 10);    // typeof 为 string
    let datas = DataMap[itemId] || {};

    return <div className="detail-page" style={{minHeight: $(window).height()+"px"}}>
      {this.renderContent(datas)}
    </div>;
  }

  renderContent(datas) {
    let _file = datas.file;
    // 文件存储路劲
    let filePath = "素材/" + _file + "s/";

    switch (_file) {
      case "text":
        return this.renderTextContent(datas, filePath);
        break;
      case "word":
        return this.renderWordContent(datas, filePath);
        break;
      case "picture":
        return this.renderPictureContent(datas, filePath);
        break;
      case "video":
        return this.renderVideoContent(datas, filePath);
        break;
    }
  }

  renderTextContent(datas, filePath) {
    // 图文背景图采用随机模式 "text"+Math.ceil(Math.random()*3, 1)+".jpg"
    let textBgimg = `url("${window.ossPath}img/text${Math.ceil(Math.random()*3, 1)}.jpg")`;

    // 编译路劲
    filePath = window.ossPath+encodeURIComponent(filePath+datas.poster);
    // filePath = "http://store.streamsoft.cn/railway-dwd/"+encodeURIComponent(filePath+datas.poster);

    return <div className="content text maolizi-bgimg" style={{height: "100%", backgroundImage: textBgimg}}>
      <img
        className="content-head"
        src={filePath}
        style={{width: "100%", height: "auto"}}
      />
      <div className="content-body">
        <div className="title">{datas.title || "　"}</div>
        <div className="subtitle"><span className="iconfont icon-rail" />{datas.subtitle || "　"}</div>
        <div className="main-text" ref={(elm) => {$(elm).html("<p>"+(datas.content || "　").replace(/\n/g, "</p><p>") +"</p>")}} />
      </div>
    </div>;
  }

  renderWordContent(datas, filePath) {
    // 判断是 android 还是 ios
    const isAndroid = (navigator.userAgent.toLowerCase().indexOf("android") >= 0) ? true : false;
    let wordPath = window.ossPath + encodeURIComponent(filePath + datas.content);

    if(isAndroid) {
			return window.location.href = "https://view.officeapps.live.com/op/view.aspx?src=" + wordPath;
		}else {
			return window.location.href = wordPath;
		}
  }

  renderPictureContent(datas, filePath) {
    const settings = {
      initialSlide: 0,    // 默认从第0个开始
      dots: true,
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 300*1000,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    let _content = datas.content || [];

    return <div className="content picture" style={{height: $(window).height()+"px"}}>
      <Slider {...settings}>
        {
          _content.map( (picture, i) => {
            // 编译路劲
            let path = window.ossPath+encodeURIComponent(filePath+picture);

            return <img src={path} key={i} style={{height: $(window).height()/2+"px"}}/>;
          })
        }
      </Slider>
      <div className="desc">{`${cutString(datas.desc, 60) || "　"}`}</div>
    </div>;
  }

  renderVideoContent(datas, filePath) {
    let _paused = this.state.paused;

    return <div className="content video">
      <div className="video-box">
        <img src={window.ossPath + encodeURIComponent(filePath+datas.poster)} />
        {
          _paused ?
          <div onClick={ () => {
            this.setState({paused: !_paused});
            window.location.href = window.ossPath + encodeURIComponent(filePath + datas.content);
          }}>
          <Icon type="play-circle-o" />
          </div> :
        undefined
      }
      </div>
    </div>;
  }

}
