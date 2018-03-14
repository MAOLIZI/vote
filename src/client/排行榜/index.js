import React, {Component, Link} from "react";
import {browserHistory} from "react-router";

import server from "通用/服务器";
import cache from "通用/缓存";
import NoData from "组件库/暂无数据 - NoData";
import {ConvertData, DataReady} from "投票信息";

import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Spin from "antd/lib/spin";

const TopHeadH = 150;   // 顶部海报或者背景图的高度值


class STypeRanking extends Component {
  render() {
    let caption = this.props.caption || "　";
    let datas = this.props.datas || [];
    let _this = this;

    datas = datas.sort( (t, y) => (y.votes - t.votes));

    return <div className="single-ranking">
      {/* <div className="single-head maolizi-caption">{caption || "　"}</div> */}
      <div className="single-body">
        <Row className="caption">
          <Col span={9} className="number-and-title">
            <span className="sort-number"><span className="iconfont icon-sort" /></span>
            <span className="title">姓名</span>
          </Col>
          <Col span={10} className="subtitle">单位名称</Col>
          <Col span={5} className="vote-number text-right">票数</Col>
        </Row>
        {
          datas.map( (d, i) => {
            return <Row className="unit" key={d.name || i}>
              <Col span={9} className="number-and-title maolizi-ellipsis">
                <span className="sort-number number">{_this.renderIndex(i+1)}</span>
                <span className="title">{d.title || "　"}</span>
              </Col>
              <Col span={10} className="subtitle maolizi-ellipsis">{d.subtitle || "　"}</Col>
              <Col span={5}  className="vote-number number maolizi-ellipsis text-right">{d.votes || 0}</Col>
            </Row>;
          })
        }
      </div>
    </div>;
  }

  renderIndex(index) {
    index = index || 0;

    if(index === 1) {
      return <img src={window.ossPath + "img/gold.png"} />;
    }else if(index === 2) {
      return <img src={window.ossPath + "img/silver.png"} />;
    }else if(index === 3) {
      return <img src={window.ossPath + "img/copper.png"} />;
    }else{
      return <span className={(index>=10) ? "bigger" : "normal"}>{index}</span>;
    }
  }
}


class RankingList extends Component {
  render() {
    let datas = this.props.datas || {};
    let captions = Object.keys(datas) || [];

    if(captions.length > 0) {
      return <div className="total-type-ranking">
        {
          captions.map( (d, i) => {
            return <STypeRanking caption={d} datas={datas[d]} key={i} />;
          })
        }
      </div>;
    }else {
      return <NoData icon="nodata_text" size={60} />;
    }
  }
}


export default class RankingPage extends Component {
  async componentDidMount() {
    // 确保已载入所有数据
    await DataReady();
    
    // 确保载入数据后，应当强制刷新
    this.forceUpdate();
  }

  render() {
    return <div className="ranking-page">
      <div className="maolizi-icon" onClick={this.handleMenuIcon.bind(this)} >
        <span className="iconfont icon-home" />
      </div>
      <img className="ranking-header" src={`${window.ossPath}img/banner.jpg`} style={{width: "100%"}}/>
      <div className="ranking-body" style={{position: "relative", minHeight: ( $(window).height() - TopHeadH ) + "px"}}>
        <RankingList datas={ConvertData} />
      </div>
    </div>;
  }

  handleMenuIcon() {
    browserHistory.push("/main/poster");
  }
}
