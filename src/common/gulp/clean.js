module.exports = function(option) {
  const clean = require('gulp-clean');
  const gulp = require('gulp');

  let {src} = option;

  return () => {
    return gulp.src(src)
      .pipe(clean());
  };
};
