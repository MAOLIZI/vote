module.exports = function(rootpath) {
  const fs = require('fs');
  const path = require('path');
  const Router = require('router');
  const log = require('util/log');

  // 注册token的验证和转化服务，挂载indicative
  require("util/token/initValidator");

  // 查看指定路径是否可以访问
  function tryPath(location) {
    try {
      fs.accessSync(location, fs.F_OK);
      return true;
    } catch(e) {
      return false;
    }
  }

  let router = new Router();

  // 分路径载入所有服务器模块
  let paths = [path.join(rootpath, "apis"), path.join(__dirname, "apis")];
  for (let p of paths) {
    let files = fs.readdirSync(p);

    // 读每个目录下的子目录
    for (let dir of files) {
      let stat = fs.statSync(path.join(p, dir));
      if (stat.isDirectory()) {
        if (tryPath(path.join(p, dir, "index.js"))) {
          // 载入模块文件
          // log.info("载入服务器模块 '" + dir + "'");
          log.info("载入服务器模块", path.relative(__dirname, path.join(p, dir)));
          let routes = require("./" + path.relative(__dirname, path.join(p, dir)));
          if (!Array.isArray(routes)) routes = [routes];

          for (let route of routes) {
            if (!route.path || !route.method) throw "没有提供api的路径或方法," + dir;
            if (route.validate && route.validate.headers) throw "api请指定header, 而不是headers" + dir;
          }

          // 如果返回了值
          router.route(routes);
        }
      }
    }
  }

  return router;
}
