import ValidationError from 'piggy-module/lib/ValidationError';
import FlashMessage from 'FlashMessage';


module.exports.new = function *() {
  this.utils.requireConnected();

  let userService = yield this.getModuleService('user');
  let itemData = {};
  let formErrors = {};
  if (this.request.method === 'POST') {
    try {
      itemData = this.utils.getFromPostM(['username', 'firstname', 'lastname', 'email']);
      let newUser = yield userService.insertOne(itemData, 'backoffice');
      this.flash = new FlashMessage(this.i18n.__('user.new.success.message', newUser.username), FlashMessage.TYPES.SUCCESS);
      return this.redirect('/user/');
    } catch(errors) {
      if (errors instanceof ValidationError) {
        formErrors = errors.validation;
      } else {
        this.logger.error('Error while inserting user', errors);
        this.throw(500, this.i18n.__('user.new.exception.message'));
      }
    }
  }

  this.viewBag.set('form', {
    'user': itemData,
    'errors': formErrors,
  });

  this.viewBag.get('html').head.title.queue('Users');
  return yield this.renderView('user/new.html');
};


module.exports.edit = function *() {
  this.utils.requireConnected();

  let userService = yield this.getModuleService('user');
  let id = this.params.id || '';
  let user = yield userService.getOneById(id);
  this.assert(user, 404, 'user.edit.notfound.message');
  let itemData = user.data;
  let formErrors = {};

  if (this.request.method === 'POST') {
    try {
      let newData = this.utils.getFromPostM(['username', 'firstname', 'lastname', 'email'], null, true);
      Object.keys(newData).forEach( property => {
        itemData[property] = newData[property];
      });

      let updatedUser = yield userService.updateOne(user.id, itemData);

      let msg = this.i18n.__('user.update.success.message', updatedUser.username);
      this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
      this.redirect(this.request.href);
    } catch(errors) {
      if (errors instanceof ValidationError) {
        formErrors = errors.validation;
      } else {
        this.logger.error('Error while inserting user', errors);
        this.throw(500, this.i18n.__('user.new.exception.message'));
      }
    }
  }

  this.viewBag.set('form', {
    'user': itemData,
    'errors': formErrors,
  });
  return yield this.renderView('user/edit.html');
};

module.exports.list = function *() {
  this.utils.requireConnected();

  let userService = yield this.getModuleService('user');
  try {
    let users = yield userService.getByPage({}, 1, 1000, 'username', 1);
    this.viewBag.set('users', users);
  } catch(err) {
    this.logger.error('Error while listing users', err);
    this.throw(500);
  }

  return yield this.renderView('user/list.html');
};

module.exports.viewById = function *() {
  let userService = yield this.getModuleService('user');

  let id = this.params.id || '';
  let user = yield userService.getOneById(id);
  this.assert(user, 404, 'user.view.notfound.message');
  this.viewBag.set('user', user);
  return yield this.renderView('user/view.html');
};

module.exports.viewByUsername = function *() {
  let userService = yield this.getModuleService('user');

  let username = this.params.username || '';
  let user = yield userService.getOneByUsername(username);
  this.assert(user, 404, 'user.view.notfound.message');
  this.viewBag.set('user', user);
  return yield this.renderView('user/view.html');
};

module.exports.deleteById = function *() {
  this.utils.requireConnected();
  let userService = yield this.getModuleService('user');
  let id = this.params.id || '';
  let user = yield userService.getOneById(id);
  this.assert(user, 404, 'user.delete.notfound.message');

  let deleted = yield userService.delete({'_id': id});
  let msg;
  if (deleted) {
    msg = this.i18n.__('user.deleted.success.message', user.username);
    this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
  } else {
    msg = this.i18n.__('user.deleted.error.message', user.username);
    this.flash = new FlashMessage(msg, FlashMessage.TYPES.ERROR);
  }
  return this.redirect('/user/');
};
