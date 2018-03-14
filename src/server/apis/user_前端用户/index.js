const Users = require("../models/users");
const Activities = require("../models/activities");
const token = require('server/util/token');
const template = require("server/util/token/template");
const convert = require("../classes/convertObject")("users", "other");
const config = require('util/config');


template.register("userToken", {
  toArray: (user) => [user.id, user.filter, Date.now() + ""],
  toValue: (arr) => {
    let date = new Date(arr[2]);

    if ( (new Date - date) >= (2 * 7 * 3600 * 24 * 1000) ) {
      return;
    } else {
      return {
        type: "user",
        userId: arr[0],
        filter: arr[1],
        access: {
          user: true,
          activityRead: true
        }
      };
    }
  }
});

function decodeWechatId(wechatId) {
  if (!config.debug) {
    wechatId = token.decode(wechatId);
    if (wechatId) {
      return {
        wechatId: wechatId[0],
        filter: wechatId[2]
      };
    }
  } else {
    return {
      wechatId: wechatId
    };
  }
}


module.exports = [
  {
    method: 'POST',
    path: "/user/login",
    desc: "用户登录",
    validate: {
      type: "json",
      body: {
        wechatId: "string|required",
        filter: "string"
      },
      output: {
        '200-299': {
          body: {
            userToken: "toToken:userToken"
          }
        }
      }
    },
    handler: async function handler(ctx) {
      let {wechatId} = ctx.request.body;

      let wechatObj = decodeWechatId(wechatId);
      wechatId = wechatObj.wechatId;
      let filter = wechatObj.filter;

      // 测试环境的filter允许从前台获取
      if (config.debug && !filter) {
        filter = ctx.request.body.filter || "";
      }

      if (!wechatId) {
        ctx.status = 400;
        ctx.body = "错误的微信ID";
        return;
      }

      let user = await Users.findOne({
        where: {
          wechatId: wechatId,
          filter: filter
        }
      });

      if (user) {
        ctx.body = {
          userToken: user,
          filter: user.filter,
          username: user.username,
          other: user.other,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt
        };
      } else {
        ctx.status = 400;
        ctx.body = "用户名或密码错误";
      }
    }
  },
  {
    method: 'POST',
    path: "/user/register",
    desc: "添加用户",
    validate: {
      type: "json",
      body: {
        filter: "string",
        wechatId: "string|required"
      },
      output: {
        '200-299': {
          body: {
            userToken: "toToken:userToken"
          }
        }
      }
    },
    handler: async function handler(ctx) {
      let body = ctx.request.body;
      let {wechatId} = body;
      let wechatObj = decodeWechatId(wechatId);
      wechatId = wechatObj.wechatId;
      let filter = wechatObj.filter;

      // 测试环境的filter允许从前台获取
      if (config.debug && !filter) {
        filter = ctx.request.body.filter || "";
      }

      if (!wechatId) {
        ctx.status = 400;
        ctx.body = "错误的微信ID";
        return;
      }

      let m = convert.toDBObject(body);
      m.wechatId = wechatId;
      m.filter = filter;
      m.updatedAt = new Date;
      m.createdAt = new Date;

      let match = await Users.findOne({
        where: {
          wechatId: wechatId,
          filter: filter
        }
      });

      if (match) {
        ctx.body = "该用户已经注册，不能重复注册！";
        ctx.status = 400;
        return;
      }

      try {
        let user = await Users.create(m);
        if (user) {
          ctx.body = {
            id: user.id,
            filter: filter,
            userToken: user,
            username: user.username,
            other: user.other,
            updatedAt: new Date(),
            createdAt: new Date()
          };
        } else {
          ctx.body = "添加用户失败！";
        }
      } catch (e) {
        ctx.body = e;
      }
    }
  }
];
