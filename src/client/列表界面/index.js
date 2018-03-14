import React, { Component, Link } from "react";
import {browserHistory} from "react-router";

import server from "通用/服务器";
import cache from "通用/缓存";
import NoData from "组件库/暂无数据 - NoData";

import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Message from "antd/lib/message";
import Spin from "antd/lib/spin";
import Input from "antd/lib/input";
import Badge from "antd/lib/badge";
const Search = Input.Search;

import {cutString} from "通用/截取指定长度字符串";
import {RenderOnVisible} from "组件库/滑动可见 - RenderOnVisible";
import {Running, DataArray, Subjects, UserDataVoted, ConvertData, DataMap, DataReady} from "投票信息";

const ListHeadH = 150;    // 列表顶部的海报高度值
let headImg;    // 页面顶部的海报图片


class SUnit extends Component {
  render() {
    let unit = this.props || {};
    // console.log("unit =>>", unit);

    let unitImg = window.ossPath + encodeURIComponent("素材/"+unit.file+"s/"+unit.poster);
    // let unitImg = "http://store.streamsoft.cn/railway-dwd/" + encodeURIComponent("素材/"+unit.file+"s/"+unit.poster);

    // 判定按钮处于何种状态
    let btnStatus = unit.voted?" voted":(unit.selected?" selected":"");

    return <Row className="single-unit">
      <Col span={10}>
        <RenderOnVisible>
          <div className="img-area maolizi-bgimg" style={{backgroundImage: `url("${unitImg}")`}} onClick={this.handleToDetail.bind(this)}/>
        </RenderOnVisible>
      </Col>
      <Col span={14} className="content-area">
        <div className="title maolizi-ellipsis">
          <span className={"icon iconfont icon-author " + ((unit.sex===1)?"male":"female")} />{unit.title || "　"}
        </div>
        <div className="subtitle maolizi-ellipsis">
          <span className="icon iconfont icon-rail" /> {unit.subtitle || "　"}
        </div>
        <div className={"vote-number"+btnStatus}>
          <span className={"icon iconfont icon-"+(unit.voted?"hearted":"heart")} />
          <span className="number">{unit.votes || 0}</span>
        </div>
        <div className="vote-btn">
          <div className={"maolizi-vote voting"+btnStatus} onClick={this.handleClick.bind(this)}>
            {unit.voted?"已点赞":(unit.selected?"已选中":"为TA点赞")}
          </div>
        </div>
      </Col>
      <Icon type="right" className="arrow" onClick={this.handleToDetail.bind(this)} />
      {
        (unit.desc && unit.desc.length>0) ?
        <div className="desc">{cutString(unit.desc, 60) || "　"}</div> : undefined
      }
    </Row>;
  }

  handleToDetail() {
    browserHistory.push("/main/detail/" + this.props.id);
  }

  async handleClick(e) {
    e.stopPropagation();

    if(Running===false) {
      return Message.warning("非活动进行时间，暂不能投票！");
    }

    // 改变 selected 值, voted 由服务器获取，由父组件去搜索并计算
    // 不改变 props 和 state，直接在数据上修改
    let currentWork = DataMap[this.props.id];
    currentWork.selected = !currentWork.selected;

    if(this.props.onVote) {
      this.props.onVote(this.props.id);
    }
  }
}


class SType extends Component {
  render() {
    let caption = this.props.caption || "";
    let list = this.props.list || [];
    let onVote = this.props.onVote || function() {};

    if(list.length > 0) {
      // 若有sortby字段，则按sortby排序显示作品; 没有则按表格 id来排序
      if(list[0].sortby) {
        list = list.sort( (t, y) => t.sortby - y.sortby);
      }

      return <div className="single-type">
        {/* <div className="head maolizi-caption">{caption || "　"}</div> */}
        <div className="body">
          {
            list.map( (d, i) => {
              return <SUnit onVote={onVote} {...d} key={i} />;
            })
          }
        </div>
      </div>;
    }else {
      return <div></div>;
    }
  }
}


class VoteList extends Component {
  render() {
    let datas = this.props.datas || {};
    let onVote = this.props.onVote || function() {};

    let captions = Object.keys(datas) || [];

    if(captions.length > 0) {
      return <div className="total-types">
        {
          captions.map( (d, i) => {
            return <SType onVote={onVote} caption={d} list={datas[d]} key={i} />;
          })
        }
      </div>;
    }else {
      return <NoData icon="nodata_text" size={60} />;
    }
  }
}



