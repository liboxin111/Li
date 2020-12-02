module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const RoleSchema = new Schema({
    role_name: { type: String, required: true }, // 角色标题
    role_desc: { type: String, default:'' }, //角色描述
    role_status: { type: Number, default:1 }, //1 有效 0 无效
    time_create: { type: Number, default: Date.now() }, //创建时间
  });
  return mongoose.model("Role", RoleSchema, "roles");
};
