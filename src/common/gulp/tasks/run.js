// 运行当前代码
const path = require("path");
const wait = require('gulp-wait');
const notify = require('gulp-notify');


let watched = false;
module.exports = function(gulp, requireModule, params) {
  const onerror = requireModule('gulp/onerror');

  let {argv, watches, rootPath, ext} = params;

  gulp.task('run', requireModule("gulp/run")({
    src: require(path.join(rootPath, './package.json')).main || 'app.js',
    watch: ['src/server', 'src/common/util', 'src/common/server'],
    ext: ext || "js",
    tasks: ["debug:compile:common","debug:compile:server"],
    env: argv.debug?{"MODE": 'DEBUG'}:{},
    onStart: function() {
      gulp.src('app.js')
        .pipe(wait(1000))
        .pipe(notify("服务器已重启"));

      // 只运行一次
      if (!watched) {
        watched = true;
        for (let watch of (watches || [])) {
          gulp.watch(watch.watch, gulp.series(onerror.clean,watch.task));
          console.log("监控", watch.watch);
        }
      }
    }
  }));
}
