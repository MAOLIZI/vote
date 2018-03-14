import React, { Component } from "react";


export default class List extends Component {
  constructor() {
    super(props);
    this.state = {
      offset: this.props.offset || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.offset = nextProps.offset || 0;
  }

  render() {
    let limit = this.props.limit;
    let items = this.props.items;
    if (limit) {
      items = [].concat(items).splice(this.state.offset, limit);
    }
    // 使用提供的外包装，或者使用默认模块（DIV）
    let ComponentPackage = this.props.component || (({children}) => <div>{children}</div>);

    return <ComponentPackage {...(this.props.componentProps || {})}>
    {items.map((item, index)=> {
      let that = this;
      item = $.extend({}, item,{list_index:index, key: index}, {key: item.key});
      return React.Children.map(this.props.children, function(child,index) {
        return React.cloneElement(child, item);
      });
    })}
    {this.props.limit && this.props.items.length > limit?
      <div className="row" style={{textAlign:"center"}}>
        <div className="col-xs-6">
          <button className="btn" onClick={() => { this.handlePageChange(-1).bind(this) }}>上一页</button>
        </div>
        <div className="col-xs-6">
          <button className="btn" onClick={() => { this.handlePageChange(1).bind(this) }}>下一页</button>
        </div>
      </div>
      :""}
    </ComponentPackage>;
  }

  handlePageChange(direction) {
    let offset = this.state.offset;
    let limit = this.props.limit;
    let items = this.props.items;
    offset = offset + direction*limit;
    if (offset < items.length && offset >= 0) {
      this.setState({offset: offset});
    }
  }
}
