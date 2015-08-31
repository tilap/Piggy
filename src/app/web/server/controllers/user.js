import ValidationError from 'piggy-module/lib/ValidationError';
import FlashMessage from 'FlashMessage';

let itemServiceName = 'user';
let insertField = ['username', 'firstname', 'lastname', 'email'];
let updateFields = ['firstname', 'lastname', 'email'];
let defaultGetOptions = {'limit': 100, 'sort': [['created_at', 'desc']]};

module.exports.new = function *() {
  // Restricted to admin
  this.auth.requireProfile('admin');

  let itemService = this.getModuleService(itemServiceName);
  let itemData = {};
  let formErrors = {};
  if (this.request.method === 'POST') {
    try {
      itemData = this.utils.getFromPostM(insertField);
      let newUser = yield itemService.insertOne(itemData);
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
  let id = this.params.id || '';

  // Restricted to admin and self user
  this.auth.requireConnected();
  this.assert(this.auth.hasProfile('admin') || this.auth.getUser().id === id, 403);

  let itemService = this.getModuleService(itemServiceName);
  let item = yield itemService.getOneById(id);
  this.assert(item, 404, 'user.edit.notfound.message');
  let itemData = item.data;
  let formErrors = {};

  if (this.request.method === 'POST') {
    try {
      let newData = this.utils.getFromPostM(updateFields, null, true);
      Object.keys(newData).forEach( property => {
        itemData[property] = newData[property];
      });

      let updatedItem = yield itemService.updateOne(item.id, itemData);

      let msg = this.i18n.__('user.update.success.message', updatedItem.username);
      this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
      this.redirect(this.request.href);
    } catch(errors) {
      if (errors instanceof ValidationError) {
        formErrors = errors.validation;
      } else {
        this.logger.error('Error while inserting item', errors);
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
  // Restricted to admin
  this.auth.requireProfile('admin');

  let itemService = this.getModuleService(itemServiceName);
  try {
    let items = yield itemService.get({}, defaultGetOptions);
    this.viewBag.set('users', items);
  } catch(err) {
    this.logger.error('Error while listing users', err);
    this.throw(500);
  }

  return yield this.renderView('user/list.html');
};

module.exports.viewById = function *() {
  let id = this.params.id || '';

  // Restricted to admin and self user
  this.auth.requireConnected();
  this.assert(this.auth.hasProfile('admin') || this.auth.getUser().id === id, 403);

  let itemService = this.getModuleService('user');
  let item = yield itemService.getOneById(id);

  this.assert(item, 404, 'user.view.notfound.message');
  this.viewBag.set('user', item);
  return yield this.renderView('user/view.html');
};

module.exports.deleteById = function *() {
  // Restricted to admin
  this.auth.requireProfile('admin');

  let itemService = this.getModuleService('user');
  let id = this.params.id || '';
  let item = yield itemService.getOneById(id);
  this.assert(item, 404, 'user.delete.notfound.message');

  let deleted = yield itemService.delete({'_id': id});
  let msg;
  if (deleted) {
    msg = this.i18n.__('user.deleted.success.message', item.username);
    this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
  } else {
    msg = this.i18n.__('user.deleted.error.message', item.username);
    this.flash = new FlashMessage(msg, FlashMessage.TYPES.ERROR);
  }
  return this.redirect('/user/');
};
