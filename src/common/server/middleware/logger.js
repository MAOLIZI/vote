var log = require('util/log');
var config = require('util/config');

module.exports = async (ctx, next) => {
  let start = new Date;
  let error;

  // 执行请求
  try {
    await next();
  } catch(err) {
    ctx.body = { success: false, message: err.message };
    ctx.status = err.status || 500;
    error = err;
  }

  // 日志
  if (error) {log.error(error);}

  log.info({
    //request: config.debug?ctx.request:undefined,
    url: ctx.url,
    method: ctx.method,
    responseTime: Math.ceil(new Date - start),
    body: (config.debug && ctx.method === "POST")?ctx.body:undefined
  });
};
