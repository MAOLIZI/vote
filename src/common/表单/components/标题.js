import React, { Component } from "react";


class Title extends Component {
  render() {
    let item = this.props.item;

    return <div className="col-xs-12 item title"  key={item.uuid}>{item.name}</div>;
  }
}

Title.standalone = true;

export {Title};
