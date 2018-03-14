const plumber = require('gulp-plumber');
const fs = require("fs");
const livereload = require('gulp-livereload');

let output;

module.exports = function() {
  return plumber({
    errorHandler: function (err) {
      console.log(err);
      if (output) {
        fs.writeFile(output, defaultReplacer(err), function (err) {});
        livereload.reload();
      }
      this.emit('end');
    }
  });
};

// 设置输出文件并清空
module.exports.init = function(file) {
  output = file;
  fs.writeFile(file, '', function (err) {});
}

module.exports.clean = function(done) {
  if (output) {
    fs.writeFile(output, '', function (err) {
      done();
    });
  }
}



// https://github.com/sindresorhus/ansi-regex/blob/11423e1/index.js
var ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

var template = function(error) {
  console.error(error);
  if (typeof document === 'undefined') {
    return;
  } else if (!document.body) {
    document.addEventListener('DOMContentLoaded', print);
  } else {
    print();
  }
  function print() {
    var pre = document.createElement('pre');
    pre.className = 'errorify';
    pre.textContent = error.message || error;
    document.body.innerHTML = "";
    if (document.body.firstChild) {
      document.body.insertBefore(pre, document.body.firstChild);
    } else {
      document.body.appendChild(pre);
    }
  }
}.toString();

function normalizeError(err) {
  var result = {};
  [
    'message',
    'line',
    'lineNumber',
    'column',
    'columnNumber',
    'name',
    'stack',
    'fileName'
  ].forEach(function(key) {
    var val;
    if (key === 'message' && err.codeFrame) {
      val = err.message + '\n\n' + err.codeFrame; //babelify@6.x
    } else if (key === 'message') {
      val = err.annotated || err.message; //babelify@5.x and browserify
    } else {
      val = err[key];
    }

    if (typeof val === 'number') {
      result[key] = val;
    } else if (typeof val !== 'undefined') {
      result[key] = String(val).replace(ansiRegex, '');
    }
  });

  return result;
}

function defaultReplacer(err) {
  return '!' + template + '(' + JSON.stringify(normalizeError(err)) + ')';
}
