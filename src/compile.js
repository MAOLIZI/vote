const locals = require("./locals");
const path = require("path");

module.exports = function(env) {
  const dest = env==="debug"?undefined:"dist";
  const minify = env==="debug"?undefined:true;

  let ossPath = "http://store.streamsoft.cn/railway-dwd/";
  if (env === "debug") {
    ossPath = "/";
  }

  const serverRequirePath = [
    path.join(__dirname, "server"),  // 服务器项目根目录
    path.join(__dirname, "server", "modules"),      // 项目内部的modules
    path.join(__dirname, "common"),    // 公用modules模块
    path.join(__dirname, "common", "server")    // 服务器模块地址
  ];

  let ret =  {		// 编译目标
    ".": env==="debug"?
      // DEBUG
      [{		// debug模式拷贝默认文件
        compiler: "gulp/copy",
        src: ["config.js"]
      }]
      :
      // RELEASE
      [{		// 拷贝默认文件
        compiler: "gulp/copy",
        src: ["config.js"],
        dest: 'dist'
      }, {		// 拷贝根目录文件
        compiler: "gulp/copy",
        src: ["../app.js", "../iisnode.yml", "../package.json", "../web.config"],
        flatten: true // 扁平路径
      }],
    common: [{
      compiler: "gulp/compile-babel",
      src: ['util/**/*.js', 'server/**/*.js'],
      minify: minify,
      dest: dest,
      requirePaths: serverRequirePath,
      compileChanged: env==='debug'
    }],
    server: [ {		// 编译服务器
      compiler: "gulp/compile-babel",
      src: '**/*.js',
      minify: minify,
      dest: dest,
      requirePaths: serverRequirePath,
      compileChanged: env==='debug'
    },{		// 拷贝服务器支持文件
      compiler: "gulp/copy",
      src: '**/*.!(js)',
      dest: dest
    }],
    "admin": [
      {
        compiler: "gulp/compile-less",
        src: "index.less",
        locals: Object.assign({}, locals, {ossPath: `'/admin/'`}),
        watch: ["**/*.less"],    // 不光监控本身，也监控其他less文件
        dest: dest
      },
      {
        compiler: "gulp/compile-jade",
        src: 'index.jade',
        locals: {
          ossPath: `/admin/`,
          debug: env === "debug"
        },
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/copy",
        src: 'ext/**',
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/copy",
        src: '**/img/**',
        postDest: "img",
        flatten: true,
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/compile-watchify",
        src: "index.js",
        locals: Object.assign({}, locals, {ossPath: `'/admin/'`}),
        watch: true,
        minify: minify,
        dest: dest
      }
    ],
    "client": [
      {
        compiler: "gulp/compile-less",
        src: "index.less",
        locals: Object.assign({}, locals, {ossPath: `'${ossPath}'`}),
        watch: ["**/*.less"],    // 不光监控本身，也监控其他less文件
        dest: dest
      },
      {
        compiler: "gulp/compile-jade",
        src: 'index.jade',
        locals: {
          ossPath: `${ossPath}`,
          debug: env === "debug"
        },
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/copy",
        src: 'ext/**',
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/copy",
        src: '**/img/**',
        postDest: "img",
        flatten: true,
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/compile-watchify",
        src: "index.js",
        locals: Object.assign({}, locals, {ossPath: `'${ossPath}'`}),
        minify: minify,
        dest: dest,
        watch: true
      }
    ],
    "test": (env!=="debug")?undefined:[
      {
        compiler: "gulp/compile-less",
        src: "index.less",
        locals: Object.assign({}, locals, {ossPath: "'/'"}),
        watch: ["**/*.less"],    // 不光监控本身，也监控其他less文件
        dest: dest
      },
      {
        compiler: "gulp/compile-jade",
        src: 'index.jade',
        locals: {
          ossPath: "/test/",
          debug: env === "debug"
        },
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/copy",
        src: 'ext/**',
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/copy",
        src: '**/img/**',
        postDest: "img",
        flatten: true,
        watch: true,
        dest: dest
      },
      {
        compiler: "gulp/compile-watchify",
        src: "index.js",
        locals: Object.assign({}, locals, {ossPath: "'/test/'"}),
        minify: minify,
        dest: dest,
        watch: true
      }
    ]
  };

  return ret;
};
