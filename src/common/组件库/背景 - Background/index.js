import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import server from "通用/服务器";

require("./index.less");


let images = [];
export default class Background extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: window.ossPath + "img/" + (this.props.image || "default.jpg"),
      offset: 0,
      video: this.props.video
    };
  }

  render() {
    if (this.state.video) {
      return this.renderVideo();
    }

    let img = this.state.image || window.ossPath + "img/" + (this.props.image || "default.jpg");

    return <div>
      <ReactCSSTransitionGroup
        transitionName="background"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}>

        <div key={this.state.image} className={this.props.blur?"component background blur":"component background"} style={{
          backgroundImage: "url('" + this.state.image +  "')"
        }}>
          {this.props.children}
        </div>
      </ReactCSSTransitionGroup>
      {this.props.rotate?
        <div>
          <div className="background-control prev"><span className="iconfont icon-left" onClick={this.handlePrev.bind(this)}/></div>
          <div className="background-control next"><span className="iconfont icon-right1" onClick={this.handleNext.bind(this)}/></div>
        </div>:""}
    </div>;
  }

  renderVideo() {
    return <div className="background" style={this.state.videoPlaying?{}:{
      backgroundImage: "url('" + this.state.image +  "')"
    }}>
      <video
        autoPlay="autoplay"
        style={{opacity: this.state.videoPlaying?1:0}}
        onPlay={() => this.setState({videoPlaying: true})}
        onEnded={this.handleVideoEnd.bind(this)}
        onContextMenu={()=>{return false;}}
      >
        <source src={this.state.video} type='video/mp4' />
      </video>
    </div>;
  }

  handleVideoEnd() {
    this.setState({video: null});
    if (this.props.onVideoEnd) {
      this.props.onVideoEnd();
    }
  }

  componentDidMount() {
    if (this.props.rotate) {
      if (images.length === 0) {
        server.get("/api/backgrounds",{}, false).then((json) => {
          images = (json.images || []).map(img => "http://cn.bing.com" + img.url);
          this.refreshImage();
        });
      } else {
        this.refreshImage();
      }
    }

  }

  handlePrev() {
    this.state.offset = (this.state.offset - 1 + images.length) % images.length;
    this.refreshImage();
  }

  handleNext() {
    this.state.offset = (this.state.offset + 1) % images.length;
    this.refreshImage();
  }

  refreshImage() {
    if (images[this.state.offset]) {
      this.loadImage(images[this.state.offset]);
    }
  }

  loadImage(url) {
    $("<img/>").on('load', () => {
      this.setState({image: url});
    }).attr("src", url);
  }
}
