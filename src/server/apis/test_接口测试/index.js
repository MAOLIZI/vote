module.exports = [{
  method: 'GET',
  path: "/test",
  desc: "获取服务器所有接口信息",
  validate: {
    query: {
      id: "token|decode|required"
    },
    output: {
      '200-299': {
        body: {
          token: "toToken:id"
        }
      }
    }
  },
  handler: async function handler(ctx) {
    ctx.body = {
      token: ctx.request.query.id,
      value: ctx.request.query.id
    };
  }
}];
