const { Service } = require('egg')
const md5 = require('md5')
const svgCaptcha = require('svg-captcha')
class ToolService extends Service {
    md5(content) {
        return md5(content)
    }
    getCaptcha() {
        let resultCap = svgCaptcha.create()
        let text = resultCap.text
        this.ctx.session.codeB=text
        return resultCap.data
    }
}

module.exports = ToolService;