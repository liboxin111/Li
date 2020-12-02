// app/controller/home.js
// const Controller = require('egg').Controller;
const BaseController = require('./base')

class AccessController extends BaseController {
    async add() {
        const { ctx } = this;
        //获取所有模块
        var result = await ctx.service.access.modules()
        if (result.flag) {
            let modules = result.data
            console.log(modules);
            await this.ctx.render('admin/access/add', { modules })
        } else {
            ctx.body = result.msg
        }
    }
    async list() {
        const { ctx } = this;
        //获取所有模块
        var result = await ctx.service.access.list()
        if (result.flag) {
            let accessAll = result.data
            console.log(accessAll);
            await this.ctx.render('admin/access/list', { accessAll })
        } else {
            ctx.body = result.msg
        }
    }
    async doAdd() {
        const { ctx } = this;
        var { access_type, access_module, access_action, access_url, access_module_id, data_sort, access_desc } = ctx.request.body;
        if (access_module_id !== "0") {
            access_module_id = this.app.mongoose.Types.ObjectId(access_module_id)
        }
        let addBody = {
            access_type,
            access_module,
            access_action,
            access_url,
            access_module_id,
            data_sort,
            access_desc
        }
        let result = await ctx.service.access.add(addBody)
        if (result.flag) {
            await this.success(result.msg, '/admin/access/list')
        } else {
            ctx.body = result.msg
        }
    }
    async edit() {
        const { ctx } = this
        let _id = ctx.request.query.id
        let result1 = await ctx.service.access.findById(_id)
        let result2 = await ctx.service.access.modules()
        if (result1.flag && result2.flag) {
            let access = result1.data
            let modules = result2.data
            await ctx.render('admin/access/edit', { access, modules })
        } else {
            if (result1.flag) {
                await this.fail(result1.msg, '/admin/access/list')
            } else {
                await this.fail(result2.msg, '/admin/access/list')
            }
        }
    }
    async doEdit() {
        const { ctx } = this
        var { _id, access_type, access_module,access_action, access_url, data_status,access_module_id, data_sort, access_desc, } = ctx.request.body
        if (access_module_id !== "0") {
            access_module_id = this.app.mongoose.Types.ObjectId(access_module_id)
        }
        let editBody = {
            access_type,
            access_module,
            access_action,
            access_url,
            access_module_id,
            data_sort,
            data_status,
            access_desc,
        }
        let result = await ctx.service.access.update(_id, editBody)
        if (result.flag) {
            await this.success(result.msg, '/admin/access/list')
        } else {
            await this.fail(result.msg, '/admin/access/edit?id=' + _id)
        }
    }
    async delete() {
        const { ctx } = this
        let id = ctx.request.query.id
        let result = await ctx.service.access.delete(id)
        if (result.flag) {
            await this.success(result.msg, '/admin/access/list')
        } else {
            await this.fail(result.msg, '/admin/access/list')
        }

    }
}

module.exports = AccessController;