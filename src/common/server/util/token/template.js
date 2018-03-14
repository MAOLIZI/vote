const token = require("util/token");
const config = require("util/config");

let converters = {};
module.exports = {
  register(name, converter) {
    if (config.debug && converters[name]) throw "不能重复定义token处理器:" + name;
    if (typeof converter.toArray !== "function" || typeof converter.toValue !== "function") throw "错误的token处理器:" + name;

    converters[name] = converter;
  },

  create(type, obj) {
    let converter = converters[type];
    let data = converter.toArray(obj);
    data.unshift(type);
    return token.create(data);
  },

  decode(tok, type) {
    let data = token.decode(tok);
    if (data && Array.isArray(data)) {
      // 获取解密的类型
      let t = data.shift();
      // 如果提供了decode的类型，那么验证该类型是否和token匹配
      if (type && type !== t) {return;}

      let converter = converters[t];
      if (!converter) {return undefined;}

      try {
        return converter.toValue(data);
      } catch(e) {
        return;
      }

    }
  },

  isValid(token, type) {
    let decoded = this.decode(token, type);
    if (typeof token === "string" && this.decode(token, type)) {
      return true;
    } else {
      return false;
    }
  }
}
