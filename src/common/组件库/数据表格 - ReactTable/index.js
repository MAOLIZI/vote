import React, { Component, Link } from "react";
import ReactTable from 'react-table';
import cache from "通用/缓存";

/*
  {
    header: '到期时间',
    accessor: 'duedate',
    render: props => <span></span>    // props.value 为当前单格子的数据；props.row 为当前整行的数据
  }

  <Table className="duedate-members" data={list} columns={columns} onClick={this.handleEdit}/>

  handleEdit(props) {   // 只要写了一个参数，则此参数接受的则为整行数据！
    this.props.history.push("/admin/personal/" + props.id);
  }
*/


export default class ReactTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || [],
      pageSize: cache.getLocalStorage("pagesize") || 10
    };
  }

  componentWillReceiveProps(props) {
    this.state.data = props.data || [];
  }

  render() {
    let data = this.state.data;

    return (
      <ReactTable
        className='-striped -highlight component'
        key={this.state.pageSize}
        data={data}
        columns={this.props.columns}
        pageSizeOptions= {[5, 10, 12, 15]}
        defaultPageSize = {this.state.pageSize}
        defaultFilterMethod={(filter, row) => (String(row[filter.id]).indexOf(filter.value) >= 0)}
        showFilters={true}
        previousText="上一页"
        nextText="下一页"
        pageText="页"
        rowsText="行"
        noDataText = "没有可用数据"
        getTdProps={(state, rowInfo, column, instance) => {
          if (!rowInfo || !rowInfo.row) return {};

          let data = rowInfo.row;
          if (this.props.onClick) {
            return {
              onClick: () => this.props.onClick(data)
            }
          } else {
            return {};
          }
        }}
        onPageSizeChange={(size) => {
          cache.setLocalStorage("pagesize", size);
          this.setState({pageSize: size});
        }}
      />
    );
  }
}
