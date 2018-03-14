// 管理请求过程中发生的Token的生成和解密

var cipher = require('./cipher');
var digest = "A_r@c2";

var SEP = "~~";

module.exports = {
  create: function(obj) {
    return cipher.encrypt(JSON.stringify(obj) + SEP + digest);
  },

  decode: function(token) {
    if (typeof token !== "string") {return null;}

    var str = cipher.decrypt(token);

    if(str) {
      var array = str.split(SEP);
      if(array.length === 2) {
        if (array.pop() === digest) {
          try{
            return JSON.parse(array[0]);
          } catch(e) {
            return null;
          }
        }
      }
    }

    // 解密失败，返回null
    return null;
  },

  isValidToken: function(token) {
    return this.decode(token) !== null;
  }
};
