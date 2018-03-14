const store = require("server/store")();


module.exports = store.define("votes", {
  voted: store.types.json,  //投票对象 Id => 数组
  userId: Number, //用户Id,
  activityId: {type: Number, index: true}, //活动Id
  createdAt: store.types.date, //创建时间
  updatedAt: store.types.date  //更新时间
});
