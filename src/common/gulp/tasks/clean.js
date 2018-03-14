// 清除所有生成代码
module.exports = function(gulp, requireModule, params) {
  gulp.task('clean', requireModule("gulp/clean")({
    src: ["./dist/*", "./release/*"]
  }));
}
