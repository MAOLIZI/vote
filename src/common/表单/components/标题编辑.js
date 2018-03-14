import React, { Component } from "react";


class TitleEdit extends Component {
  render() {
    let item = this.props.item;
    let content = this.props.content;

    return <div className="col-xs-12 item title edit" >
        <div className="item-input">
          <input ref="input"
            type="text"
            className="form-control"
            defaultValue={content || this.props.defaultValue}
            placeholder={item.placeholder || ""}
            tabIndex={this.props.tabIndex}
            onChange={this.props.onChange.bind(this)}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onKeyPress={this.props.onKeyPress}
            disabled = {this.props.mode === "read"}
          />
      </div>
    </div>;
  }

  focus() {
    $(this.refs.input).focus();
  }

  getContent() {
    return $(this.refs.input).val();
  }

  setContent(val) {
    $(this.refs.input).val(val);
  }
}


TitleEdit.standalone = true;

export {TitleEdit};
