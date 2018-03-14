// Generated by CoffeeScript 1.12.2
(function() {
  var base64, crypto, formatDate, getAuthorization, getSig, getTimestamp, md5, merge, padZero,
    slice = [].slice;

  crypto = require('crypto');

  padZero = function(str, len) {
    if (!len) {
      len = 2;
    }
    if (typeof str !== 'string') {
      str = str.toString();
    }
    while (str.length < len) {
      str = '0' + str;
    }
    return str;
  };

  formatDate = function(date) {
    if (!(date instanceof Date)) {
      date = new Date(Date.parse(date));
    }
    return '' + date.getFullYear() + padZero(date.getMonth() + 1) + padZero(date.getDate()) + padZero(date.getHours()) + padZero(date.getMinutes()) + padZero(date.getSeconds());
  };

  getTimestamp = function() {
    return formatDate(new Date());
  };

  md5 = function(str, type) {
    var md5sum;
    if (type == null) {
      type = 'hex';
    }
    md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest(type);
  };

  base64 = function(str) {
    return (new Buffer(str)).toString('base64');
  };

  getAuthorization = function(sid, timestamp) {
    return base64(sid + ':' + timestamp);
  };

  getSig = function(sid, token, timestamp) {
    return md5(sid + token + timestamp).toUpperCase();
  };

  merge = function() {
    var add, adds, i, k, len1, src, v;
    src = arguments[0], adds = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len1 = adds.length; i < len1; i++) {
      add = adds[i];
      for (k in add) {
        v = add[k];
        src[k] = v;
      }
    }
    return src;
  };

  exports.formatDate = formatDate;

  exports.getTimestamp = getTimestamp;

  exports.md5 = md5;

  exports.base64 = base64;

  exports.getAuthorization = getAuthorization;

  exports.getSig = getSig;

  exports.merge = merge;

}).call(this);