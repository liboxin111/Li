module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AccessSchema = new Schema({
    access_type: { type: String, required: true },//模块类型 1模块 2菜单 3操作
    access_module: { type: String, default: '' }, //模块名称
    access_action: { type: String, default: '' }, //权限操作
    access_url: { type: String, default: '' }, //权限资源
    access_desc: { type: String, default: '' }, //权限描述
    access_module_id: { type: mongoose.Mixed }, //'0' : 顶级模块   , ObjectId: 所关联的模块id 
    data_sort: { type: Number, default: 100 }, //数据排序
    data_status: { type: Number, default: 1 },  //数据状态 1 正常 0 删除
    time_create: { type: String, default: '' }, //创建时间
  })

  return mongoose.model('Access', AccessSchema, 'access')
};
