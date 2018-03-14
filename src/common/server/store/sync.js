
const log = require("util/log");

class SyncClient {
  constructor(name, memoryCache, redisCache) {
    this._name = name;
    this._memoryCache = memoryCache;
    this._redis = redisCache;
    this._id = Math.floor(Math.random() * 100000);

    // 凡是redis的更新，都广播出去
    this._redis.on("update", (keys) => {
      this._redis.publish({
        id: this._id,
        type: "update",
        keys: keys
      });
    });

    this._redis.on("flush", () => {
      this._redis.publish({
        id: this._id,
        type: "flush"
      });
    });

    // 凡是收到的广播消息，更新本地内存
    this._redis.on("message", (msg) => {
      if (!msg || typeof msg !== "object" || !msg.type) {return;}
      if (msg.id === this._id) {return;}

      let type = msg.type;

      switch(type) {
        case "update":
          (msg.keys || []).forEach((key)=>{this._memoryCache.del(key);});
          break;
        case "flush":
          this._memoryCache.reset();
          break;
        default:
          break;
      }
    });
  }
}

module.exports = SyncClient;
