// 定义了可能发生的常见错误
const config = require('util/config');

let logger;
if(config.debug) {
  logger = {
    info: wrapLog(console.log),
    error: wrapLog(console.error),
    warn: wrapLog(console.warn),
    debug: wrapLog(console.log)
  }
} else {
  const bunyan = require("bunyan");

  logger = bunyan.createLogger({
    name: config.name || "server",
    serializers: {
      err: bunyan.stdSerializers.err,
      request: bunyan.stdSerializers.req,
      response: bunyan.stdSerializers.res
    }
  });
}

// ==== 帮助函数 =======
function format(obj) {
  if (obj.url) {
    return `${obj.method} ${obj.url} take ${obj.responseTime}ms`;
  } else {
    return obj;
  }
}
function wrapLog(log) {
  return function() {
    let args = Array.prototype.slice.call(arguments, 0);
    if (typeof args[0] === "object") {
      args[0] = format(args[0]);
    }

    log.apply(this, args);
  };
}

module.exports= logger;
