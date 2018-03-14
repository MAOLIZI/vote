const store = require("server/store")();


module.exports = store.define("users", {
  filter: String, // 用户名称
  username: String, // 用户名称
  password: String, // 密码
  wechatId: {type: String, index: true},  // 对应的微信OpenID
  other: store.types.json,  //其他
  updatedAt: store.types.date,  //更新时间
  createdAt: store.types.date //创建时间
});
