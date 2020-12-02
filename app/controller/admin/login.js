// const Controller = require('egg').Controller;
const BaseController = require('./base')
class LoginController extends BaseController {
    //显示登陆页面
    async login() {
        // this.ctx.body = 'admin page';
        await this.ctx.render('admin/login')
    }
    //登陆操作
    async doLogin() {
        const { ctx } = this
        let body = ctx.request.body
        let username = body.username
        let password = ctx.service.tool.md5(body.password)
        let codeA = body.code
        // console.log(username, password,codeA);
        //username password  验证码
        //验证  codeA=code  codeB=text
        //单项密码加密 md5
        //登陆操作
        //根据 username 加密的password去查询数据库
        let result = await ctx.service.login.dologin(username, password, codeA)
        if (result.flag) {
            // ctx.body = result.msg
            // ctx.redirect('/admin')
            await this.success('登陆成功', '/admin')
        } else {
            // ctx.body = result.msg
            await this.fail('登陆失败', '/admin/login')
        }
    }

    async verify() {
        let result = this.ctx.service.tool.getCaptcha()
        this.ctx.response.type = 'image/svg+xml'
        this.ctx.body = result
    }
    //退出登陆 清楚session
    async logout() {
        this.ctx.session.userinfo = null
        this.ctx.redirect('/admin/login')
    }
}

module.exports = LoginController;