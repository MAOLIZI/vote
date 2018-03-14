module.exports = function(rootPath) {
  "use strict";
  const path = require("path");
  const gulp = require('gulp');
  const globToExp = require('glob-to-regexp');
  const livereload = require('gulp-livereload');

  // 配置require 路径
  let requireModule = require("../util/require")([
    path.join(rootPath, "src/modules"),     // 公用modules
    path.join(rootPath, "src/common")
  ]);

  const configs = requireModule('util/configs');   // 所有的配置
  let doThrow = (m) => {console.error("错误：", m);process.exit();};
  let argv = require('yargs').argv;

  // 根据传来的参数判断是否需要监控
  let doNotWatch = argv["_"].length > 0;

  const onerror = requireModule('gulp/onerror');
  if (!doNotWatch) {
    // 如果需要监控
    onerror.init(path.join(rootPath, "dist", "gulp_errors.js"));
  }

  let tasks = Object.keys(configs).filter(d=>configs[d].targets);
  if (tasks.length === 0) {doThrow("没有定义任何编译任务，请在config.js里指定targets");}
  if (tasks.indexOf("debug")) {doThrow("缺少debug编译任务，请在config.js里配置");}

  let hasServer = false;			// 标记当前环境是否包含server模块

  let watches = [];
  const nowatch = requireModule("gulp/nowatch"); // 不需要监控的模块
  let onlyWatch = argv.only || argv.focus;    // 如果指定了专注的文件，只关注该文件的修改
  // 根据config.js配置编译任务
  for(let task of tasks) {
    let config = configs[task];

    // 检查需要编译的模块
    let modules = Object.keys(config.targets).filter(d=>config.targets[d]);
    let tasks = [];
    const srcDir = "src";
    const destDir = config.gulpDest || "dist";

    for (let name of modules) {
      let m = config.targets[name];
      let localTasks = [];
      let localWatchTasks = [];
      if (!Array.isArray(m)) {
        m = [m];
      }

      // 每个编译模块的子编译任务
      for (let subM of m) {
        subM = Object.assign({}, subM);  // 创建一个拷贝
        let compiler = subM.compiler;
        if (!compiler) {doThrow(`模块${name}没有指定的编译器`);}

        if (!Array.isArray(subM.src)) {subM.src = [subM.src];}

        let taskSrc = subM.src.map((s) => path.join(".",srcDir, name, s));
        let doTask = requireModule(compiler)(Object.assign({}, subM, {
          src: subM.src.map((s) => path.join(".",srcDir, name, s)),
          base: path.join(".",srcDir, name),
          dest: path.join(".",destDir, subM.dest || '', name, subM.postDest || ''),
          cache: undefined,			// 除了调试任务以外，不使用cache
          root: rootPath,
          debug: argv.debug,
          watch: doNotWatch=== true?false:subM.watch   // 关闭watch选项
        }));
        localTasks.push(doTask);

        // 只为调试任务配置监控
        if(task === "debug" && subM.watch && nowatch.indexOf(compiler) < 0 && (!onlyWatch || name === onlyWatch)) {
          let watch = subM.watch;
          // 如果watch是true，使用src
          if (watch === true) watch = subM.src;

          if (!Array.isArray(watch)) {watch = [watch];}
          let _name = name + " " + compiler + " " + subM.src.join("|");
          let matches = watch.map((w) => path.join(".",srcDir, name, w));

          watches.push({
            watch: matches,
            matches: matches.map(s=>globToExp(s)),
            task: _name
          });
          gulp.task(_name, doTask);
        }
      }

      // 注册单个模块编译的服务
      gulp.task(task + ":compile:" + name, localTasks.length > 1?gulp.series(localTasks):localTasks[0]);

      // 按先后顺序执行本地编译
      tasks.push(task + ":compile:" + name);

    }

    // 同时编译所有模块, 在开始编译前，清空目录
    gulp.task("clean:" + task, requireModule("gulp/clean")({src: path.join(config.gulpDest, "*")}));
    gulp.task(task, gulp.series("clean:" + task, gulp.parallel(tasks)));

    // 判断是否存在服务器
    if (task === "debug" && modules.indexOf("server") >= 0) {hasServer = true;}
  }

  // 配置所需参数
  const params = {
    rootPath: rootPath,
    argv: argv,
    watches: watches    // 监控的路径
  };

  // 注册扩展模块
  requireModule("gulp/tasks/clean")(gulp, requireModule, params);   // 清除目录
  requireModule("gulp/tasks/run")(gulp, requireModule, params);     // 运行服务器
  requireModule('gulp/tasks/test')(gulp, requireModule, params);    // 测试模块
  requireModule('gulp/tasks/git')(gulp, requireModule, params);    // 更新common模块
  requireModule('gulp/tasks/bump')(gulp, requireModule, params);    // 提升版本号
  requireModule('gulp/tasks/help')(gulp, requireModule, params);    // 帮助


  // 注册默认模块
  // 有server模块的前提下才执行运行模块
  if (hasServer) {
    gulp.task('default', gulp.series(['debug', 'run']));
  } else {
    gulp.task('default', gulp.series(['debug']));
  }


}
