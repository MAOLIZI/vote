/**
 * 和后台连接的接口
 * 同时也提供后台数据缓存
 */
const cache = require("通用/缓存");

let authorizationKey;
const EMPTY_KEY = "empty";
let BASE_URL = "";

function executeWhenAvailable(func) {
  let promise = $.Deferred();

  if (authorizationKey === EMPTY_KEY) {
    func().then(m => promise.resolve(m), m => promise.reject(m));
  } else {
    cache.whenAvailable(authorizationKey, () => {
      func().then(m => promise.resolve(m), m => promise.reject(m))
    });
  }

  return promise;
}

function getUrl(api) {
  if (api.indexOf("http") >= 0) {
    return api;
  }

  if (api && api[0] !== "/") {
    api = "/" + api;
  }
  return BASE_URL  + api;
}


module.exports = {
  // 提供默认发送的Authorization头字段对应的cache键名
  setAuthorizationKey (key) {
    authorizationKey = key;

    // 如果key不存在，就不设置authorizeKey, 并立刻执行所有挂起的请求
    if (!key) {
      authorizationKey = EMPTY_KEY;
      this.setAuthorizationToken(EMPTY_KEY);
    }
  },

  getAuthorizationKey() {
    return authorizationKey;
  },

  disableAuthorization() {
    authorizationKey = EMPTY_KEY;
  },

  getAuthorizationToken() {
    return authorizationKey !== EMPTY_KEY?cache.get(authorizationKey):undefined;
  },

  setAuthorizationToken(token) {
    cache.set(authorizationKey, token);
  },

  hasAuthorizationToken() {
    return this.getAuthorizationToken() !== undefined;
  },

  setBaseUrl(url) {
    BASE_URL = url;
  },

  getBaseUrl(url) {
    return BASE_URL;
  },

  // 和后台连接的接口
  post: function(url, data, whenAvailable) {
    url = getUrl(url);
    let func = () =>  $.ajax({
      method: "POST",
      url: url,
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      headers: {
        'authorization': this.getAuthorizationToken()
      }
    }).then(onSuccess, onError);

    if (whenAvailable === false) {
      return func();
    } else {
      return executeWhenAvailable(func);
    }
  },

  get: function(url, data, whenAvailable) {
    url = getUrl(url);

    let func = () =>  $.ajax({
      method: "GET",
      url: url,
      data: data,
      dataType: 'json',
      headers: {
        'authorization': this.getAuthorizationToken()
      }
    }).then(onSuccess, onError);

    if (whenAvailable === false) {
      return func();
    } else {
      return executeWhenAvailable(func);
    }
  },
  
  jsonp: function(url, data, whenAvailable) {
    url = getUrl(url);

    return $.ajax({
      method: "GET",
      url: url,
      data: data,
      dataType: 'jsonp'
    }).then(onSuccess, onError);
  },

  put: function(url, data, whenAvailable) {
    url = getUrl(url);

    let func = () => $.ajax({
      method: "PUT",
      url: url,
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      headers: {
        'authorization': this.getAuthorizationToken()
      }
    }).then(onSuccess, onError);

    if (whenAvailable === false) {
      return func();
    } else {
      return executeWhenAvailable(func);
    }
  },

  sendDelete: function(url, data, whenAvailable) {
    url = getUrl(url);

    let func = () => $.ajax({
      method: "DELETE",
      url: url,
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      headers: {
        'authorization': this.getAuthorizationToken()
      }
    }).then(onSuccess, onError);

    if (whenAvailable === false) {
      return func();
    } else {
      return executeWhenAvailable(func);
    }
  },

  // 代理转发请求，绕过跨域问题
  // 无需等待token
  redirect: function(method, url, data, option) {
    url = getUrl(url);

    let redirectData = {
      url: url,
      data: data,
      json: (option || {}).json || false  // 不使用JSON
    }
    return $.ajax({
      method: "POST",
      url: getUrl("/api/proxy/" + method.toLowerCase()),
      data: JSON.stringify(redirectData),
      dataType: 'json',
      contentType: "application/json; charset=utf-8"
    }).then(onSuccess, onError);
  },

  upload: function(url, files, whenAvailable) {
    url = getUrl(url);

    // Create a formdata object and add the files
    var data = new FormData();
    for (let i=0; i<files.length; i++) {
      data.append("file" + i, files[i]);
    }

    let func = () => $.ajax({
      url: url,
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      headers: {
        'authorization': this.getAuthorizationToken()
      },
      processData: false, // Don't process the files
      contentType: false // Set content type to false as jQuery will tell the server its a query string request
    }).then(onSuccess, onError);

    if (whenAvailable === false) {
      return func();
    } else {
      return executeWhenAvailable(func);
    }
  }
};

function onSuccess(json, res) {
  this.response = res;
  return json;
}
function onError(res) {
  this.response = res;
  let error = res.responseJSON || res.responseText;

  return (typeof error === "object") ? ('请输入用户名或密码' || error) : error;
}
