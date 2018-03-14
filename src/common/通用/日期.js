/**方法：
 * const dateUtility = require("通用/日期");
 * dateUtility.formatDate(date, "YYYY年MM月DD日");
 */

import moment from 'moment';

let dateUtility = {
  parseDate: function (str) {
    var moment = dateUtility.parseMoment(str);
    if (moment) {
      return moment.toDate();
    }
  },

  parseMoment: function(str) {
    if(!str) return null;

    var m = moment(typeof str === "string"?str.replace(/[年月]/g, "/").replace(/日/,""):str);

    if (m.isValid()) {
      return m;
    }

    console.error("不能处理日期字符串", str);
  },

  formatDate: function (date, format) {
    var moment = dateUtility.parseMoment(date);
    if (moment) {
      return moment.format(format || "YYYY年MM月DD日");
    }
    return "";
  },

  formatTimeSpan: function(date) {
    date = dateUtility.parseDate(date);
    if (date) {
      var now = Date.now();
      var then = date.getTime();

      var diff = Math.floor((now - then)/1000); // 秒

      if (diff <= 0) {
        return dateUtility.formatDate(date, "YYYY/MM/DD HH:mm:ss");
      } else if (diff < 60) {
        return diff + "秒之前";
      } else if (diff < 60*60) {  // 一小时之内
        return Math.floor(diff/60) + "分钟之前";
      } else if (diff < 60*60*24) { // 一天之内
        return Math.floor(diff/3600) + "小时之前";
      } else {
        return dateUtility.formatDate(date, "YYYY/MM/DD HH:mm:ss");
      }
    } else {
      return "";
    }
  }
};

export {dateUtility};
