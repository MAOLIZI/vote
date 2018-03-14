"use strict";

module.exports = function(option) {
  const jade = require('gulp-jade');
  const gulp = require('gulp');
  const gutil = require('gulp-util');
  const livereload = require('gulp-livereload');
  const onerror = require("./onerror");

  let {src, dest, cache, base, locals, watch} = option;

  return () => {
    var stream = gulp.src(src, base?{base:base}:undefined) // your ES2015 code
      .pipe(watch?onerror():gutil.noop())
      .pipe(cache?cache:gutil.noop()) // remember files
      .pipe(jade({
        locals: Object.assign({ossPath:""}, locals || {}),
        pretty: true
      })) // compile new ones
      .pipe(gulp.dest(dest))
      .pipe(livereload());
    return stream; // important for gulp-nodemon to wait for completion
  };
};
