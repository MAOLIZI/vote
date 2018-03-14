let createTarget;

try {
  createTarget = require("./compile");
} catch(e) {
  createTarget = function() {return {};}
}

let hostname = require("os").hostname();
let Path = require("path");

let database = {
  "database_host": "127.0.0.1",
  "database_name": "railway-dwd",
  "database_user": "train",
  "database_password": "ak87B5"
};

module.exports = {
  // 默认
  "default": {
    secret: "1 surely sPring",
    uploadTo: Path.join(__dirname, "..", "uploads"),
    staticPaths: {
      "/admin": "admin",
      "/": "client"
    },
    yuntongxun: {
      accountSid: "8a216da857d1e5270157d7b1688b04d0",
      authToken: "06530fc17ce34594ae5a9dce6a7f0f37",
      appId: "8a216da857d1e5270157d7ba1cd404da",
      baseUrl: "https://app.cloopen.com:8883",
      softVersion:"2013-12-26"
    }
  },
  // 测试环境
  test: {
    server_port: 5800,
    debug: false
  },
  // 开发
  debug: {
    server_port: 5800,
    debug: true,
    "database_host": database.database_host,
    "database_name": database.database_name,
    "database_user": database.database_user,
    "database_password": database.database_password,

    gulpDest: "dist",
    targets: createTarget("debug"),
    staticPaths: {
      "/admin": "admin",
      "/test": "test",
      "/": "client"
    }
  },
  // 部署到正式环境
  release: {
    gulpDest: "release",
    targets: createTarget("release")
  },
  // 线上本项目
  "railwaydwd": {
    server_port: process.env.PORT,
    database_host: process.env.MYSQLCONNSTR_DBHOST || "stream2.mysqldb.chinacloudapi.cn",
    database_name: process.env.MYSQLCONNSTR_DBNAME || "railway-dwd",
    database_user: process.env.MYSQLCONNSTR_DBUSER || "stream2%stream",
    database_password : process.env.MYSQLCONNSTR_DBPASSWORD || "6^9hjE/$qX3DD"
  }
};
