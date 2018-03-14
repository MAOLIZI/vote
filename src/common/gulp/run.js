const gulp = require("gulp");
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');
const wait = require('gulp-wait');
const notify = require('gulp-notify');


module.exports = function(options) {
  let {src, watch, tasks, ext, onStart, env} = options;

  return () => {
    var spawn   = require('child_process').spawn,
        bunyanIns;

    livereload.listen();

    var stream = nodemon({
        script: src || 'app.js',
        watch: watch || ['src/server/'],
        legacyWatch: false,
        ext: ext || 'html js less jade jpg png',
        tasks: tasks ||  ['compile:server'],
        env: env
    }).on('start', onStart);

    return stream;
  };
};
