const store = require("server/store")();


module.exports = store.define("subjects", {
  filter: String, // 过滤器名称
  title: String,  // 类别主名称
  subtitle: String,  // 副名称
  eName: String,  // 英文名称
  limit: Number,  // 投票上限
  icon: String,  // 代表图标
  bgimg: String,  // 菜单页用背景图
  banner: String,  // 列表页顶部banner图
  other: store.types.json,  // 其他信息
  createdAt: store.types.date, //创建时间
  updatedAt: store.types.date  //更新时间
});
