
module.exports.users = function *() {
  this.utils.requireConnected();

  this.viewBag.get('html').head.title.queue('Users management (js)');
  return yield this.renderView('dashboard/user.html');
};
