const {DataSource, ModelBuilder} = require("loopback-datasource-juggler");
const Cache = require("./cache.js");

class Store {
  /**
   * 初始化缓存和数据库连接设置
   */
  constructor(name, cacheConfig, dbConfig) {
    this._cache = new Cache(name, cacheConfig);
    this._db = DataSource(dbConfig);
    this._models = {};
    this._name = name;

    // 指定类型
    this.types = ModelBuilder.schemaTypes;

    initStore(this);
  }

  /**
   * 直接返回缓存的数据连接
   */
  cache (name) {
    if (!name) {return this._cache;}
    return this._cache.getModel(name);
  }

  /**
   * 直接返回数据库的数据连接
   */
  db (name) {
    if (!name) {return this._db;}
    return this._db.getModel(name);
  }

  /**
   * 返回包装过的模型
   */
  getModel(name) {
    if (this._models[name]) {
      return this._models[name];
    }

    // 生成模型
    let dbModel = this.db().getModel(name);
    console.log(dbModel.definition.properties);
    if (dbModel) {
      let storeModel =  getStoreModel(dbModel, this);
      this._models[name] = storeModel;

      return storeModel;
    }
  }

  getDefinition(name) {
    let dbModel = this.db().getModel(name);
    if (dbModel && dbModel.definition) {
      return dbModel.definition.properties || {};
    }
  }

  /**
   * 直接设置缓存中，同步至redis（如果存在）
   */
  async set(key, value) {
    return await this._cache._set(this._name + "__" + key, value);
  }

  async get(key) {
    return await this._cache._get(this._name + "__" + key);
  }

  async del(key) {
    return await this._cache._del(this._name + "__" + key);
  }
}


/**
 * 初始化store对象，针对给定的cache和数据库
 */
function initStore(store) {
  let db = store.db();

  // 将数据库相应方法直接映射到store，除非已经定义了相应方法
  let methods = Object.keys(db).concat(Object.keys(Object.getPrototypeOf(db)));
  methods.forEach(name => {
    // 如果相应函数未定义，覆盖之
    if (!store[name] && db[name]) {
      if (typeof db[name] === "function") {
        store[name] = function() {
          // 调用原本的函数
          let ret = db[name].apply(db, arguments);

          if (ret && ret.then) {
            // 如果有返回值，且返回值是一个Promise，检查resolve的结果
            return ret.then(function(obj) {
              // 如果返回的是模型Model，嵌套之
              if(isModel(obj)) {
                return getStoreModel(obj, store);
              }
            });
          } else {
            // 如果有返回值，且返回值是一个直接的对象，检查resolve的结果
            if (isModel(ret)) {
              return getStoreModel(ret, store);
            }
          }

          return ret;
        };
      } else {
        // 拷贝其他属性
        store[name] = db[name];
      }
    }
  });

  if(db.connector.execute) {
    db.executeSQL = function(sql, params) {
      if (!params) {
        console.warn(`executeSQL最好使用带参数的方法，避免SQL注入风险。用法：store.db().executeSQL("select * from user where name=?", ["abc"]);`);
      }
      return new Promise((resolve, reject) => {
        db.connector.execute(sql, params || [], function(err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };
  }
}

/**
 * 判断给定的对象是否是一个数据模型
 */
function isModel(val) {
  // 经验主义方法判别一个对象是否是一个数据模型
  return typeof val === "function" && val.modelName && val.findById;
}

/**
 * 包装一个模型，并覆盖相应的方法，使得它支持从缓存中获取
 */
function getStoreModel(model, store) {
  const modelName = model.modelName;

  let cachedModel = store._cache.getModel(modelName, {
    ids: model.definition.ids().map(d=>d.name) || ["id"],
    model: model
  });

  // 挂钩数据库的事件，用于更新缓存
  if (!model.__observed__) {
    let idName = (model.definition && model.definition.idName()) || "id";

    model.observe("after save", function(ctx, next) {
      if (ctx.instance) {
        process.nextTick(() => cachedModel.save(ctx.instance));
      } else if (ctx.where) {
        // 如果进行了批量更新， 缓存已经不可靠，清空缓存
        process.nextTick(() => cachedModel.delAll());
      }
      next();
    });

    model.observe("after delete", function(ctx, next) {
      if (ctx.instance) {
        process.nextTick(() => cachedModel.destroy(ctx.instance));
      } else if (ctx.where) {
        // 如果进行了批量删除， 缓存已经不可靠，清空缓存
        process.nextTick(() => cachedModel.delAll());
      }
      next();
    });

    model.observe("loaded", function(ctx, next) {
      if (ctx.instance) {
        process.nextTick(() => cachedModel.save(ctx.instance));
      }
      next();
    });

    model.findByUniqueKey = function(key, value) {
      let where = {};
      where[key] = value;
      return model.findOne({where: where});
    };

    model.__observed__ = true;
  }

  let ret = {
    async exists(id) {
      // 对于默认参数外用法，调用原函数
      if (arguments.length > 1) return await model._exists.apply(model, arguments);
      // 检查缓存中是否存在
      return await cachedModel.exists(id) || await model.exists(id);
    },

    async findById(id) {
      // 对于默认参数外用法，调用原函数
      if (arguments.length > 1) return await model.findById.apply(model, arguments);

      // 检查缓存中是否存在
      return await cachedModel.findById(id) || await model.findById(id);
    },

    async findByUniqueKey(key, value) {
      let where = {};
      where[key] = value;
      return await cachedModel.findByUniqueKey(value) || await model.findOne({where: where});
    },

    cache() {
      return cachedModel;
    },

    db() {
      return model;
    }
  };

  // 其他方法，执行数据库原有方法
  ["create", "save", "update", "destroy", "upsert", "find", "findOne", "count", "findOrCreate", "destroyAll", "updateAll"].forEach(name => {
    ret[name] = async function() {
      return model[name].apply(model, arguments);
    };
  });

  return ret;
}

// 可能的类型
Store.types = ModelBuilder.schemaTypes;


module.exports = Store;
