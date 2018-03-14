
const helps = {
  "gulp": "开发模式，监控代码变更，编译并运行代码",
  "gulp debug": "编译调试版本代码，目标路径：dist",
  "gulp release": "编译发布版本代码，目标路径：release",
  "gulp clean": "清空程序发布目录dist和release",
  "gulp run": "不编译，直接运行服务器程序",
  "gulp test": "运行测试脚本",
  "gulp bump": "更新程序版本，更新一个小版本",
  "gulp pushcommon": "将本地common公共库的修改更新至git",
  "gulp pullcommon": "将最新common公共库拉取至本地",
  "node repl": "进入node交互环境，初始化本服务器相关资源"
};

const helpArray = [];
for (let key in helps) {
  helpArray.push({
    key: key + Array(24-key.length).fill(" ").join(""),
    value: helps[key]
  });
}

module.exports = function(gulp, requireModule, params) {
  gulp.task('help', function(done) {
    console.log(Array(64).fill("-").join(""));
    helpArray.forEach(help => {
      console.log(`  ${help.key} : ${help.value}`);
    });
    console.log(Array(64).fill("-").join(""));
    done();
  });
};
