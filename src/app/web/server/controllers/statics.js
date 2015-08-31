module.exports.home = function *() {
  this.viewBag.get('html').head.title.queue('Accueil');

  let userService = this.getModuleService('user');
  let users = userService.get();
  this.viewBag.set('users', users);
  return yield this.renderView('statics/home.html');
};

module.exports.about = function *() {
  this.viewBag.get('html').head.title.queue('A propos');
  return yield this.renderView('statics/about.html');
};
