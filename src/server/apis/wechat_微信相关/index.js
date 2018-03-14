import {wechatConfig} from "server/wechatConfig";
const coWechat = require("./wechat");
const log = require("server/util/log");
const token = require("server/util/token");

module.exports = [
  {
    method: "POST",
    path: "/wechat/:name",
    desc: "微信跳转",
    validate: {
      params: {
        name: "String|required"
      }
    },
    handler: coWechat(wechatConfig).middleware(async(message) => {
      let info = wechatConfig.keys;

      for (let keyname in info) {
        let match = (keyname === message.EventKey || keyname === message.Content);

        if (match) {
          let currentInfo = info[keyname];

          return [{
            title: currentInfo["title"],
            description: "",
            picurl: currentInfo["picurl"],
            url: currentInfo["hostname"] + "?filter=" + currentInfo.filter + "&id=" + encodeURIComponent(token.create([message.FromUserName, (new Date()).getDate(), currentInfo.filter]))
          }];
        }
      }

      return "";
    })
  },
  {
    method: "GET",
    path: "/wechat/:name",
    desc: "微信跳转",
    validate: {
      params: {
        name: "String|required"
      }
    },
    handler: coWechat(wechatConfig).middleware(async(message) => {
      let info = wechatConfig.keys;

      for (let keyname in info) {
        let match = (keyname === message.EventKey || keyname === message.Content);

        if (match) {
          let currentInfo = info[keyname];

          return [{
            title: currentInfo["title"],
            description: "",
            picurl: currentInfo["picurl"],
            url: currentInfo["hostname"] + "?filter=" + currentInfo.filter + "&id=" + encodeURIComponent(token.create([message.FromUserName, (new Date()).getDate(), currentInfo.filter]))
          }];
        }
      }

      return "";
    })
  }
];
