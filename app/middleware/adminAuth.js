const isJSON = require('koa-is-json');
const zlib = require('zlib');

const middlewareAuth = options => {
  return async (ctx, next) => {
    //判断是否登陆 session
    var userinfo = ctx.session.userinfo
    var pathname = ctx.request.path
    ctx.locals.userinfo = userinfo
    if (userinfo && pathname === '/admin/login') {
      ctx.redirect('/admin')
    }
    if (userinfo) {
      let role_id = userinfo.role_id
      var result = await ctx.service.staff.checkUrlAccess(role_id, pathname)
      if (result.flag) {
        var result1 = await ctx.service.access.findAllWithChecked(role_id)
        if (result1.flag) {
          ctx.locals.staffAccss = result1.data
          console.log(result1.data);
        } else {
          ctx.body = result1.msg
        }
        await next()
      }
      else {
        ctx.body = result.msg
      }

    }
    else {
      //先走中间件 再走路由  
      //防止死循环
      if (pathname === '/admin/login' || pathname === '/admin/verify' || pathname === '/admin/dologin') {
        await next()
      } else {
        ctx.redirect('/admin/login')
      }
    }
  };
};
module.exports = middlewareAuth