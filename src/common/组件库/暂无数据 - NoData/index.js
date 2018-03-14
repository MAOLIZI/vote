import React, { Component, Link } from "react";
require('./index.less');

/* 2017-8-31 15:14:46 maolizi
 * <NoData desc="该商家还未收到客户的评价 ~" icon="nodata" size={26} />
 * <NoData noicon desc="菜单在二次元空间消失了......"/>
 * <NoData desc="该品牌正陆续上新产品中，敬请期待~" size={42} color="white" />
 * noicon 存在时，不显示 icon图标
 * onClick 存在时，会给整个提示语增加 手指 状态鼠标
 */

// propTypes: {
//   icon: React.PropTypes.string,    // 阿里图标
//   desc: React.PropTypes.string,    // 针对没有数据时的文字描述
//   size: React.PropTypes.number,   // 阿里图标大小
//   color: React.PropTypes.string,   // 图标及文字的颜色
// }


export default class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: this.props.icon || "nodata",
      size: this.props.size || 28,
      color: this.props.color || "#C8C8C8"
    };
  }

  render() {
    return <div
      className={"nodata component" + (this.props.onClick ? " finger" : "")}
      style={
        !this.props.noicon ?
        {marginTop: -(this.state.size + 16)/2 + "px", color: this.state.color}
        :
        {top: 0, color: this.state.color}
      }
      onClick={this.handleClick.bind(this)}
    >
      {
        !this.props.noicon ?
        <span
          className={"icon iconfont icon-" + this.state.icon}
          style={{fontSize: this.state.size + "px", lineHeight: this.state.size + "px"}}
        /> : undefined
      }
      {
        this.props.desc ?
        <div className="desc">{this.props.desc}</div> :
        undefined
      }
    </div>;
  }

  handleClick() {
    if(this.props.onClick) {
      this.props.onClick();
    }
  }
}
