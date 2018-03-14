const router = require('api');
const token = require('util/token');
const cipher = require('util/token/cipher');
const config = require("util/config");
const log = require("util/log");
const store = require("store")();
let yuntongxunConfig = config.yuntongxun;

if (!yuntongxunConfig) {
  log.error("尚未配置云通讯配置, 因此短信发送功能关闭，请在config.js中配置yuntongxun属性");
  module.exports = undefined;
} else {
  log.info("云通讯配置", yuntongxunConfig);
  const ipy = require("util/ipy-yuntongxun/index.js").init(yuntongxunConfig);

  module.exports = function(telephone, data) {
    return new Promise(async function(resolve, reject){
      let now = new Date;
      let datestr = now.getFullYear() + (now.getMonth() + 1) + now.getDate();
      let count = await store.get("sms" + telephone + datestr) || 0;
      if (count < 5) {
        ipy.templateSMS({
          to: telephone,
          appId: yuntongxunConfig.appId,
          templateId: yuntongxunConfig.templateId,
          datas: data
        }, function(error, body) {
          if (!error) {
            if (body.statusCode === '000000') {
              store.set("sms" + telephone + datestr, count + 1);
              resolve(true);
            } else {
              reject("发送失败");
            }
          } else {
            reject(error);
          }
        });
      } else {
        reject("单一号码发送太多次短信");
      }
    });
  }
}
