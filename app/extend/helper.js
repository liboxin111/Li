var dateFormat=require('dateformat')
module.exports={
    formaDate(time){
        return dateFormat(new Date(time),'yyyy-mm-dd HH-MM-ss')
    }
}