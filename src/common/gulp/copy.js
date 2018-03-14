"use strict";

module.exports = function(option) {
  const gulp = require('gulp');
  const gutil = require('gulp-util');
  const Flatten = require('gulp-flatten');

  let {src, dest, cache, base, flatten} = option;
  return () => {
    var stream = gulp.src(src, base?{base:base}:undefined)
        .pipe(cache?cache:gutil.noop()) // cache them
        .pipe(flatten?Flatten():gutil.noop())
        .pipe(gulp.dest(dest));

    return stream; // important for gulp-nodemon to wait for completion
  };
};
