'use strict';

var toobusy = require('toobusy-js');

module.exports = function (options) {
  options = options || {};
  if (options.maxLag) {
    toobusy.maxLag(options.maxLag);
  }
  if (options.interval) {
    toobusy.interval(options.interval);
  }

  return async function koaToobusy(ctx, next) {
    if (toobusy()) {
      ctx.status = options.status || options.statusCode || 503;
      ctx.body = options.message || '服务器繁忙，请稍后再试';
      return;
    }
    await next();
  };
};
