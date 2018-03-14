const gulp = require("gulp");
const mocha = require("gulp-spawn-mocha");

module.exports = (options) => {
  let {src} = options;
  return () => {
    //  设置环境为test
    process.env.CONFIG_ENV = "test";
    let stream = mocha({
      compilers: 'js:babel-core/register',
      R: 'dot'
    });

    stream.on("error", (e) => {
      console.error("测试脚本运行失败");
    });

    return gulp.src(src, {read: false})
      .pipe(stream);
  };
};
