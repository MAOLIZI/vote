import React, { Component, Link } from "react";
require('./index.less');

/*
参数说明：
  persent  -→  页面分栏左侧第一个children所占的百分比（无需加 % 符号）；
               不传则使用默认（20）；所传值 x 符合: 0 < x < 100;

  注意：目前只支持左右2个分栏，2个以上不支持！！！

搭配图标：
  无

方法一：
  <Subfield persent={30} />
    <div>XXXXXXXXXXX</div>
  </Subfield>

方法二：
  <Subfield />
    <div>XXXXXXXXXXX</div>
  </Subfield>
*/



export default class Subfield extends Component {
  render() {
    return <div className='subfield component'>
      {this.renderSubfield()}
    </div>;
  }

  renderSubfield() {
    let _persent = this.props.percent || 20;    // 设置默认占比 20%
    let childLen = this.props.children.length;

    if(childLen > 1) {
      return <div style={{height: '100%',width:'100%'}}>
        <div className='leftSub' style={{width: _persent + '%'}}>
          {this.props.children[0]}
        </div>
        <div className='rightSub' style={{width: (100-_persent) + '%'}}>
          {this.props.children[1]}
        </div>
      </div>;
    }else {
      return <div className='leftSub' style={{width: _persent + '%'}}>{this.props.children}</div>;
    }
  }
}
