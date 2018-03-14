// 载入所有配置
const configs = require("./configs");

function loadConfig() {
  // 猜测当前应该使用的配置
  if (global.ENV) return useConfig(global.ENV);

  // 运行于azure环境
  let siteName = process.env.WEBSITE_SITE_NAME;
  if (siteName && configs[siteName]) return useConfig(siteName);
  if (siteName && configs.azure) return useConfig('azure');

  console.log("当前网站名称", siteName);

  // 根据hostname判断
  let hostname =  require("os").hostname();
  if (hostname && configs[hostname]) return useConfig(hostname);

  // 根据env判断
  let env = process.env.CONFIG_ENV;
  if (env && configs[env]) return useConfig(env);

  // 使用默认的开发环境
  if (configs.debug) return useConfig('debug');
  if (configs.development) return useConfig('development');
  if (configs.dev) return useConfig('dev');

  // 使用默认环境
  return useConfig('default');
}

function useConfig(env) {
  console.log(`运行环境：${env}`);

  let config = configs[env];

  // 为了避免错误，AZURE环境不能使用debug=true设置
  if (config.debug === true && process.env.WEBSITE_SITE_NAME) {
    console.log("azure环境不允许设置debug=true，请更新config.js！");
    process.exit();
  }

  return config;
}

module.exports = loadConfig();
