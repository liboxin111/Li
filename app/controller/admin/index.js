// app/controller/home.js
// const Controller = require('egg').Controller;
const BaseController = require('./base')

class AdminController extends BaseController {
  async index() {
    // this.ctx.body = 'admin page';
    // let {name}=this.ctx.session.userinfo
    //Cannot destructure property 'name' of 'this.ctx.session.userinfo' as it is undefined.
    // let userinfo = this.ctx.session.userinfo
    // if (userinfo) {
    //   let name = userinfo.name
    //   await this.ctx.render('admin/index', { name })
    // } else {
    //   //登陆了session失效 ,未登录
    //   this.ctx.redirect('/admin/login')
    // }
    let { name } = this.ctx.session.userinfo
    await this.ctx.render('admin/index', { name })
  }
  async welcome(){
    await this.ctx.render('admin/welcome',)
  }
}

module.exports = AdminController;