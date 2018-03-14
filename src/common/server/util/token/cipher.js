// 用于编码字符串和解码字符串

var crypto = require('crypto');
var word = "cHarMd11r";
var alg = "aes-256-ctr";

module.exports = {
  encrypt: function(origin) {
    if (typeof origin !== "string") {return null;}

    var cipher = crypto.createCipher(alg, word);

    try {
      return cipher.update(origin, "utf8", "base64") + cipher.final("base64");
    } catch(e) {
      return null;
    }

  },

  decrypt: function(secret) {
    if (typeof secret !== "string") {return null;}
    var decipher = crypto.createDecipher(alg, word);

    try {
      return decipher.update(secret, "base64", "utf8") + decipher.final("utf8");
    } catch(e) {
      return null;
    }
  }
};
