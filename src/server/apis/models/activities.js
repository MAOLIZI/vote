const store = require("server/store")();


module.exports = store.define("activities", {
  desc: String, // 活动描述
  filter: String, // 过滤器名称
  type: String, // 活动类型 VOTE
  title: String, // 活动名称
  startDate: store.types.date,  //开始时间
  endDate: store.types.date,  //结束时间
  active: Number, //该活动是否正有效
  config: store.types.json, //该活动的其他设置，JSON格式
  other: store.types.json,  //其他
  updatedAt: store.types.date, //更新时间
  createdAt: store.types.date  //创建时间
});
