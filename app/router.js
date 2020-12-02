module.exports = app => {
  const { router, controller } = app;
  //前台路由
  router.get('/', controller.index.index.index);
  //后台路由
  router.get('/admin', controller.admin.index.index);
  router.get('/admin/welcome', controller.admin.index.welcome);
  router.get('/admin/login', controller.admin.login.login);
  router.get('/admin/logout', controller.admin.login.logout);
  router.post('/admin/dologin', controller.admin.login.doLogin);
  router.get('/admin/verify', controller.admin.login.verify);
  //staff
  router.get('/admin/staff/add', controller.admin.staff.add);
  router.post('/admin/staff/doAdd', controller.admin.staff.doAdd);
  router.get('/admin/staff/list', controller.admin.staff.list);
  router.get('/admin/staff/edit', controller.admin.staff.edit);
  router.post('/admin/staff/doEdit', controller.admin.staff.doEdit);
  router.get('/admin/staff/delete', controller.admin.staff.delete);
  //role
  router.get('/admin/role/add', controller.admin.role.add);
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.get('/admin/role/list', controller.admin.role.list);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);
  router.get('/admin/role/delete', controller.admin.role.delete);
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/doAuth', controller.admin.role.doAuth);
  //access
  router.get('/admin/access/add', controller.admin.access.add);
  router.post('/admin/access/doAdd', controller.admin.access.doAdd);
  router.get('/admin/access/list', controller.admin.access.list);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/doEdit', controller.admin.access.doEdit);
  router.get('/admin/access/delete', controller.admin.access.delete);
};