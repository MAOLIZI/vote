import React, { Component, Link } from "react";
import {browserHistory} from "react-router";

import NoData from "组件库/暂无数据 - NoData";
import {retrieveTypeInfos} from "投票所设类别信息";


function changeTypeInfo(typeId, menus) {
  return (menus.filter( d => d.id===typeId )[0] || []);
}


class SMenu extends Component {
  render() {
    let menu = this.props || {},
    oddTypeInfo = changeTypeInfo(menu.odd, this.props.menus),
    evenTypeInfo = changeTypeInfo(menu.even, this.props.menus);

    return <div className="single-group">
      {this.renderTypeItem(oddTypeInfo, "58.7%")}
      {menu.even ? this.renderTypeItem(evenTypeInfo, "100%") : undefined}
    </div>;
  }

  renderTypeItem(infos, bgimgWidth) {
    /**
     * 支持类别数目为奇数时，最后一个类别单独占满整行显示；
     * 支持类别数目为奇数的情况，奇数时，默认显示banner，没有banner再显示bgimg或者default.jpg
     */

    infos  = infos || {};
    let _even = this.props.even;
    let _lastOne = this.props.lastOne;
    let _bgimg = window.ossPath + "img/" + ((_even ? infos.bgimg : infos.banner) || "default.jpg");

    return <div className="single-menu"
      style={{width: (_even ? "50%" : "100%"), zIndex: (_even ? "100" : "88")}}
      onClick={(e) => {
        e.stopPropagation();
        browserHistory.push("/main/list/" + infos.id);
      }}
    >
      <img className="bgimg" src={_bgimg} style={{width: (_lastOne || !_even) ? "100%" : bgimgWidth}}/>
      <div className="mask" />
      <div className="intro" style={infos.subtitle ? {} : {marginTop: "12px"}}>
        <div className="title maolizi-ellipsis"><span className={"iconfont icon-"+(infos.icon || "default")} />{infos.title || "　"}</div>
        <div className="subtitle maolizi-ellipsis">{infos.subtitle || ""}</div>
      </div>
    </div>;
  }
}

class TMenus extends Component {
  render() {
    let menus = this.props.menus || [];
    let menusLen = menus.length;

    // 将两个两个id组合在一起，类别是奇数的最后一个的id单独放入一个数组
    let indexGroup = [];
    for (let i=0; i<menusLen; i+=2) {   // 一次性加 2个
      let yy = menus[i];
      let tt = menus[i+1];

      if (tt) {
        indexGroup.push([yy.id, tt.id]);
      }else {
        indexGroup.push([yy.id]);
      }
    }

    if(menusLen > 0) {
      return <div className="total-menus">
        {
          indexGroup.map( (d, i) => {
            return <SMenu odd={d[0]} even={d[1]} lastOne={i===(menusLen-1)} key={i} menus={menus} />;
          })
        }
      </div>;
    }else {
      return <NoData desc="暂无可投票类别 ~" />;
    }
  }
}


export default class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTypeInfos: []
    };
  }

  render() {
    return <div className="menu-page" style={{minHeight: $(window).height()+"px"}}>
      <img className="menu-header" src={`${window.ossPath}img/page_head.jpg`} style={{width: "100%"}}/>
      <div className="menu-body content">
        <TMenus menus={this.state.totalTypeInfos || []} />
      </div>
    </div>;
  }

  async componentDidMount() {
    this.state.totalTypeInfos = await retrieveTypeInfos();

    if (this.state.totalTypeInfos && this.state.totalTypeInfos.length === 1) {
      browserHistory.push("/main/list/" + this.state.totalTypeInfos[0].id);
    }else {
      this.forceUpdate();
    }
  }
}
