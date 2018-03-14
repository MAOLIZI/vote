const Subjects = require("../models/subjects");
const store = require("server/store")();
const convert = require("../classes/convertObject")("subjects", "other");
const db = store.db();

let cached = {};
// {
//  filter: {
//      subjects: [],
//      date: new Date
//   }
// }

module.exports = [
  {
    method: "GET",
    path: "/subjects",
    desc: "投票所有类别信息",
    validate: {
      header: {
        authorization: "required|token|decode",
        "authorization.type": "required|equals:user, admin"
      }
    },
    handler: async function(ctx) {
      let {filter} = ctx.request.header.authorization;

      if (cached[filter] && cached[filter].date && (Date.now() - cached[filter].date) <= 1*60*1000) {
        return ctx.body = cached[filter].subjects;
      }

      let subjects = await Subjects.find({
        where: {filter: filter}
      });

      subjects = subjects.map(sub => convert.toBodyObject(sub));

      cached[filter] = {
        subjects: subjects,
        date: Date.now()
      };

      ctx.body = subjects;
    }
  },
  {
    method: "POST",
    path: "/subject/:id",
    desc: "某一个投票类别的信息",
    validate: {
      params: {
        id: "required|integer|to_int"
      },
      header: {
        authorization: "required|token|decode",
        "authorization.type": "required|equals:user, admin"
      }
    },
    handler: async function(ctx) {
      let {filter} = ctx.request.header.authorization;
      let {subjectId} = ctx.params.id;

      ctx.body = "完善中";
    }
  }
];
