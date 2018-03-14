module.exports = {
  method: 'GET',
  path: '/status',
  desc: "获取服务器工作状态",
  handler: async function handler(ctx) {
    ctx.body = "正常";
  }
};
