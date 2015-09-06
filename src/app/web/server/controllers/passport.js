import passport from 'koa-passport';
import FlashMessage from 'FlashMessage';
import {availableStrategies} from 'library/koa-middlewares/passport';

import config from 'config/server';
let authConfig = config.authentification || {};
import jwt from 'jsonwebtoken';
let tokenConfig = authConfig.token;

const redirectLoginSuccess = authConfig.redirections.success;
const redirectLoginError = authConfig.redirections.error;
const redirectLogout = authConfig.redirections.logout;
const sessionKey = authConfig.redirections.sessionkey;

module.exports.login = function *() {
  this.auth.requireNotConnected();

  this.session[sessionKey] = this.utils.getFromQuery('redirect', redirectLoginSuccess);
  let title = this.i18n.__('page.login.title');
  this.viewBag.get('html').head.title.queue(title);
  this.viewBag.set('pageTitle', title);
  this.viewBag.set('strategies', availableStrategies.login);
  this.viewBag.set('message', this.utils.getFromQuery('message', ''));
  return yield this.renderView('passport/login.html');
};


module.exports.register = function *() {
  this.auth.requireNotConnected();

  this.session[sessionKey] = this.utils.getFromQuery('redirect', redirectLoginSuccess);

  let title = this.i18n.__('page.register.title');
  this.viewBag.get('html').head.title.queue(title);
  this.viewBag.set('pageTitle', title);
  this.viewBag.set('strategies', availableStrategies.register);
  this.viewBag.set('message', this.utils.getFromQuery('message', ''));

  return yield this.renderView('passport/login.html');
};


module.exports.authentificate = function *() {
  let medium = this.params.medium;
  if (availableStrategies.login.indexOf(medium) < 0) {
    this.throw(404, this.i18n.__('authenfication.medium.disabled', medium));
  }
  return yield passport.authenticate(medium);
};


module.exports.authentificateCB = function *() {
  let medium = this.params.medium;
  if (availableStrategies.login.indexOf(medium) < 0) {
    this.throw(404, this.i18n.__('authenfication.medium.disabled', medium));
  }

  let ctx = this;

  yield passport.authenticate(medium, function *(err, user) {
    let res = {
      'message': null,
      'messageType': null,
      'redirectUrl': null,
    };

    // Error
    if (err) {
      ctx.logger.error('Authentification error: ' + err.message);
      res = {
        'message': err.message,
        'messageType': FlashMessage.TYPES.ERROR,
        'redirectUrl': redirectLoginError,
      };
    } else if (!user) { // No error but no user found or not created. Should not occured at any time
      ctx.logger.error('Authentification failed', user);
      res = {
        'message': ctx.i18n.__('authentification.failed'),
        'messageType': FlashMessage.TYPES.SUCCESS,
        'redirectUrl': redirectLoginError,
      };
    } else { // Success
      yield ctx.logIn(user);

      res = {
        'message': ctx.i18n.__('authentification.welcome', user.username),
        'messageType': FlashMessage.TYPES.SUCCESS,
        'redirectUrl': ctx.session[sessionKey] || redirectLoginSuccess,
      };

      if (ctx.session[sessionKey]) {
        delete ctx.session[sessionKey];
      }
    }

    ctx.flash = new FlashMessage(res.message, res.messageType);
    ctx.redirect(res.redirectUrl);
  });
};


module.exports.logout = function *() {
  this.auth.requireConnected();
  this.logout();
  return this.redirect(redirectLogout);
};

import ApiBagBase from 'ApiBag/Base';

module.exports.getToken = function *() {
  let bag = new ApiBagBase();
  let res = {
    'token': null,
  };

  if (this.auth.getUser()) {
    let user = this.auth.getUser();
    let payload = {
      'id': user.id,
      'created_at': new Date(),
    };
    let config = {
      'algorithm': tokenConfig.algorithm,
      'expiresInMinutes': tokenConfig.expiresInMinutes,
    };
    res.token = jwt.sign(payload, tokenConfig.secret, config);
  }

  bag.setData(res);

  this.body = bag.toJson();
};
