const { Service } = require('egg')
class StaffService extends Service {
    async add(body) {
        try {
            let username = body.username
            let resultFind = await this.find(username)
            if (resultFind.flag) {
                return { flag: false, msg: '用户名已存在' }
            } else {
                var resultCreate = await this.ctx.model.Staff.create(body)
                // console.log(resultCreate);
                if (resultCreate) {
                    return { flag: true, msg: '添加成功' }
                } else {
                    return { flag: false, msg: '添加失败' }
                }
            }
        } catch (error) {
            // console.log(error);
            return { flag: false, msg: '数据库异常' }
        }
    }
    async find(username) {
        var staff = await this.ctx.model.Staff.findOne({ username })
        // console.log(staff+'---------------');
        if (staff) {
            return { flag: true, msg: '查询成功' }
        } else {
            return { flag: false, msg: '查询失败' }
        }
    }
    async findUser(username, password) {
        var staff = await this.ctx.model.Staff.findOne({ username, password })
        // console.log(staff+'---------------');
        if (staff) {
            return { flag: true, data: staff, msg: '查询成功' }
        } else {
            return { flag: false, msg: '查询失败' }
        }
    }
    async findById(id) {
        try {
            var staff = await this.ctx.model.Staff.findById(id)
            if (staff) {
                return { flag: true, data: staff, }
            }
            else {
                return { flag: false, msg: '请求失败' }
            }
        } catch (error) {
            return { flag: false, msg: '数据异常' }
        }
    }
    //关联用户对应的角色
    async findAll() {
        var staffs = await this.ctx.model.Staff.aggregate([
            {
                $match: { "status": 1 }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role_id',
                    foreignField: '_id',
                    as: 'role'
                }
            },
        ])
        console.log(staffs);
        if (staffs) {
            return { flag: true, data: staffs, msg: '查询成功' }
        } else {
            return { flag: false, msg: '查询失败' }

        }
    }
    async update(staff_id, body) {
        try {
            //判断username 是否重复
            //根据id更新
            let staffResult = await this.ctx.model.Staff.findById(staff_id)
            //修改了
            if (staffResult.username !== body.username) {
                //将修改后的username与别的账号对比是否冲突
                let result = await this.find(body.username)
                if (result.flag) {
                    return { flag: false, msg: '账号名重复' }
                }
            }
            //没有改且username不重复
            let updateResult = await this.ctx.model.Staff.updateOne({ _id: staff_id }, body)
            console.log("updateResult---", updateResult);
            if (updateResult.nModified > 0 && updateResult.n > 0) {
                return { flag: true, msg: '修改成功' }
            }
            else if (updateResult.nModified == 0 && updateResult.n > 0) {
                return { flag: false, msg: '请确认修改信息' }
            } else {
                return { flag: false, msg: '修改失败' }

            }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '数据异常' }
        }

    }
    //  软删除
    async delete(id) {
        try {
            let deleteResult = await this.ctx.model.Staff.updateOne({ _id: id },{status:0})
            console.log(deleteResult);
            //匹配数目  更新数目  是否成功
            // { n: 1, ok: 1, deletedCount: 1 }
            if (deleteResult.nModified > 0 ) {
                return { flag: true, msg: '删除成功' }
            }
            else {
                return { flag: false, msg: '删除失败' }
            }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '数据异常' }
        }
    }
    
  async checkUrlAccess(role_id,path){
    //userinfo->staff ->role_id  ->角色拥有的权限 [access_id]
     ///访问地址admin/access -> url->path->权限资源access_url ->access_id
     //access_id 在[access_id] 里面则通过；否则提示 没有权

     const {ctx} = this

     var ignorePath = ['/admin','/admin/logout','/admin/login','/admin/dologin','/admin/verify','/admin/welcome']

     if(ignorePath.indexOf(path)!==-1 || ctx.session.userinfo.is_super==1){
         return {flag:true,msg:'拥有访问权限'}
     }

     var result1 = await ctx.service.access.findAccessByRoleId(role_id)
     var result2 = await ctx.service.access.findAccessByUrl(path)
     // console.dir(result2);
     
     if(result1.flag&&result2.flag){
         var accessArray = result1.data // 角色对应 权限[{role_id:a,access_id:b}]
         var access_id = result2.data._id  // url 对应的权限
         console.log('access_id:----'+access_id);
         
         var access_id_Array = []
         accessArray.forEach((item)=>{
             access_id_Array.push(item.access_id.toString())
         })
         // console.log('access_id_Array:----'+access_id_Array);

         if(access_id_Array.indexOf(access_id.toString())!==-1){
             return {flag:true,msg:'拥有访问权限'}
         }else{
             return {flag:false,msg:'没有访问权限'}
         }
       }else{
           return {flag:false,msg:'访问权限验证失败'}
       }

}
}
module.exports = StaffService;