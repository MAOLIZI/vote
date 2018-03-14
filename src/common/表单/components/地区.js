import React, { Component } from "react";
import RegionData from  "../data/国家";



function split(text) {
  let parts = text.split(" ");
  let city = parts.pop();
  return {
    province: parts.join(" "),
    city: city
  }
}

export default class TitleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.componentWillReceiveProps(this.props);

  }

  componentWillReceiveProps(nextProps) {
    let content = nextProps.content;
    if (content) {
      content = split(content);
    }
    this.state.province = (content || {}).province;
  }

  render() {
    let item = this.props.item;
    let content = this.props.content;
    if (content) {
      content = split(content);
    }

    return <div className="input-region row">
      <div className="col-xs-6 province-item">
        <select ref="provinceInput"
          type="text"
          className="form-control"
          defaultValue={this.state.province}
          placeholder={item.placeholder || ""}
          tabIndex={this.props.tabIndex}
          onChange={this.handleProvinceChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          disabled = {this.props.mode === "read"}

        >
          {
            Object.keys(RegionData).map( d => {return <option key={d}>{d}</option>;})
          }
        </select>
      </div>
      <div className="col-xs-6 city-item">
        <select ref="cityInput"
          className="form-control"
          key={this.state.province}
          defaultValue={content?content.city:(item.options || [])[0]}
          onChange={this.props.onChange}
          tabIndex={this.props.tabIndex + 1}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          disabled = {this.props.mode === "read"}

          >
          {(RegionData[this.state.province] || []).map(function(d) {
            return <option>{d}</option>;
          })}
        </select>
      </div>
    </div>;
  }

  focus() {
    $(this.refs.input).focus();
  }

  getContent() {
    return $(this.refs.provinceInput).val() + " " + $(this.refs.cityInput).val();
  }

  setContent(val) {
    let value = split(val);
    $(this.refs.provinceInput).val(value.province);
    $(this.refs.cityInput).val(value.city);
  }

  handleProvinceChange() {
    let province = $(this.refs.provinceInput).val();
    this.setState({province: province});

    if (this.props.onChange) {
      this.props.onChange();
    }
  }
}
