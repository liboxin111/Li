//计算服务器消耗时长
module.exports=async(ctx,next)=>{
    //记录开始的时间
    const start=Date.now()
    //让内层中间件得到执行
    await next()
    //记录结束时间
    const end=Date.now()
    //设置响应头
    const duration=end-start
    ctx.set('X-Respone-Time', duration+'ms')
}