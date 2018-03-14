// 为开发环境的gulp_errors使用，用于在页面显示开发错误

require('debug').enable('koa-send');
const send = require('koa-send');

module.exports = function(root, opts) {
  return function serve(ctx, next){
    if (ctx.method == 'HEAD' || ctx.method == 'GET') {
      return send(ctx, root, opts).then(done => {
        if (!done) {
          ctx.body = "";    // 发生错误，默认输出空白字符
        }
      });
    }
    return next();
  };
}
