
module.exports.users = function *() {
  this.auth.requireConnected();

  let userService = this.getModuleService('user');
  let users = yield userService.get({}, {'limit': 100, 'sort': [['created_at', 'desc']]});
  this.viewBag.set('users', users);
  this.viewBag.get('html').head.title.queue('Users management (js)');
  return yield this.renderView('dashboard/user.html');
};
