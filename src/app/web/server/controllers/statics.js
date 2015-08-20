module.exports.home = function *() {
  this.viewBag.get('html').head.title.queue('Accueil');

  let sourceService = yield this.getModuleService('source');
  let sources = yield sourceService.getByPage({}, 1, 10, 'created_at', 1);
  this.viewBag.set('sources', sources);
  return yield this.renderView('statics/home.html');
};

module.exports.about = function *() {
  this.viewBag.get('html').head.title.queue('A propos');
  return yield this.renderView('statics/about.html');
};
