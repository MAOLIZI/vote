import React, { Component, Link } from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES5 with npm
require('./index.less');

/**
 * 使用方法：
 * <Carousel activeId={1} height={360} time={3000} images={['carousel1.jpg', 'carousel2.jpg', 'carousel3.jpg']} />
 */

// propTypes: {
//   images:   React.PropTypes.array.isRequired,   // 轮番图片数组
//   activeId: React.PropTypes.number,             // 当前图片(并非图片名称)，默认 0
//   height:   React.PropTypes.number,             // 当前图片高度，默认 360(px)
//   time:     React.PropTypes.number              // 图片切换的时间间隔，默认 5000ms
// }


export default class ReactCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: this.props.activeId || 0,
      height:   this.props.height || 360,        // 单位 px
      time:     this.props.time || 5*1000        // 单位 ms
    };
  }

  componentWillUnMount() {
    window.clearInterval(this.timer);
  }

  render() {
    // 获取当前（显示）的图片名称：
    let imgName = this.props.images[this.state.activeId];

    // 判定是否传入了 images 或者 传入的是否为 空值：
    let hasNoImg = (this.props.images.length === 0);

    // 轮番图片css样式：
    let styleObj = {};
    if(hasNoImg) {
      styleObj = {
        height: this.state.height + 'px',
        willChange: 'transform'
      };
    }else {
      styleObj = {
        backgroundImage: "url('" + window.ossPath + 'img/' + imgName + "')",
        height: this.state.height + 'px',
        willChange: 'transform'
      };
    }

    return <div className='reactCarousel component'>
      <ReactCSSTransitionGroup transitionName='carousel' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className={'carousel-img ' + (hasNoImg ? 'hasNoImg' : '')} style={styleObj} key={imgName} ></div>
        <div ref='dotGroup' className='dot-group'>
          {this.renderDot()}
        </div>
      </ReactCSSTransitionGroup>
    </div>;
  }

  renderDot() {
    return this.props.images.map( (data, index) => {
      return <span className={'dot ' + ((this.state.activeId === index) ? 'active' : '')}
        onClick={ () => {
          this.setState({activeId: index});
        }} key={index} >
      </span>;
    });
  }

  componentDidMount() {

    /* 让图片下方的点水平居中 */
    let dotGroupW = $(this.refs.dotGroup).width();
    $(this.refs.dotGroup).css('marginLeft', -dotGroupW/2 +'px');

    let imagesL = this.props.images.length;
    /* 每隔一定时间切换图片（名称） */
    this.timer = window.setInterval( () => {
      this.setState({activeId: (this.state.activeId + 1)%imagesL});
    }, this.state.time);
  }
}
