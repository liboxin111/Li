var config = {};

config.keys = "123456";

// 配置模板引擎
config.view = {
  defaultViewEngine: "nunjucks",
  map: {
    ".html": "nunjucks"
  }
};

// 配置安全相关
config.security = {
  csrf: {
    enable: true, // 默认开启
    queryName: "_csrf", // 通过 query 传递 CSRF token 的默认字段为 _csrf
    bodyName: "_csrf" // 通过 body 传递 CSRF token 的默认字段为 _csrf
  }
};

// 配置 数据库
config.mongoose = {
  client: {
    url: "mongodb://127.0.0.1:27017/Staff",
    options: { useUnifiedTopology: true }
  }
};

// 配置session
config.session = {
  key: "EGG_SESS",
  maxAge: 24 * 3600 * 1000, //day
  httpOnly: true, //js 无法访问
  encrypt: true // 加密
};

// 配置中间件
config.middleware = ["adminAuth"], //数组顺序即为中间件的加载顺序
  // 中间件的配置
config.adminAuth = {
    enable: true //控制中间件是否开启
},
module.exports = config;
