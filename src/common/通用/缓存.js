/**
 * 将数据保存在内存和localStorage缓存中
 *
 */

var store = {};
let readyListeners = {};
let disableLocalStorage = true;


export default {
  set: function(key, value) {
    this.setMemory(key, value);
    this.setSessionStorage(key, value);
    if(!disableLocalStorage) this.setLocalStorage(key, value);
  },

  get: function(key) {
    let value = this.getMemory(key);
    if (value) return value;

    if(!disableLocalStorage) {
      value = this.getLocalStorage(key);
      if (value) return value;
    }

    value = this.getSessionStorage(key);
    if (value) return value;
  },

  triggerWhenAvailable(key, value) {
    // 通知键的监听函数
    if(value !== undefined && readyListeners[key]) {
      let listeners = readyListeners[key];
      listeners.forEach(lis => lis(value));
      delete readyListeners[key];
    }
  },

  // 当制定的键有值时，调用回调函数
  whenAvailable: function(key, callback) {
    let value = this.get(key);
    if (value !== undefined) {
      callback(value);
    } else {
      // 注册监听器
      if (!readyListeners[key]) readyListeners[key] = [];
      readyListeners[key].push(callback);
    }
  },

  setSessionStorage: function (key, value) {
    var data = {value: value, timestamp: Date.now()};
    this.setMemory(key, value);
    try {
      sessionStorage[key] = JSON.stringify(data);
    } catch(e) {
      // 什么也不做
    }
  },
  getSessionStorage: function (key) {
    let value = this.getMemory(key);
    if (value) {return value;}
    try {
      let data = JSON.parse(sessionStorage[key]);
      if (data.value) {
        this.setMemory(key, data.value);
        return data.value;
      }
    } catch(e) {
      // 什么也不做
    }
  },

  setLocalStorage: function (key, value) {
    var data = {value: value, timestamp: Date.now()};
    this.setMemory(key, value);
    try {
      localStorage[key] = JSON.stringify(data);
    } catch(e) {
      // 什么也不做
    }
  },
  getLocalStorage: function (key) {
    let value = this.getMemory(key);
    if (value) {return value;}
    try {
      let data = JSON.parse(localStorage[key]);
      if (data.value) {
        this.setMemory(key, data.value);
        return data.value;
      }
    } catch(e) {
      // 什么也不做
    }
  },

  setMemory: function(key, value) {
    store[key] = {value: value};

    this.triggerWhenAvailable(key, value);
  },
  getMemory: function(key) {
    if (store[key]) {
      return store[key].value;
    }
  },

  del: function(key) {
    if(Array.isArray(key)) {
      key.forEach(this.del);
    }else {
      delete store[key];
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch(e) {
        // 什么也不做
      }
    }
  },

  getStoredTime: function(key) {
    stream.get(key);   // 将值载入内存
    return store[key]?(store[key].timestamp || 0): 0;
  },

  clearStore: function() {
    store = {};
  },

  enableLocalStorage: function() {
    disableLocalStorage = false;
  }
}
