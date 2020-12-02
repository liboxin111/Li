// app/controller/home.js
// const Controller = require('egg').Controller;
const BaseController = require('./base')

class RoleController extends BaseController {
    async add() {
        await this.ctx.render('admin/role/add')
    }
    async list() {
        const { ctx } = this
        let result = await ctx.service.role.list()
        if (result.flag) {
            let roles = result.data
            await ctx.render('admin/role/list', { roles })
            // ctx.body=roles
        } else {
            await this.fail(result.msg, '/admin/role/add')
        }
    }
    async doAdd() {
        const { ctx } = this;
        let body = ctx.request.body;
        let result = await ctx.service.role.add(body)
        if (result.flag) {
            await this.success(result.msg, '/admin/role/list')
        } else {
            await this.fail(result.msg, '/admin/role/add')
        }
    }
    async edit() {
        const { ctx } = this
        let id = ctx.request.query.id
        // console.log(id);
        let result = await ctx.service.role.findById(id)
        if (result.flag) {
            let role = result.data
            await ctx.render('admin/role/edit', { role })
        } else {

        }
    }
    async doEdit() {
        const { ctx } = this
        let body = ctx.request.body
        let role_id = body.role_id
        let role_status = body.role_status == 'on' ? 1 : 0
        // body.role_status = role_status
        let updateBody = {
            role_name: body.role_name,
            role_desc: body.role_desc,
            role_status: role_status
        }
        let result = await ctx.service.role.update(role_id, updateBody)
        if (result.flag) {
            await this.success(result.msg, '/admin/role/list')
        } else {
            await this.fail(result.msg, '/admin/role/list')
        }
    }
    async delete() {
        const { ctx } = this
        let id = ctx.request.query.id
        let result = await ctx.service.role.delete(id)
        if (result.flag) {
            await this.success(result.msg, '/admin/role/list')
        } else {
            await this.fail(result.msg, '/admin/role/list')
        }

    }
    async auth() {
        const { ctx } = this
        let role_id = ctx.request.query.id
        // var result = await ctx.service.access.findAllOpen()
        var result = await ctx.service.access.findAllWithChecked(role_id)
        if (result.flag) {
            var accessList = result.data
            await ctx.render('admin/role/auth', { role_id, accessList })
        } else {
            ctx.body = result.msg
        }
    }
    async doAuth() {
        const { ctx } = this
        let { role_id, access_checked } = ctx.request.body
        var role_access_array = []
        if (access_checked) {
            access_checked.forEach(access_id => {
                var role_access = {
                    role_id,
                    access_id
                }
                role_access_array.push(role_access)
            })
        }
        var result = await ctx.service.role.insertManyRoleAccess(role_id, role_access_array)
        if (result.flag) {
            await this.success(result.msg, '/admin/role/list')
        } else {
            await this.fail(result.msg, '/admin/role/auth')
        }
    }


}

module.exports = RoleController;