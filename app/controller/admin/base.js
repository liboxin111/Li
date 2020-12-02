// app/controller/home.js
const Controller = require('egg').Controller;

class BaseController extends Controller {
    async success(msg, url) {
        var msg = msg || '操作成功'
        await this.ctx.render('admin/common/success', { msg, url })
    }
    async fail(msg, url) {
        var msg = msg || '操作失败'
        await this.ctx.render('admin/common/fail', { msg, url })
    }
}


module.exports = BaseController;