const router = require('server/api');

module.exports = [{
  method: 'GET',
  path: "/apis",
  desc: "获取服务器所有接口信息",
  group:"服务器接口查询",
  handler: async function handler(ctx) {

    let routes = (router.routes || []).map(r=> {return {
      path: r.path,
      method: r.method,
      validate: r.validate || {},
      group:r.group,
      desc: r.desc || ""
    };});

    ctx.body = routes;
  }
}];
