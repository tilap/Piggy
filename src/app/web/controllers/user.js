import ManagerError from 'piggy-module/lib/Errors';
import FlashMessage from 'FlashMessage';
import ModuleFactory from 'library/ModuleFactory';

let userService = ModuleFactory.getService('user');

module.exports.new = function *() {

  this.utils.requireConnected();

  let itemData = {};
  let formErrors = {};

  if(this.request.method==='POST') {
    try {
      itemData = this.utils.getFromPost(['username', 'firstname', 'lastname', 'email']);
      let newUser = yield userService.createFromData(itemData, 'backoffice');

      this.flash = new FlashMessage(this.i18n.__('user.new.success.message', newUser.username), FlashMessage.TYPES.SUCCESS);
      return this.redirect(this.request.href);
    }
    catch(errors) {
      if(errors instanceof ManagerError) {
        this.logger.error('Error while inserting user', errors);
        this.throw(500, this.i18n.__('user.new.exception.message'));
      }
      formErrors = errors;
    }
  }

  this.viewBag.set('form', {
    user: itemData,
    errors: formErrors
  });

  this.viewBag.get('html').head.title.queue('Users');
  return yield this.renderView('user/new.html');
};


module.exports.edit = function *() {

  this.utils.requireConnected();

  let id = this.params.id || '';
  let user = yield userService.getById(id);
  if(!user) {
    this.throw(404, this.i18n.__('user.edit.notfound.message'));
  }

  let itemData = user.data;
  let formErrors = {};

  if(this.request.method==='POST') {
    try {
      itemData = this.utils.getFromPost(['firstname', 'lastname', 'email']);
      let updatedUser = yield userService.updateFromData(itemData, user.id);

      let msg = this.i18n.__('user.update.success.message', updatedUser.username);
      this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
      this.redirect(this.request.href);
    }
    catch(errors) {
      formErrors = errors;
    }
  }

  this.viewBag.set('form', {
    user: itemData,
    errors: formErrors
  });
  return yield this.renderView('user/edit.html');
};

module.exports.list = function *() {

  this.utils.requireConnected();

  try {
    let users = yield userService.getByPage();
    this.viewBag.set('users', users);
  } catch(err) {
    this.logger.error('Error while listing users', err);
    this.throw(500);
  }

  return yield this.renderView('user/list.html');
};

module.exports.viewById = function *() {

  let id = this.params.id || '';
  let user = yield userService.getById(id);
  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }
  this.viewBag.set('user', user);

  return yield this.renderView('user/view.html');
};

module.exports.viewByUsername = function *() {
  let username = this.params.username || '';
  let user = yield userService.getByUsername(username);
  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }
  this.viewBag.set('user', user);
  return yield this.renderView('user/view.html');
};

module.exports.deleteById = function *() {

  this.utils.requireConnected();

  try {
    let id = this.params.id || '';
    let user = yield userService.getById(id);
    if(!user) {
      this.throw(404, this.i18n.__('user.view.notfound.message'));
    }

    yield userService.deleteById(id);
    let msg = this.i18n.__('user.deleted.success.message', user.username);
    this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
    return this.redirect('/user/');
  }
  catch(err) {
    this.logger.error(err);
    return this.throw(500, err.message);
  }
};
