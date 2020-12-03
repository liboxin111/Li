const Koa = require('koa')
const app = new Koa()
const webSocectService=require('./service/web_scokect_service')
const resDurationMiddleware = require('./middleware/koa_response_duration')
app.use(resDurationMiddleware)
const resHeaderMiddleware = require('./middleware/koa_response_header')
app.use(resHeaderMiddleware)
const resDataMiddleware = require('./middleware/koa_response_data')
app.use(resDataMiddleware)
//开启服务端的监听，监听客户端的连接
//当客户端连接成功后，就会对客户端进行message事件的监听
webSocectService.listen()
app.listen(8888)