const LRU = require('lru-cache');
const Redis = require("./redis");
const Sync = require("./sync");

/**
 * 缓存模块，支持内存缓存或内存缓存+Redis
 */
function uniqueKey(name, modelName, key, value) {
  return name + "_" + modelName + "_" + key + "_" + value;
}

function isInstance(obj) {
  return obj && obj.getDataSource && typeof obj.getDataSource === "function" && obj.toObject;
}

class Cache {
  constructor(name, cacheConfig) {
    this._modelConfigs = {};
    this._name = name;

    let memoryConfig = (cacheConfig.memory === undefined)?{
      max: 5000,
      maxAge: 1000 * 60 * 60
    }:cacheConfig.memory;

    // 只要内存设置不为false，创建内存
    if (memoryConfig !== false) {
      this._memoryCache = LRU(memoryConfig);
    }

    let redisConfig = cacheConfig.redis;
    if (redisConfig) {
      if (typeof(redisConfig) !== "object") {redisConfig = {};}
      this._redis = new Redis(name, redisConfig);
    }

    if (this._memoryCache && this._redis) {
      // 只有同时拥有内存和redis，才需要／可以在不同实例间同步数据
      this._sync = new Sync(name, this._memoryCache, this._redis);
    }
  }

  /**
   * 从缓存中获取数据，除了自身和store外，不对外使用
   */
  async _get(key, model) {
    let memory = this._memoryCache?this._memoryCache.get(key):null;

    if (!memory && this._redis) {
      let ret = await this._redis.get(key);
      if (ret && model) {
        ret = model(ret);
      }
      if (this._memoryCache) {
        // 将redis取得的数据保存在缓存中
        this._memoryCache.set(key, ret);
      }
      if (ret === undefined) {ret = null;}
      return ret;
    }
    if (memory === undefined) {memory = null;}
    return memory;
  }

  /**
   * 从缓存中设置数据，除了自身和store外，不对外使用
   */
  async _set(key, data) {
    this._memoryCache?this._memoryCache.set(key, data):0;
    if (this._redis) {
      if (isInstance(data)) {
        data = data.toObject();
      }
      await this._redis.set(key, data);
    }
  }

  /**
   * 从缓存中删除，除了自身和store外，不对外使用
   */
  async _del(key) {
    this._memoryCache?this._memoryCache.del(key):0;
    if (this._redis) {
      await this._redis.del(key);
    }
  }

  /**
   * 清空某一类的键，除了自身和store外，不对外使用
   */
  async _delAll(begin) {
    begin = this._name + "_" + begin;
    if (this._memoryCache) {
      let keys = this._memoryCache.keys();
      keys.filter(k => k.indexOf(begin) === 0).forEach(key => this._del(key));
    }

    if (this._redis) {
      await this._redis.delAll(begin);
    }
  }

  /**
    * 清空内存缓存
    */
  async resetMemoryCache() {
    if (this._memoryCache) {
      this._memoryCache.reset();
    }
  }

  /**
    * 清空所有缓存
    */
  async resetAll() {
    this.resetMemoryCache();
    if (this._redis) {
      await this._redis.reset();
    }
  }

  /**
   * 为指定模型提供便捷操作方法，模仿数据库访问API
   */
  getModel(modelName, config) {
    /**
     * 配置数据模型对应的缓存
     */
    if (config) {
      this._modelConfigs[modelName] = config;
    } else {
      config = this._modelConfigs[modelName] || {};
    }

    let ids = config.ids || ["id"];
    let modelBuilder = config.model || function() {};
    let idName = ids[0];
    const cache = this;
    const name = this._name;

    let model =  {
      exists: async function(id) {
        return (await cache._get(uniqueKey(name, modelName, idName, id), modelBuilder)) !== null;
      },

      findById: async function(id) {
        return await cache._get(uniqueKey(name, modelName, idName,  id), modelBuilder);
      },

      findByUniqueKey: async function(key, value) {
        if (ids.indexOf(key) >= 0) {
          return await cache._get(uniqueKey(name, modelName, key, value), modelBuilder);
        }
      },

      destroy: async function(data) {
        for (let i=0; i<ids.length; i++) {
          cache._del(uniqueKey(name, modelName,  ids[i], data[ids[i]]));
        }
      },

      delAll: async function() {
        cache._delAll(modelName);
      }
    };

    model.create = model.save = model.update = async function(data) {
      for (let i=0; i<ids.length; i++) {
        cache._set(uniqueKey(name, modelName, ids[i], data[ids[i]]), data);
      }
    };

    return model;
  }
}

module.exports = Cache;
