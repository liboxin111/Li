// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // this.ctx.body = 'index page';
    await this.ctx.render('index/index')
  }
}

module.exports = HomeController;