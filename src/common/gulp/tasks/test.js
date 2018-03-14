// 注册测试任务
const path = require("path");

module.exports = function(gulp, requireModule, params) {
  let {argv} = params;

  let test = requireModule('gulp/test')({
    src: [(argv.only || argv.focus)?path.join('test/compiled/', argv.only || argv.focus):'test/compiled/**/*.js']
  });

  let compile_test = requireModule('gulp/compile-babel')({
    src: ['test/**/*.js', '!test/compiled/**/*.js'],
    dest: 'test/compiled/',
    requirePaths: requireModule.paths
  });

  gulp.task('test', gulp.series([compile_test, test, function() {
    gulp.watch(['test/**/*.js', '!test/compiled/**/*.js'], gulp.series([compile_test,test]));
  }]));
};