export default class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needVote: 0,  // 总共需要投票的数目
      loading: true,
      complete: false // 投票是否完毕
    };
  }

  async componentDidMount() {
    // 确保已载入所有数据
    await DataReady();

    // 计算项目总共需要投选的票数
    let needVote = 0;
    for (let item of Subjects) {
      needVote = [0].concat(item.limit).reduce( (t, y) => t+y);
    }

    // 强制更新用户投票
    this.setState({
      needVote: needVote,
      loading: false,
      complete: UserDataVoted.length>0
    });
  }

  render() {
    headImg = window.ossPath + "img/banner.jpg";
    // 计算所有已选中的作品/候选人
    let selectedItems = [];
    for (let id in DataMap) {
      if(DataMap[id].selected) {
        selectedItems = selectedItems.concat(id);
      }
    }

    return <div className="list-page">
      <div className="maolizi-icon" onClick={this.handleRanking.bind(this)} ><span className="iconfont icon-ranking" /></div>
      <div className="list-head maolizi-bgimg" style={{height: ListHeadH+"px", backgroundImage: `url("${headImg}")`}} />
      <div className="list-body" style={{position: "relative", minHeight: ($(window).height() - ListHeadH - 50)+"px"}}>
        {/* {this.state.loading ? <div className="loading"><Spin size="small" /></div> : undefined} */}
        <VoteList ref="votelist" datas={ConvertData} onVote={this.handleClickVoteBtn.bind(this)} />
      </div>
      <div className="list-footer">{this.renderListFooter(selectedItems)}</div>
    </div>;
  }

  handleClickVoteBtn(receiveId) {
    let Counter = {};
    for (let subject of Subjects) {
      Counter[subject.title] = Object.assign((Counter[subject.title] || {}), {
        limit: subject.limit,
        selected: ConvertData[subject.title].filter( d => d.selected ).length
      });
    }

    let exceedLimit = false;    // 是否超过投票上限值
    for (let typeTitle in Counter) {
      let item = Counter[typeTitle];
      if(item.selected > item.limit) {
        exceedLimit = true;
        DataMap[receiveId].selected = false;

        let kindsDesc = (Subjects.length<=1) ? "" : `〔${item.typeTitle || ""}〕组别`;    // 计算共有多少个类别
        Message.warning(`${kindsDesc}要求投选 ${item.limit || 0} 位，不可多选亦不可少选！`, 6);
      }else {
        exceedLimit = false;
      }
    }

    // 若类别投票数目超过上限值，提示用户
    if(exceedLimit) {
      this.forceUpdate();
      return;
    }

    this.state.loading = false;
    this.forceUpdate();
  }

  async handleStartVote() {
    let _needVote = this.state.needVote;
    let selectedItems = DataArray.filter(it => it.selected).map(it => it.id);
    if(selectedItems.length !== _needVote) {
      let kindsDesc = (Subjects.length<=1) ? "" : "所有类别";    // 计算共有多少个类别
      Message.warning(`${kindsDesc}只能选择${_needVote}位作为投票对象（不可多选亦不可少选），请您重新调整投票数！`, 6);
      return;
    }

    try {
      await server.post("/api/vote/vote", {items: selectedItems});
      // 更新每个作品的 voted属性，表示已投票
      for (let id of selectedItems) {
        DataMap[id].voted = true;
      }

      Message.success("投票成功！", 6);
      this.setState({complete: true});
    }catch (e) {
      return Message.warning(e);
    }
  }

  handleRanking() {
    browserHistory.push("/main/ranking/");
  }

  renderListFooter(selectedItems) {
    let _needVote = this.state.needVote;
    let _complete = this.state.complete;
    let selectedItemsLen = selectedItems.length;

    if(_complete || selectedItemsLen===0) {
      return <div className="row maolizi-caption rank-and-rule">
        <div className="col-xs-6" onClick={this.handleRanking.bind(this)}><span className="iconfont icon-sort" />排行榜</div>
        <div className="col-xs-6" onClick={ () => browserHistory.push("/main/rule") }><span className="iconfont icon-default" />投票规则</div>
      </div>;
    }

    if(selectedItemsLen<_needVote && _complete===false) {
      return <Row className="maolizi-caption">
        <Col span={4} className="prefix">已选</Col>
        <Col span={20} className="content">
          <Row>
            {
              selectedItems.map( (d, i) => {
                return <Col span={6} className="selected-status" key={i}>
                  <div className="name-area">
                    {(DataMap[d] || {}).title || "　"}
                    <Icon className="icon" type="check-circle" />
                  </div>
                </Col>;
              })
            }
          </Row>
        </Col>
      </Row>;
    }else {
      return <div className="start-vote maolizi-caption" onClick={this.handleStartVote.bind(this)}>投　票</div>;
    }
  }

}
