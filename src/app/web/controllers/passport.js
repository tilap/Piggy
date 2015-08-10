import passport from 'koa-passport';
import FlashMessage from 'FlashMessage';
import {strategies} from 'library/server/passport';
// import {authentification as authConfig} from 'config/main';
import config from 'config/main';
let authConfig = config.authentification || {};
import jwt from 'jsonwebtoken';
let tokenConfig = authConfig.token;

const redirectLoginSuccess = authConfig.redirections.success;
const redirectLoginError = authConfig.redirections.error;
const redirectLogout = authConfig.redirections.logout;
const sessionKey = authConfig.redirections.sessionkey;


module.exports.login = function *() {
  this.utils.requireNotConnected();

  this.session[sessionKey] = this.utils.getFromQuery('redirect', redirectLoginSuccess);
  let title = this.i18n.__('page.login.title');
  this.viewBag.get('html').head.title.queue(title);
  this.viewBag.set('pageTitle', title);
  this.viewBag.set('strategies', strategies.login);
  this.viewBag.set('message', this.utils.getFromQuery('message', ''));
  return yield this.renderView('passport/login.html');
};


module.exports.register = function *() {
  this.utils.requireNotConnected();

  this.session[sessionKey] = this.utils.getFromQuery('redirect', redirectLoginSuccess);

  let title = this.i18n.__('page.register.title');
  this.viewBag.get('html').head.title.queue(title);
  this.viewBag.set('pageTitle', title);
  this.viewBag.set('strategies', strategies.register);
  this.viewBag.set('message', this.utils.getFromQuery('message', ''));

  return yield this.renderView('passport/login.html');
};


module.exports.authentificate = function *() {
  let medium = this.params.medium;
  if (strategies.login.indexOf(medium) < 0) {
    this.throw(404, this.i18n.__('authenfication.medium.disabled', medium));
  }
  return yield passport.authenticate(medium);
};


module.exports.authentificateCB = function *() {
  let medium = this.params.medium;
  if (strategies.login.indexOf(medium) < 0) {
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
  this.utils.requireConnected();
  this.logout();
  return this.redirect(redirectLogout);
};

module.exports.getToken = function *() {
  this.utils.requireConnected();
  let user = this.utils.getUser();

  let payload = {
    'id': user.id,
    'created_at': new Date(),
  };
  let config = {
    'algorithm': tokenConfig.algorithm,
    'expiresInMinutes': tokenConfig.expiresInMinutes,
  };
  let token = jwt.sign(payload, tokenConfig.secret, config);
  this.body = token;
};
