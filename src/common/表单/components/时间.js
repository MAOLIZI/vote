const React = require("react");

module.exports = React.createClass({
  getInitialState: function() {
    let content = Object.assign({}, this.props.content || this.props.defaultValue);
    return {content: content};
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.content) {
      this.state.content = nextProps.content;
    }
  },

  render() {
    let item = this.props.item;
    let content = this.state.content;

    return <div className="row">
      <div className="col-xs-7">
      <input ref="input"
        type="text"
        className="form-control"
        placeholder={item.placeholder || ""}
        onBlur={this.handleBlur}
        onChange={this.handleTimeInputChange}
        tabIndex={this.props.tabIndex}
        onFocus={this.handleFocus}
        onKeyPress={this.handleKeyPress}
        placeholder = "24:00"
        value={this.state.content.time || ""}
        disabled = {this.props.mode === "read"}

      /></div>
      {(item.maxDayDiff || item.minDayDiff)?
      <div className={"col-xs-3 timezone" + (content.dayDiff?" active":"")} onClick={this.handleDayChange}>
        <span className="zone"><span className={"iconfont " + (content.dayDiff<0?"icon-minus-copy":"icon-icon1")}></span><span ref="dayDiff">{Math.abs(content.dayDiff || 0)}</span></span>
      </div>:""}
    </div>;
  },

  handleDayChange() {
    let dayDiff = this.state.content.dayDiff || 0;
    dayDiff = dayDiff+1;
    if (dayDiff > this.props.item.maxDayDiff) {
      dayDiff = this.props.item.minDayDiff || 0;
    }
    this.state.content = {
      time: this.state.content.time,
      dayDiff: dayDiff
    };
    this.forceUpdate();
    if (this.props.onChange) {this.props.onChange();}
  },

  lastVal: '',

  handleTimeInputChange (event) {
    let val = event.target.value;

    if (val == this.state.content.time) {
      return;
    }
    if (isValid(val)) {
      if (val.length === 2 && this.lastVal.length !== 3) {
        val = val + ':';
      }

      if (val.length === 2 && this.lastVal.length === 3) {
        val = val.slice(0, 1);
      }

      if (val.length > 5) {
        return false;
      }

      this.lastVal = val;

      this.state.content = {
        time: val,
        dayDiff: this.state.content.dayDiff
      };
      this.forceUpdate();
      if (this.props.onChange) {this.props.onChange();}
    }

  },


  getContent: function() {
    return  {
      time: this.state.content.time,
      dayDiff: this.state.content.dayDiff || undefined
    };
  },

  setContent(content) {
    if (this.refs.input) {
      $(this.refs.input).val(content.time);
      $(this.refs.dayDiff).val(content.dayDiff);
    }
  }
});

function isValid (val) {

  var isValid = true,
      letterArr = val.split(':').join('').split(''),
      regexp = /^\d{0,2}?\:?\d{0,2}$/,
      valArr = [];

  if (!regexp.test(val)) {
      isValid = false
  }

  // check each letter

  if (letterArr[0] && (
          parseInt(letterArr[0], 10) < 0 || (parseInt(letterArr[0], 10) > 2)
      )) {
      isValid = false
  }

  if (letterArr[2] && ((
          parseInt(letterArr[2], 10) < 0 || parseInt(letterArr[2], 10) > 5)
      )) {
      isValid = false
  }

  if (valArr.indexOf(':')) {
      valArr = val.split(':');
  } else {
      valArr.push(val);
  }

  // check mm and HH
  if (valArr[0] && valArr[0].length && (parseInt(valArr[0], 10) < 0 || parseInt(valArr[0], 10) > 23)) {
      isValid = false
  }

  if (valArr[1] && valArr[1].length && (parseInt(valArr[1], 10) < 0 || parseInt(valArr[1], 10) > 59)) {
      isValid = false
  }

  return isValid;
}
