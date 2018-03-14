const Indicative = require("indicative");
const template = require("util/token/template");

// 注册id模版
template.register("id", {
  toArray: (id) => [id.toString()],   // 将给定的id转化为数组
  toValue: (arr) => arr[0]             // 将解码后的数组变成id
});

// 注册indicative判断类型操作
function isToken(data, field, message, args, get) {
  return new Promise(function (resolve, reject) {
    const fieldValue = get(data, field);
    if (fieldValue === undefined) {
      resolve('validation skipped')
      return
    }
    if (template.isValid(fieldValue, args[0])) {
      resolve('validation passed')
      return
    }
    reject(message)
  })
}
Indicative.extend("token", isToken );
Indicative["is.extend"]("token", isToken);

// 注册解码和编码操作
Indicative.extend("decode", function (data, field, message, args, get, set) {
  return new Promise(function (resolve, reject) {
    const value = get(data, field);
    if (value === undefined) {
      resolve('validation skipped')
      return
    }
    let ret = template.decode(value, args[0]);
    if (!ret) {
      reject(message);
      return;
    }
    set(data, field, ret);
    resolve('validation passed');
  });
});

Indicative.extend("toToken", function (data, field, message, args, get, set) {
  return new Promise(function (resolve, reject) {
    const value = get(data, field);
    if (value === undefined) {
      resolve('validation skipped')
      return
    }
    let ret = template.create(args[0], value);
    if (!ret) {
      reject(message);
      return;
    }
    set(data, field, ret);
    resolve('validation passed');
  });
});
