// 初始化主要服务，可以在命令行单独使用

module.exports = function(rootpath, options) {
  const config = require('util/config');
  const log = require('util/log');
  const Store = require("store");

  // 初始化store
  log.info("链接数据库", config.database_host, "，数据库名称", config.database_name);
  Store.createStore("default", {
    memory: true,
    redis: false
  }, {
    "connector": "mysql",
    "host": config.database_host,
    "database": config.database_name,
    "username": config.database_user,
    "password": config.database_password,
    "connectionLimit": 2
  });


  // 载入所有apis接口
  let apiRouter;  // 所有支持的api
  if (!options || !options.skipAPI) {
    apiRouter = require('./api')(rootpath);
  }

  // 已经载入所有API并注册所有模型，现在初始化数据库并自动更新表结构
  Store().autoupdate();

  return apiRouter;
}
