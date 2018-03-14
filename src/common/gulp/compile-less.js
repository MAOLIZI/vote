"use strict";

module.exports = function(option) {
  const less = require('gulp-less');
  const gulp = require('gulp');
  const gutil = require('gulp-util');
  const onerror = require('./onerror');
  const livereload = require('gulp-livereload');

  // less 插件
  const LessPluginCleanCSS = require('less-plugin-clean-css'),
      LessPluginAutoPrefix = require('less-plugin-autoprefix'),
      cleancss = new LessPluginCleanCSS({ advanced: true }),
      autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });


  let {src, dest, cache, base, locals, watch} = option;
  return () => {
    var stream = gulp.src(src, base?{base:base}:undefined) // your ES2015 code
      .pipe(watch?onerror():gutil.noop())
      .pipe(cache?cache:gutil.noop()) // remember files
      .pipe(less({
        modifyVars: Object.assign({ossPath:""}, locals || {}),
        plugins: [cleancss, autoprefix]
      })) // compile new ones
      .pipe(gulp.dest(dest))
      .pipe(livereload());
    return stream; // important for gulp-nodemon to wait for completion
  };
};
