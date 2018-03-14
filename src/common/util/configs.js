const path = require("path");
const fs = require("fs");
const defaultConfig = require("./defaultConfig");
const extend = require("util")._extend;

// 载入配置文件并完善所有配置
function loadConfigs() {
	let configs = {};

	let dirs = __dirname.split(path.sep);
	let index = dirs.indexOf("dist");
	if (index < 0) { index = dirs.indexOf("src");}

	let rootDir = dirs.splice(0, index+1).join(path.sep);

	let configFile = path.join(rootDir, "config.js");

	try {
		fs.accessSync(configFile);		// 如果失败，抛出异常
		configs = require(configFile);
		// 将默认设置和真正的默认合并
		configs["default"] = extend(extend({}, defaultConfig), configs["default"] || {});

		// 将每个配置扩充成完整配置
		for (let key in configs) {
			if (key === "default") continue;
			configs[key] = extend(extend({}, configs["default"]), configs[key]);
		}
	} catch(e) {
		console.error(`找不到配置文件${configFile}，使用默认配置`);
		configs = {
			"default": extend({}, defaultConfig)
		};
	}

	return configs;
}

module.exports = loadConfigs();
