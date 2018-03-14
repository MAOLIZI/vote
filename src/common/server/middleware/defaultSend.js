require('debug').enable('koa-send');
const send = require('koa-send');

module.exports = function(root, opts) {
  return function serve(ctx, next){
    if (ctx.method == 'HEAD' || ctx.method == 'GET') {
      return send(ctx, root, opts).then(done => {
        if (!done) {
          return next();
        }
      });
    }
    return next();
  };
}
