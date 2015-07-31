import ManagerError from 'piggy-module/lib/Errors';
import FlashMessage from 'FlashMessage';

import UserManager from 'modules/user/Manager';
import Storage from 'piggy-module/lib/Storage/Db';
import db from 'database';
let collection = db.getMonkCollection('user');
let storage = new Storage(collection);
let userManager = new UserManager(storage);

module.exports.new = function *() {

  if (!this.isAuthenticated()) {
    return this.throw(401);
  }

  this.viewBag.set('form', {
    user: null,
    errors: {}
  });

  let user = userManager.getNewVo();

  if(this.request.method==='POST') {

    ['username', 'firstname', 'lastname', 'email'].forEach( field => {
      user[field] = this.request.body[field] || '';
    });

    try {
      let newUser = yield userManager.saveOne(user);
      this.flash = new FlashMessage(this.i18n.__('user.new.success.message', newUser.username), FlashMessage.TYPES.SUCCESS);
      return this.redirect(this.request.href);
    }
    catch(errors) {
      if(errors instanceof ManagerError) {
        this.logger.error('Error while inserting user', errors);
        this.throw(500, this.i18n.__('user.new.exception.message'));
      }
      this.viewBag.get('form').errors = errors;
    }
  }

  this.viewBag.get('form').user = user;
  this.viewBag.get('html').head.title.queue('Users');
  return yield this.renderView('user/new.html');
};


module.exports.edit = function *() {

  if (!this.isAuthenticated()) {
    return this.throw(401);
  }

  this.viewBag.set('form', {
    user: null,
    errors: {}
  });

  let id = this.params.id || '';
  let user = yield userManager.getByUniqueProperty('_id', id);
  if(!user) {
    this.throw(404, this.i18n.__('user.edit.notfound.message'));
  }

  if(this.request.method==='POST') {

    ['firstname', 'lastname', 'email'].forEach( field => {
      user[field] = this.request.body[field] || '';
    });

    try {
      let updatedUser = yield userManager.updateOne(user);
      let msg = this.i18n.__('user.update.success.message', updatedUser.username);
      this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
      this.redirect(this.request.href);
    }
    catch(errors) {
      this.viewBag.get('form').errors = errors;
    }
  }

  this.viewBag.get('form').user = user;
  return yield this.renderView('user/edit.html');
};

module.exports.list = function *() {

  if (!this.isAuthenticated()) {
    return this.throw(401);
  }

  try {
    let users = yield userManager.get();
    this.viewBag.set('users', users);
  } catch(err) {
    this.logger.error('Error while listing users', err);
    this.throw(500);
  }

  return yield this.renderView('user/list.html');
};

module.exports.viewById = function *() {
  let user = yield userManager.getByUniqueProperty('_id', this.params.id || '');

  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }
  this.viewBag.set('user', user);

  return yield this.renderView('user/view.html');
};

module.exports.viewByUsername = function *() {
  let username = this.params.username || '';
  let user = yield userManager.getByUniqueProperty('username', username);
  if(!user) {
    this.throw(404, this.i18n.__('user.view.notfound.message'));
  }
  this.viewBag.set('user', user);
  return yield this.renderView('user/view.html');
};

module.exports.deleteById = function *() {
  if (!this.isAuthenticated()) {
    return this.throw(401);
  }

  try {
    let user = yield userManager.getByUniqueProperty('_id', this.params.id || '');
    if(!user) {
      this.throw(404, this.i18n.__('user.view.notfound.message'));
    }

    yield userManager.deleteOne(user);
    let msg = this.i18n.__('user.deleted.success.message', user.username);
    this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
    return this.redirect('/user/');
  }
  catch(err) {
    this.logger.error(err);
    return this.throw(500, err.message);
  }
};

module.exports.listaction = function *() {
  let action = this.request.body.action || '';
  let usernames = this.request.body.usernames || [];

  if(usernames.length===0) {
    this.flash = new FlashMessage('No item selected', FlashMessage.TYPES.ERROR);
    return this.redirect(this.request.href);
  }

  switch(action) {

    case 'delete':
      try {
        let users = yield userManager.getByUniquePropertyM('username', usernames);
        let result = userManager.delete(users);
        let msg = this.i18n.__('user.deletedmultiple.success.message', result);

        this.flash = new FlashMessage(msg, FlashMessage.TYPES.SUCCESS);
        return this.redirect('/user/');

      } catch(err) {
        this.logger.error(err);
        return this.throw(500, err.message);
      }
    break;
    default:
      this.throw(500, 'Action ' + action + 'not found');
  }
};
