// 将redis请求包装成为Promise对象

const log = require("util/log");
const Redis = require("redis");

class RedisClient {
  constructor(name, config) {
    this._redis = Redis.createClient(config.port, config.host, config);
    this._name = name;

    // 使用0号数据库
    this._redis.select(config.database || 0);

    // 初始化消息处理机制
    this._listeners = {};
    this._redisMessage = this._redis.duplicate();
    this._redisMessage.subscribe(this._name);

    // 收到消息，通知每个接收者
    this._redisMessage.on("message", (channel, message) => {
      var obj;
      try {
        obj = JSON.parse(message);
      } catch(e) {obj = message;}

      this.trigger("message", obj);
    });
  }

  get (key) {
    return new Promise((resolve) => {
      this._redis.get(key, function(err, reply) {
        if (err) {
          log.warning("Redis连接有误，错误", err);
          return resolve(null);
        }

        // 如果没有对应的数据，redis默认返回null。这里返回undefined
        if (reply === null) {
          return resolve(null);
        }

        var value;
        try {
          value = JSON.parse(reply);
        } catch(e) {
          resolve(null);
          return;
        }

        resolve(value);
      });
    });
  }

  mget (keys, model) {
    return new Promise((resolve) => {
      this._redis.mget(keys, function(err, reply) {
        if (err) {
          log.warning("Redis连接有误，错误", err);
          return resolve(null);
        }

        // 将所有返回的值一一转化为变量
        var value;
        for (var i=0; i<reply.length; i++) {
          try {
            value = JSON.parse(reply[i]);
          } catch(e) {
            value = null;
          }

          reply[i] = value;
        }

        resolve(reply);
      });
    });
  }

  set (key, value) {
    let that = this;
    return new Promise((resolve, reject) =>  {
      this._redis.set(key, JSON.stringify(value), function(err, reply) {
        if (err) {
          log.warning("Redis连接有误，错误", err);
          return reject(err);
        }

        resolve(reply);

        process.nextTick(()=> that.trigger("update", [key]));
      });
    });
  }

  mset (array) {
    var newArray = [];
    var keys = [];
    // 将所有值转化为字符串
    for (var i=0; i<array.length; i++) {
      if (i % 2 === 0) {
        newArray.push(array[i]);
        keys.push(array[i]);
        continue;
      } else {
        var value = array[i];
        newArray.push(JSON.stringify(value));
      }
    }

    let that = this;
    return new Promise((resolve, reject) =>  {
      this._redis.mset(newArray, function(err, reply) {
        if (err) {
          log.warning("Redis连接有误，错误", err);
          return reject(err);
        }

        resolve(reply);

        process.nextTick(()=> that.trigger("update", keys));
      });
    });
  }

  del (key) {
    let that = this;
    return new Promise((resolve, reject) => {
      this._redis.del(key, function(err, reply) {
        if (err) {
          log.warning("Redis连接有误，错误", err);
          reject(err);
          return;
        }

        resolve(reply);

        process.nextTick(()=> that.trigger("update", Array.isArray(key)?key:[key]));
      });
    });
  }

  async delAll(begin) {
    let cursor = 0;
    let complete = false;
    while(complete === false) {
      let ret = await this.scan(cursor, begin);
      complete = ret.complete;
      cursor = ret.cursor;
      if (ret.keys && ret.keys.length > 0) {
        this.del(ret.keys);
      }
    }
  }

  scan(cursor, begin) {
    return new Promise((resolve, reject) => {
      this._redis.scan(cursor, 'MATCH', begin + '*', 'COUNT', '50', function(err, reply){
        if(err){
          log.warning("Redis连接有误，错误", err);
          reject(err);
          return;
        }

        cursor = reply[0];
        resolve({cursor: cursor, keys: reply[1], complete: cursor==='0'});
      });
    });
  }

  // 清除所有redis缓存
  reset () {
    let that = this;
    return new Promise((resolve, reject) =>  {

      this._redis.flushall(function(err, reply) {
        if (err) {
          return reject(err);
        }

        resolve(reply);

        process.nextTick(()=> that.trigger("flush"));
      });
    });
  }

  // 发布消息
  publish (message) {
    this._redis.publish(this._name, JSON.stringify(message));
  }

  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  }

  trigger(event, data) {
    let callbacks = this._listeners[event] || [];
    callbacks.forEach((callback)=> {
      callback(data);
    });
  }
}

module.exports = RedisClient;
