#!/usr/local/bin/node

const path = require("path");

// 初始化服务器
let router;

try {
  router = require("./dist/common/server/init")(path.join(__dirname, "dist/server"));
} catch(e) {
  console.log("请先指定gulp debug编译程序后，再使用repl环境", e);
  process.exit();
}

let context = global;

let repl;
// 如果独立运行，进入交互模式
if (require.main === module) {
  repl = require("repl");
  context = repl.start("$ ").context;
}

// 初始化变量
Object.assign(context, {
  store: require("./dist/common/server/store")(),
  token: require("./dist/common/server/util/token"),
  indicative: require("./dist/common/server/indicative"),
  router: router,
  config: require("./dist/common/util/config")
});

console.log("运行环境初始化完毕，可用全局变量：");
console.log({
  store: "存储器",
  token: "处理令牌",
  indicative: "验证数据",
  router: "服务器",
  config: "当前环境配置"
});

// 添加await支持
const { addAwaitOutsideToReplServer } = require("await-outside");

// if used as `node --require await-outside/repl` repl server will only be
// created after this file is evaluated, thus the setImmediate to wait for it
setImmediate(() => addAwaitOutsideToReplServer(repl.repl));


console.log("开始使用");
