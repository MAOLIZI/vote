const path = require("path");
const fs = require('fs');

// 自定义路径的require
module.exports = function(givenLocations) {
  if (!givenLocations) {
    throw "require.js没有指定尝试的路径";
  }

  // 定义基于当前主目录的require
  let map = {};
  function tryPath(location) {
    try {
      fs.accessSync(location, fs.F_OK);
      return true;
    } catch(e) {
      return false;
    }
  }

  let ret =  function(name) {
    if (map[name]) {return map[name];}

    let locations = [];
    for (let l of givenLocations) {
      let loc = path.join(l, name);
      locations.push(loc);
      if (name.indexOf(".") < 0) {
        locations.push(loc + ".js");
        locations.push(path.join(loc, "index.js"));
      }
    }

    // 依次尝试，找到后返回
    for(let location of locations ) {
      if (tryPath(location)) {
        map[name] = require(location);
        return map[name];
      }
    }
  };
  ret.paths = givenLocations;
  return ret;
};
