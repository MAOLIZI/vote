const Activities = require("../models/activities");
const VoteItems = require("../models/voteitems");
const Subjects = require("../models/subjects");
const Votes = require("../models/votes");
const store = require("server/store")();
const convert = require("../classes/convertObject")("voteitems", "other");
const moment = require("moment");
const db = store.db();

let cachedStatus = null, cachedInfo = null;
let lastCachedStatusDate, lastCachedInfoDate;

let cachedActivities = {};
// {filter1: {
//   activityId: 1,
//   date: new Date
// }}


// 从 activities 表中找到有效活动中包含当前时间的所有活动，并返回
async function getActivityForToday(filter) {
  if(cachedActivities[filter] && cachedActivities[filter].date && ((Date.now() - cachedActivities[filter].date)) < 5*60*1000) {
    return cachedActivities[filter].activityId;
  }

  let activities = await Activities.find({
    where: {
      filter: filter,
      startDate: {lte: new Date()}, // Less Than or Equal
      endDate: {gte: new Date()}, // Greater Than or Equal
      active: true,
      type: "VOTE"
    },
    order: "startDate ASC"
  });

  if(activities.length > 0) {
    cachedActivities[filter] = {
      activityId: activities[0].id,
      date: new Date
    }
    return cachedActivities[filter].activityId;
  }else {
    return null;
  }
}




module.exports = [
  {
    method: "POST",
    path: "/vote/vote",
    desc: "给目标投票",
    validate: {
      type: "json",
      body: {
        items: "to_array|array|required"
      },
      header: {
        authorization: "required|token|decode",   // |token| 验证其本身是否为一个令牌
        "authorization.type": "required|equals:user"
      }
    },
    handler: async function(ctx) {
      let {userId, filter} = ctx.request.header.authorization;
      let {items} = ctx.request.body;

      // 获取当天的活动
      let activityId = await getActivityForToday(filter);

      if(!activityId) {
        return ctx.body = "非活动进行时间，暂不能投票！";
      }

      items = items.map(it => parseInt(it, 10));

      // 从 votes 表中找到用户当天投过的票（行数据）
      let vote = await Votes.findOne({where: {userId: userId, activityId: activityId}});
      if(vote) {
        // 检查是否重复投票
        for(let item of items) {
          if (vote.voted.filter( d => d === item).length > 0) {
            ctx.body = "不能重复投票哦！";
            ctx.status = 400;
            return;
          }
        }
        // 给 votes 表插入新增投票对象，并更新保存
        vote.voted = (vote.voted || []).concat(items || []);
        vote.updatedAt = new Date();

        await vote.save();
      }else {
        // 第一次参与投票，则给当前人新建一行表数据
        await Votes.create({
          voted: items,
          userId: userId,
          activityId: activityId,
          updatedAt: new Date(),
          createdAt: new Date()
        });
      }

      await store.db().executeSQL("UPDATE voteitems SET votes = votes + 1 , updatedAt= ? WHERE id IN (?)", [new Date(), items]);

      // 最后将数组格式的 items 输出
      ctx.body = {
        items: items
      };
    }
  },
  {
    method: "GET",
    path: "/vote/userStatus",
    desc: "获取当前用户今日投票",
    validate: {
      header: {
        authorization: "required|token|decode",
        "authorization.type": "required|equals:user"
      }
    },
    handler: async function(ctx) {
      let {userId, filter} = ctx.request.header.authorization;

      let activityId = await getActivityForToday(filter);

      if(!activityId) {
        ctx.status = 400;
        return ctx.body = "暂无活动！";
      }

      try {
        let currentUserVotes = await Votes.findOne({
          where: {
            userId: userId,
            activityId: activityId
          }
        });

        ctx.body = {
          voted: currentUserVotes.voted     // ["27", "32", "33", "28", "34"]
        };
      } catch (e) {
        ctx.body = {
          voted: []
        };
      }

    }
  },
  {
    method: "GET",
    path: "/vote/itemStatus",
    desc: "获取所有目标投票信息",
    validate: {
      header: {
        authorization: "required|token|decode",
        "authorization.type": "required|equals:user, admin"   // 方便管理员在后台可以输出
      }
    },
    handler: async function(ctx) {
      let {filter} = ctx.request.header.authorization;

      // 若已有缓存，且时间差小于 1分钟，则使用之
      if(cachedStatus && lastCachedStatusDate && ((Date.now() - lastCachedStatusDate) < 1*60*1000)) {
        return ctx.body = cachedStatus;
      }

      cachedStatus = (await VoteItems.find({sort: "votes DESC", where: {filter: filter, active: true}})).map( d => {
        let m = convert.toBodyObject(d);

        return {
          id: m.id,
          filter: m.filter,
          votes: m.votes
        };
      });
      lastCachedStatusDate = Date.now();

      ctx.body = cachedStatus;
    }
  },
  {
    method: "GET",
    path: "/vote/staticInfos",
    desc: "获取所有目标静态信息(不包含投票信息)",
    validate: {
      header: {
        authorization: "required|token|decode",
        "authorization.type": "required|equals:user"
      }
    },
    handler: async function(ctx) {
      let {filter} = ctx.request.header.authorization;
      // 若已有缓存，且时间差小于 1分钟，则使用之
      if (cachedInfo && lastCachedInfoDate && (Date.now() - lastCachedInfoDate < 5*60*1000)){
        return ctx.body = cachedInfo;
      }

      cachedInfo = (await VoteItems.find({sort: "votes DESC", where: {filter: filter, active: true}})).map( m => {
        let temp = convert.toBodyObject(m);
        delete temp.votes;
        return temp;
      });
      lastCachedInfoDate = Date.now();

      ctx.body = cachedInfo;
    }
  }
];
