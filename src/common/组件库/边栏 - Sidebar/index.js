
import React, { Component, Link } from "react";
import {browserHistory} from "react-router";
import List from "组件库/列表 - List";

require('./index.less');

/*
 * <Sidebar items={items} onlyIcon={true} />
 */


class Item extends Component {
  render() {
    if (this.props.type === "seperator") {
      return <div className="sidebar-item seperator"></div>;
    }

    if(!this.props.name) {
      return <div className="sidebar-item empty"></div>;
    }

    let hoverHint = true;
    if (!this.props.link && !this.props.action) {
      hoverHint = false;
    }

    return <div ref='sidebarItem' className={"sidebar-item row" + (this.props.active?" active":"") + (hoverHint?" hoverable":"")} onClick={this.handleClick.bind(this)}>
      {
        (this.props.onlyIcon) ?
        <div className='onlyIcon col-xs-12' data-toggle="tooltip" ref="onlyIcon">
          <span className={"iconfont icon-" + (this.props.icon || "menu")}></span>
        </div> :
        <div className='iconAndText'>
          <div className="col-xs-12 col-xs-offset-2 icon-item">
            {this.props.name?<span className={"iconfont icon-" + (this.props.icon || "menu")} />:<span>&nbsp;</span>}
          </div>
          <div className="col-xs-7 text">
            {this.props.name}
          </div>
        </div>
      }
    </div>;
  }

  handleClick() {
    if (this.props.link) {
      browserHistory.push(this.props.link);
    } else if (this.props.action) {
      this.props.action();
    }
  }

  componentDidMount() {
    $(this.refs.sidebarItem).tooltip({
      trigger: 'hover',  //触发方式
      placement: 'right',
      title: this.props.name
    });
  }
}

export default class Sidebar extends Component {
  render() {
    return <div className="sidebar component">
      <List items={this.props.items}>
        <Item onlyIcon={this.props.onlyIcon} />
      </List>
    </div>;
  }
}
