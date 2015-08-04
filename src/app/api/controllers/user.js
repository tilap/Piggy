import ModuleFactory from 'library/ModuleFactory';

let userService = ModuleFactory.getService('user');

// If service had viewOneByUsername(username='')

// With get
module.exports.viewByUsername = function *() {
  this.bag.setResponseUnique(); // Coz method viewOneByUsername

  let username = this.params.username || ''; // Coz arg and default value in service method
  let user = yield userService.getOneByUsername(username);

  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }

  this.bag.setVoRessource(user);
  this.renderBag();
};

module.exports.viewById = function *() {
  this.bag.setResponseUnique();

  let id = this.params.id || '';
  let user = yield userService.getOneById(id);

  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }

  this.bag.setVoRessource(user);
  this.renderBag();
};
