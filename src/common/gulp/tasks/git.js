const shell = require("gulp-shell");

module.exports = function(gulp, requireModule, params) {
  gulp.task('pushcommon', shell.task([
    'echo git subtree push --prefix src/common /Users/alvinchen/开发/common/.git master',
    'git subtree push --prefix src/common /Users/alvinchen/开发/common/.git master'
  ]), {
    verbose: true
  });

  gulp.task('pullcommon', shell.task([
    'echo git subtree pull --prefix src/common /Users/alvinchen/开发/common/.git master',
    'git subtree pull --prefix src/common /Users/alvinchen/开发/common/.git master'
  ]), {
    verbose: true
  });
};
