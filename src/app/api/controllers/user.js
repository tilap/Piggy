import ManagerError from 'piggy-module/lib/Errors';
import ModuleFactory from 'library/ModuleFactory';

import ApiBag from 'ApiBag';
import ApiBagRessource from 'ApiBagRessource';

let userService = ModuleFactory.getService('user');

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
