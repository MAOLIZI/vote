const store = require("server/store")();

module.exports = store.define("wechat", {
  type: String, // 公众号还是企业号
  name: String,//公众号名字，英文
  comment: String, // 公众号名字，中文
  appId: String,//公众号的appId
  appSecret: String,//公众号的appSecret
  token: String,//公众号的token
  AESEncodingKey: String,//公众号的AESEncodingKey
  accessToken: store.types.json,
  createdAt: store.types.date,//创建时间
  updatedAt: store.types.date//更新时间
});
