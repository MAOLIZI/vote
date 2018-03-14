import React, { Component, Link } from "react";
import {browserHistory} from "react-router";
import Icon from "antd/lib/icon";


export default class RulePage extends Component {
  render() {
    return <div className="rule-page maolizi-bgimg" style={{
      minHeight: $(window).height()+"px",
      backgroundImage: `url("${window.ossPath}img/menu_bg.jpg")`
    }}>
      <div className="caption">投票规则</div>
      <div className="rule-content">
        <div className="unit">
          <div className="title"><Icon type="clock-circle-o" />活动时间：</div>
          <p className="content">2018年1月15日00:00 — 2018年1月17日24:00。</p>
        </div>
        <div className="unit">
          <div className="title"><Icon type="file-text" />活动规则：</div>
          <p className="content">1.本次投票候选人共20人。</p>
          <p className="content">2.活动期间，每个微信号每日只能投票1次，每次投票必须投满10人且不可重复投选一人。</p>
          <p className="content">3.投票期间发现刷票作弊等行为，将采取一定措施给予警告，并删除刷票票数，情节严重者将直接取消候选资格并给予通报。</p>
        </div>
      </div>
      <div className="btn-area">
        <div className="back-btn btn" onClick={ () => {browserHistory.push("/main/list");} }>进入投票</div>
      </div>
    </div>;
  }
}
