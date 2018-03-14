module.exports = function(gulp, requireModule, params) {
  gulp.task('bump', requireModule("gulp/bump")({
    src: "./package.json",
    dest: "./"
  }));
};
