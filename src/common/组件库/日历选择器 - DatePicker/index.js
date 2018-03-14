import React, { Component, Link } from "react";
require('./picker.js');
require('./classic.date.less');
require('./classic.less');


export default class DatePicker extends Component {
  render() {
    return 	<input type="text"  className="datepicker component form-control" ref="newDate" placeholder={this.props.placeholder || "选择日期..."} value = {this.props.value || ""}/>;
  }

  componentDidMount() {
    $(this.refs.newDate).pickadate({
      format: 'yyyy-mm-dd',
      monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
      monthsShort: [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
      weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
      weekdaysShort: [ '日', '一', '二', '三', '四', '五', '六' ],
      today: '今日',
      clear: '清除',
      close: '关闭',
      firstDay: 1,
      formatSubmit: 'yyyy-mm-dd',
      onClose: this.handleChange
    });
  }

  handleChange() {
    var input = $(this.refs.newDate);
    var date = input.val();
    if (!date) {return;}
    if (this.props.onChange) {
      this.props.onChange(date);
    }
  }
}
