"use strict";

module.exports = function(option) {
  const babel = require('gulp-babel');
  const gulp = require('gulp');
  const gutil = require('gulp-util');
  const livereload = require('gulp-livereload');
  const onerror = require("./onerror");
  const changed = require("gulp-changed");

  let {src, dest, cache, presets, plugins, base, minify, watch, root, requirePaths, compileChanged} = option;
  presets = (presets || []).concat(['es2017', require("./babel-presets-custom")]);

  if (requirePaths) {
    plugins = (plugins || []).concat([["module-resolver", {
      root: requirePaths
    }]]);
  }


  // 使用babili进行代码简化，因为babili支持es6语法
  if (minify && presets.indexOf("babili") < 0) {
    presets.push(['babili']);
  }

  return () => {
    var stream = gulp.src(src, base?{base:base}:undefined) // your ES2015 code
      .pipe(compileChanged?changed(dest):gutil.noop())
      .pipe(watch?onerror():gutil.noop())
      .pipe(cache?cache:gutil.noop())
      .pipe(babel({
        presets: presets,
        plugins: plugins
      })) // compile new ones
      .pipe(gulp.dest(dest))
      .pipe(livereload());
    return stream; // important for gulp-nodemon to wait for completion
  };
};
