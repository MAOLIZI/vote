"use strict";

var through = require("through");
var jade = require("jade");

module.exports = function (fileName, options) {
  if (!/\.html$|\.jade$/.test(fileName)) {
    return through();
  }

  let isJade = /\.jade$/.test(fileName);

  var inputString = "";
  return through(
    function (chunk) {
      inputString += chunk;
    },
    function () {
      var self = this;

      options.filename = fileName;

      var result;
      try {
        if (isJade) {
          result = jade.compile(inputString, options)({});
        } else {
          result = inputString;
        }
      } catch (e) {
        self.emit("error", e);
        return;
      }

      var moduleBody = "module.exports = " + JSON.stringify(result) + ";";

      self.queue(moduleBody);
      self.queue(null);
    }
  );
};
