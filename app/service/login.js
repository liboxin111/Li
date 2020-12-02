const { Service } = require('egg')
class LoginService extends Service {
    async dologin(username, password, codeA) {
        try {
            let codeB = this.ctx.session.codeB
            // console.log(codeA, codeB);
            if (codeA.toLowerCase() === codeB.toLowerCase()) {
                var result = await this.ctx.service.staff.findUser(username, password)
                if (result.flag) {
                    let { name, role_id, is_super } = result.data
                    console.log('login', name);
                    this.ctx.session.userinfo = { name, role_id, is_super }
                    return { flag: true, msg: '登陆成功' }
                } else {
                    return { flag: false, msg: '用户名不存在或用户名密码错误' }
                }
            } else {
                return { flag: false, msg: '验证码错误' }
            }
        } catch (error) {
            console.log(error);
            return { flag: false, msg: '数据异常' }
        }
    }
}
module.exports = LoginService;