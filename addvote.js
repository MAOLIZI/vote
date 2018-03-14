#!/usr/local/bin/node

const path = require("path");

global.ENV = "debug";
if (global.ENV !== "debug" ) {
  console.log("错误的运行环境", global.ENV);
  process.exit();
}

// global.ENV = "railwaydwd";   // Azure上对吗项目名称

// 初始化服务器
let router;
try {
  router = require("./dist/common/server/init")(path.join(__dirname, "dist/server"));
} catch(e) {
  console.log("请先指定gulp debug编译程序后，再使用导入脚本", e);
  process.exit();
}

const store = require("./dist/common/server/store")();
const token = require("./dist/common/server/util/token");
const fs = require("fs-extra");
const VoteItems = store.getModel("voteitems");


// // 黄逢丽 19  // 翁建忠 50  // 王勇 22
// function startAddVote(name, id, number) {
//   setInterval(async function() {
//     await store.db().executeSQL(`UPDATE voteitems SET votes = votes +? WHERE id=?`, [number, id]);
//     console.log(`${name} 加了 ${number} 票`);
//   }, 12*1000);
// }
//
// var items = [
//   /*{
//     name: "黄逢丽",
//     id: 19,
//     number: 10
//   },
//   {
//     name: "王勇",
//     id: 22,
//     number: 10
//   },*/
//   {
//     name: "翁建忠",
//     id: 50,
//     number: 10
//   }
// ];
//
// for (item of items) {
//   startAddVote(item.name, item.id, item.number);
// }
