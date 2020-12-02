const { Service } = require('egg')
class RoleService extends Service {
    //添加角色
    async add(body) {
        try {
            var model = new this.ctx.model.Role(body)
            let resultSave = await model.save()
            // var resultCreate = await this.ctx.model.Role.create(body)
            // console.log(resultCreate);
            if (resultSave) {
                return { flag: true, msg: '添加成功' }
            } else {
                return { flag: false, msg: '添加失败' }
            }
        } catch (error) {
            // console.log(error);
            return { flag: false, msg: '数据库异常' }
        }
    }
    async list() {
        try {
            var roles = await this.ctx.model.Role.find({})
            if (roles) {
                return { flag: true, data: roles, }
            }
            else {
                return { flag: false, msg: '请求失败' }
            }
        } catch (error) {
            return { flag: false, msg: '数据异常' }
        }
    }
    async findById(id) {
        try {
            var role = await this.ctx.model.Role.findById(id)
            if (role) {
                return { flag: true, data: role, }
            }
            else {
                return { flag: false, msg: '请求失败' }
            }
        } catch (error) {
            return { flag: false, msg: '数据异常' }
        }
    }
    async update(id, body) {
        try {
            let updateResult = await this.ctx.model.Role.updateOne({ _id: id }, body)
            console.log(updateResult);
            //匹配数目  更新数目  是否成功
            // { n: 1, nModified: 1, ok: 1 }
            if (updateResult.nModified > 0) {
                return { flag: true, msg: '修改成功' }
            }
            else {
                return { flag: false, msg: '修改失败' }
            }
        } catch (error) {
            return { flag: false, msg: '数据异常' }
        }
    }
    async delete(id) {
        try {
            let deleteResult = await this.ctx.model.Role.deleteOne({ _id: id })
            console.log(deleteResult);
            //匹配数目  更新数目  是否成功
            // { n: 1, ok: 1, deletedCount: 1 }
            if (deleteResult.deletedCount > 0) {
                return { flag: true, msg: '删除成功' }
            }
            else {
                return { flag: false, msg: '删除失败' }
            }
        } catch (error) {
            return { flag: false, msg: '数据异常' }
        }
    }
    // 存储 角色和权限 
    async insertManyRoleAccess(role_id, role_access_array) {
        try {
            var res1 = await this.ctx.model.RoleAccess.deleteMany({ role_id: role_id })
            var res = await this.ctx.model.RoleAccess.insertMany(role_access_array)
            console.log('res===' + res);
            return { flag: true, msg: '角色授权成功' }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '数据异常，角色授权失败' }
        }
    }
}
module.exports = RoleService;