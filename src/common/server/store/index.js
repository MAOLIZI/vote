const config = require("util/config");
const Store = require("./store");  // Store是一个Cache+Redis
const Cache = require("./cache");  // Cache是内存+Redis缓存

// 保持一个单独实例的store

let _stores = {};
let _defaultName;

/**
 * 从预存的缓存中获取对应的store
 * @param  {string} name store名字
 * @return {store}      对应的store
 */
function getStore(name) {
  if (name) {
    return _stores[name];
  } else {
    return _stores[_defaultName];
  }
}

getStore.createStore = function(name, cacheConfig, dbConfig) {
  let store = new Store(name, cacheConfig, dbConfig);
  if (_stores[name]) {
    console.error("已经存在同样名称的store，请更换名称重新创建");
    throw "已经存在同样名称的store，请更换名称重新创建";
  }

  _stores[name] = store;
  if (!_defaultName) {
    _defaultName = name;
  }

  return store;
};

getStore.Store = Store;
getStore.Cache = Cache;

module.exports = getStore;
