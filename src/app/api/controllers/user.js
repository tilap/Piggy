import ManagerError from 'piggy-module/lib/Errors';
import ModuleFactory from 'library/ModuleFactory';

import ApiBag from 'ApiBag';
import ApiBagRessource from 'ApiBagRessource';

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
  let user = yield userService.getById(id);

  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }

  this.bag.setVoRessource(user);
  this.renderBag();
};
