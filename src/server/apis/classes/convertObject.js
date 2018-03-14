const store = require("server/store")();
module.exports = function (name,field="other") {
const definition = Object.keys(store.getDefinition(name));
  /*
    将前台body转为数据库的存储对象
    param: body 前台数据
  */
  function toDBObject(body) {
    //let b = JSON.parse(JSON.stringify(body));
    let b = Object.assign({}, body);
    let ret = {};
    for (let key of definition) {
      if (!(key in ["id", "updatedAt", "createdAt"])) {
        ret[key] = b[key];
      }
      delete b[key];
    }
    if (ret[field]) {b[field] = ret[field];}
    ret[field] = b;
    return ret;
  }
  /*
    将数据库转数据为的前台body对象
    param: db 数据库数据数据
  */
  function toBodyObject(db) {
    let ret = {};
    for (let key of definition) {
      ret[key] = db[key];
    }
    delete ret[field];
    return Object.assign({}, db[field], ret);
  }

  return {
    toDBObject: toDBObject,
    toBodyObject: toBodyObject
  };
}
