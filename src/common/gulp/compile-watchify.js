"use strict";

module.exports = function(option) {
  // 运行时引用，避免重复
  const browserify = require('browserify');
  const watchify = require('watchify');
  const babelify = require('babelify');
  const lessify = require('./lessify');
  const jadeify = require("./jadeify");
  const source = require('vinyl-source-stream');
  const sourcemaps = require('gulp-sourcemaps');
  var buffer = require('vinyl-buffer');
  const gulp = require('gulp');
  const gutil = require('gulp-util');
  const livereload = require('gulp-livereload');
  const path = require('path');
  const uglify = require('gulp-uglify');
  const errorify = require("errorify");

  // less 插件
  const LessPluginCleanCSS = require('less-plugin-clean-css'),
      LessPluginAutoPrefix = require('less-plugin-autoprefix'),
      cleancss = new LessPluginCleanCSS({ advanced: true }),
      autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });


  let {src, dest, base, presets, requires, name, root, debug, locals, watch, minify, ie8, plugins} = option;

  return () => {
    let br = browserify(Object.assign({}, watchify.args, {
      entries: src,
      paths: requires || [base].concat([
        path.join(base, "modules"),
        './src/modules',
        './src/common',
        './node_modules']),
      debug: debug,
      cache: {},  // 每次建立新的cache，防止cache共用
      packageCache: {}
    }));

    if (watch) {
      br = watchify(br);
      br.plugin(errorify);
    }

    presets = (presets || []).concat(['es2015', 'es2016', 'es2017', 'react', require("./babel-presets-custom")]);
    plugins = plugins || [];

    if (ie8) {
      if (presets.indexOf("es2015") >= 0 ) {
        presets.splice(presets.indexOf("es2015"), 1, ["es2015", {loose: true}]);
      }
      presets.unshift(require("./babel-presets-ie8"));
    }

    br.transform(lessify, {
      compileOptions: {
        modifyVars: Object.assign({ossPath:""}, locals || {}),
        plugins: [autoprefix, cleancss]
      }
    }).transform(jadeify, {}).transform(babelify, {
      global: ie8?true:undefined,
      presets: presets,
      plugins: plugins
    });

    br.on('update', bundle);

    function bundle() {
      let stream = br.bundle()
        .pipe(source(name || path.basename(src[0])))
        .pipe(buffer())
        .pipe(debug?sourcemaps.init({loadMaps: true}):gutil.noop())
        .pipe(debug?sourcemaps.write('./'):gutil.noop())
        .pipe(minify?uglify().on('error', gutil.log):gutil.noop())
        .pipe(gulp.dest(dest))
        .pipe(livereload());

      return stream;
    }

    return bundle();
  }
};
