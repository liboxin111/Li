const { Service } = require('egg')
class AccesssService extends Service {
    //获取所有顶级模块
    async modules() {
        try {
            var accessModules = await this.ctx.model.Access.find({ access_module_id: "0" })
            // console.log("accessModules----",accessModules);
            if (accessModules) {
                return { flag: true, data: accessModules }
            } else {
                return { flag: false, msg: '查询失败' }
            }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '数据异常' }

        }
    }
    //添加权限
    async add(body) {
        try {
            var model = new this.ctx.model.Access(body)
            let resultSave = await model.save()
            // var resultCreate = await this.ctx.model.Role.create(body)
            // console.log(resultCreate);
            if (resultSave) {
                return { flag: true, msg: '添加权限成功' }
            } else {
                return { flag: false, msg: '添加权限失败' }
            }
        } catch (error) {
            // console.log(error);
            return { flag: false, msg: '数据库异常' }
        }
    }
    async list() {
        //access_module_id:"0" 以及模块所关联的菜单和操作
        var access = await this.ctx.model.Access.aggregate([
            {
                $match: {
                    access_module_id: "0"
                }
            },
            {
                $lookup: {
                    from: 'access',
                    localField: '_id',
                    foreignField: "access_module_id",
                    as: 'subAccess'

                }
            },
            {
                $sort: {
                    data_sort: 1
                }
            }
        ])
        console.dir(access);
        if (access) {
            return { flag: true, data: access, }
        }
        else {
            return { flag: false, msg: '请求失败' }
        }
    }
    async findById(id) {
        try {
            var access = await this.ctx.model.Access.findById(id)
            if (access) {
                return { flag: true, data: access, }
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
            let updateResult = await this.ctx.model.Access.updateOne({ _id: id }, body)
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
            let deleteResult = await this.ctx.model.Access.deleteOne({ _id: id })
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
    async findAllOpen() {
        var access = await this.ctx.model.Access.aggregate([
            {
                $match: {
                    access_module_id: "0",
                    data_status: 1
                }
            },
            {
                $lookup: {
                    from: 'access',
                    localField: '_id',
                    foreignField: "access_module_id",
                    as: 'subAccess'

                }
            },
            {
                $project: {
                    '_id': 1,
                    'access_module': 1,
                    'access_action': 1,
                    'access_type': 1,
                    subAccess: {
                        $filter: {
                            input: '$subAccess',
                            as: 'item',
                            cond: {
                                $eq: ["$$item.data_status", 1]
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    data_sort: 1
                }
            }
        ])
        // console.dir(access);
        if (access) {
            return { flag: true, data: access, msg: '查询成功' }
        }
        else {
            return { flag: false, msg: '请求失败' }
        }
    }

    async findAccessByRoleId(role_id) {
        try {
            var roleAccessArray = await this.ctx.model.RoleAccess.find({ role_id: role_id })
            if (roleAccessArray) {
                return { flag: true, data: roleAccessArray, msg: '依据角色id查询权限成功' }
            } else {
                return { flag: false, msg: '依据角色id查询权限失败' }
            }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '依据角色id查询权限失败' }
        }

    }
    //根据角色ID 查询所有权限，带有授权选中
    async findAllWithChecked(role_id) {
        // 获取所有权限 （已关闭权限 除外）
        // 获取授权选中 权限id []  依据角色role_id 查询role_access
        // 所有权限 添加选中标记 checked = true
        var result1 = await this.findAllOpen()
        var result2 = await this.findAccessByRoleId(role_id)
        if (result1.flag && result2.flag) {
            var accessAll = result1.data //获取所有权限
            // console.log(accessAll);
            // console.log(accessAll);
            var roleAccessArray = result2.data  //获取授权选中[{role_id,access_id}]
            var accessChecked = [] // 选中权限[id]
            roleAccessArray.forEach((item) => {
                accessChecked.push(item.access_id.toString())
            })
            for (const access of accessAll) {
                // 模块权限
                if (accessChecked.indexOf(access._id.toString()) !== -1) {
                    access.checked = true
                }
                // 操作或菜单权限
                for (const subaccess of access.subAccess) {
                    if (accessChecked.indexOf(subaccess._id.toString()) !== -1) {
                        subaccess.checked = true
                    }
                }
            }
            return { flag: true, msg: '查询授权数据成功', data: accessAll }
        } else {
            return { flag: false, msg: '查询授权数据失败' }
        }
    }
    //根据url path路径查找 权限id
    async findAccessByUrl(path) {
        try {
            var access = await this.ctx.model.Access.findOne({ access_url: path })
            if (access) {
                return { flag: true, data: access, msg: '依据url查询权限成功' }
            } else {
                return { flag: false, msg: '依据url查询权限失败' }
            }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '依据url查询权限失败' }
        }
    }
}
module.exports = AccesssService;