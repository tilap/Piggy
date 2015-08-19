module.exports.home = function *() {
  this.viewBag.get('html').head.title.queue('Accueil');
  // this.viewBag.get('html').head.addCss('http://toto.com/style.css');
  // this.viewBag.get('html').head.addJs('http://toto.com/script.js');
  // this.viewBag.get('html').head.addInlineScript('alert("ok");');

  this.viewBag.set('test', 'my value');
  return yield this.renderView('statics/home.html');
};

module.exports.about = function *() {
  this.viewBag.get('html').head.title.queue('A propos');
  return yield this.renderView('statics/about.html');
};
