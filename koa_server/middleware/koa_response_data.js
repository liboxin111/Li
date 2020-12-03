//处理业务逻辑  读取json文件的数据
const path=require('path')
const fileUtils=require('../utils/file_utils')
module.exports=async(ctx,next)=>{
    const url=ctx.request.url
    console.log(url);
    let filePath=url.replace('/api','')
    filePath='../data'+filePath+'.json'
    filePath= path.join(__dirname,filePath)
    try {
        const ret=await fileUtils.getFileJsonData(filePath)
        ctx.body=ret
    } catch (error) {
         const errorMsg={
             message:"读取文件失败,您所访问的文件不存在",
             status:404
         }
         ctx.body=JSON.stringify(errorMsg)
    }
    await next()
}