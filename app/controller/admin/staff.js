// app/controller/home.js
// const Controller = require('egg').Controller;
const BaseController = require('./base')

class StaffController extends BaseController {
    async add() {
        var result = await this.ctx.service.role.list()
        if (result.flag) {
            let roles = result.data
            await this.ctx.render('admin/staff/add', { roles })
        } else {

        }
    }
    async list() {
        const { ctx } = this
        let result = await ctx.service.staff.findAll()
        if (result.flag) {
            let staffs = result.data
            await this.ctx.render('admin/staff/list', { staffs })
        } else {
            await this.fail(result.msg, '/admin/staff/list')
        }
    }
    async doAdd() {
        const { ctx } = this
        var { username, password, name, no, phone, role_id } = ctx.request.body
        let addBody = {
            username,
            password: ctx.service.tool.md5(password),
            name,
            no,
            phone,
            role_id
        }
        let result = await ctx.service.staff.add(addBody)
        if (result.flag) {
            await this.success(result.msg, '/admin/staff/list')
        } else {
            await this.fail(result.msg, '/admin/staff/add')
        }
    }
    async edit() {
        const { ctx } = this
        let id = ctx.request.query.id
        let staffResult = await ctx.service.staff.findById(id)
        let roleResult = await ctx.service.role.list()
        console.log("staffResult-----", staffResult);
        console.log("roleResult-----", roleResult);
        if (staffResult.flag && roleResult.flag) {
            let staff = staffResult.data
            let roles = roleResult.data
            await ctx.render('admin/staff/edit', { staff, roles })
        } else {
            if (staffResult.flag) {
                await this.fail(staffResult.msg, '/admin/staff/list')
            } else {
                await this.fail(roleResult.msg, '/admin/staff/list')

            }
        }
    }
    async doEdit() {
        const { ctx } = this
        var { staff_id, username, password, name, no, phone, status, role_id } = ctx.request.body
        //password  没加密  没有值  覆盖数据库了
        //csrf  也不需要    
        var staff = {}
        if (password) {
            staff = {
                username,
                password: ctx.service.tool.md5(password),
                name,
                no,
                phone,
                status,
                role_id
            }
        } else {
            staff = {
                username,
                name,
                no,
                phone,
                status,
                role_id
            }
        }
        let result = await ctx.service.staff.update(staff_id, staff)
        if (result.flag) {
            await this.success(result.msg, '/admin/staff/list')
        } else {
            await this.fail(result.msg, '/admin/staff/edit?id='+staff_id)
        }
    }
    async delete() {
        const { ctx } = this
        let id = ctx.request.query.id
        let result = await ctx.service.staff.delete(id)
        if (result.flag) {
            await this.success(result.msg, '/admin/staff/list')
        } else {
            await this.fail(result.msg, '/admin/staf/list')
        }

    }
}

module.exports = StaffController;