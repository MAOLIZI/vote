module.exports = function(rootpath) {
  // 启动服务器
  var koa = require('koa');

  const app = new koa();
  const config = require('util/config');
  const log = require('util/log');
  const router = require('router');    // 自主服务器
  const serveFiles= require('koa-static');
  const mount = require('koa-mount');
  const Path = require('path');
  const serveDefault = require('middleware/defaultSend');
  const Store = require("store");

  // 中间件
  app.use(require('middleware/toobusy')());  // 拒绝太多请求
  app.use(require('koa-helmet')());  // 防护
  app.use(require('koa-compress')());	// gzip压缩
  app.use(require('middleware/logger'));		// 日志
  app.use(require('middleware/exception')()); // 捕捉意料之外的异常

  // 设置最大event listener为无限
  require('events').EventEmitter.defaultMaxListeners = Infinity;

  // 确保生产环境使用正确的NODE_ENV
  if (!config.debug && process.env.NODE_ENV !== 'production') {
    throw "正式环境请设置NODE_ENV为production";
  }

  // 开发环境livereload
  if (config.debug) {
    app.use(require('koa-livereload')());
    // 在开发环境开启debug指令，就开启数据库模块日志输出
    if (process.env.MODE === "DEBUG") {
      require('debug').enable('loopback:connector:mysql');
    }

    // 开启更全面的错误输出
    require('longjohn');

    // 开发环境传输编译错误文件
    const serveError = require("middleware/serveError");
    app.use(mount("/gulp/gulp_errors.js", serveError("gulp_errors.js", {
      root: Path.join(rootpath, "..")
    })));
  }

  // 错误处理
  app.on('error', function(err, ctx){
    log.error('服务器错误', err, ctx);
  });

  // 初始化数据库和所有apis接口
  const apiRouter = require('./init')(rootpath);

  // 挂在所有接口处理函数
  apiRouter.prefix('/api');   // 说明是在api路径下运行
  app.use(apiRouter.middleware());


  // 静态文件
  if (config.staticPaths) {
    for (let path in config.staticPaths) {
      log.info("设置服务器静态路径", path, "对应实际路径", Path.join(rootpath, "..", config.staticPaths[path]));
      app.use(mount(path, serveFiles(Path.join(rootpath, "..", config.staticPaths[path]), {
        index: 'index.html'
      })));
    }
  }

  // 设置找不到相应处理器时的默认传输文件
  if (config.staticPaths) {
    let defaultStatics = {};
    for (let path in config.staticPaths) {
      if (path[0] !== "/") {path = "/" + path;}

      let value = config.staticPaths[path];

      log.info("设置默认文件路径", path, "对应实际文件", value);
      app.use(mount(path, serveDefault(value, {
        root: Path.join(rootpath, ".."),
        index: "index.html"
      })));
    }
  }

  // 启动
  app.listen(config.server_port || 5800);
  log.info("服务器已运行，请访问http://localhost:"+ (config.server_port || 5800));

  return app;
}
