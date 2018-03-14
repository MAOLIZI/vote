const store = require("server/store")();


module.exports = store.define("voteitems", {
  "filter": String, //作品 filter
  "sortby": Number, // 作品/候选人在列表中的显示顺序
  "typeTitle": String, // 所属类别主标题
  "typeSubtitle": String, // 所属类别副标题
  "votes": Number,  //票数
  "active": Number, //判断是否有效
  "file": String, // 作品文件类别 (word/picture/video/text)
  "title": String, // 作品标题
  "subtitle": String, // 作品副标题
  "sex": Number,  // 1 代表男，0 代表女
  "poster": String, // 作品海报（列表显示）
  "desc": String, // 作品口号
  "content": store.types.json,  // 作品内容(文字、数组图片、视频链接)
  "intro": store.types.json,  // 作品内容(文字、数组图片、视频链接)
  "other": store.types.json,  //作品其他信息
  "updatedAt": store.types.date,  //更新时间
  "createdAt": store.types.date //创建时间
});
