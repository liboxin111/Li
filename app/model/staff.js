module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const StaffSchema = new Schema({
    role_id:{type:mongoose.ObjectId,required: true}, //角色id
    username: { type: String, required: true }, // 登录账号
    password: { type: String, required: true }, //登录密码
    name: { type: String, required: true }, // 员工名称
    no: { type: String, default: "" }, //员工编号
    phone: { type: String, default: "" }, //员工电话
    status: { type: Number, default: 1 }, // 1 正常 0 ：异常
    time_create: { type: String, default: "" }, //创建时间
    time_last: { type: String, default: "" }, //最后登录时间
    ip_last: { type: String, default: "" }, //最后登录ip
    is_super:{type: Number, default: 0} //1 超级管理员 0 不是
  });
  return mongoose.model("Staff", StaffSchema, "staffs");
};
