const log = require("server/util/log");

// 异常统一处理器: 捕获业务代码抛出的异常,用户也可自己手动捕获异常,手动捕获后将不会被该处理器处理.
module.exports = function () {
    return async (ctx,next) => {
        var msg;
        var code = 500;
        try {
            await next();
        } catch (e) {
            log.error('---> Global Exception Handler: ', e.name, e.message, e);
            msg = e.message;

            if (e.name == "token_error") {
                code = 302;
            } else if (e.name == "access_denied") {
                code = 403;
            }
        } finally {
            if (msg) {
              ctx.status = code;
              ctx.body = msg;
            }
        }
    }
}
