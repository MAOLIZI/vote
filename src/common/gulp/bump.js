module.exports = function(option) {
  const bump = require('gulp-bump');
  const gulp = require('gulp');

  let {src, dest} = option;

  return () => {
    return gulp.src(src)
      .pipe(bump())
      .pipe(gulp.dest(dest));
  };
};
