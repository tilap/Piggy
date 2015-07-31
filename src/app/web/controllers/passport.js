import passport from 'koa-passport';
import FlashMessage from 'FlashMessage';
import {strategies} from 'library/server/passport';
import {authentification as authConfig} from 'config/main';

const redirectLoginSuccess = authConfig.redirections.success;
const redirectLoginError = authConfig.redirections.error;
const redirectLogout = authConfig.redirections.logout;
const sessionKey = authConfig.redirections.sessionkey;


module.exports.login = function *() {
  this.session[sessionKey] = this.request.args.redirect ? decodeURIComponent(this.request.args.redirect) : redirectLoginSuccess;

  let title = this.i18n.__('page.login.title');
  this.viewBag.get('html').head.title.queue(title);
  this.viewBag.set('pageTitle', title);
  this.viewBag.set('strategies', strategies.login);
  this.viewBag.set('message', this.request.args.message ? decodeURIComponent(this.request.args.message) : '');

  return yield this.renderView('passport/login.html');
};


module.exports.register = function *() {
  this.session[sessionKey] = this.request.args.redirect ? decodeURIComponent(this.request.args.redirect) : redirectLoginSuccess;

  let title = this.i18n.__('page.register.title');
  this.viewBag.get('html').head.title.queue(title);
  this.viewBag.set('pageTitle', title);
  this.viewBag.set('strategies', strategies.register);
  this.viewBag.set('message', this.request.args.message ? decodeURIComponent(this.request.args.message) : '');

  return yield this.renderView('passport/login.html');
};


module.exports.authentificate = function *() {
  let medium = this.params.medium;
  if(strategies.login.indexOf(medium)<0) {
    this.throw(404, this.i18n.__('authenfication.medium.disabled', medium));
  }
  return yield passport.authenticate(medium);
};


module.exports.authentificateCB = function *() {
  let medium = this.params.medium;
  if(strategies.login.indexOf(medium)<0) {
    this.throw(404, this.i18n.__('authenfication.medium.disabled', medium));
  }

  let ctx = this;

  yield passport.authenticate(medium, function *(err, user) {
    let res = {
      message: null,
      messageType: null,
      redirectUrl: null
    };

    // Error
    if(err) {
      ctx.logger.error('Authentification error: ' + err.message);
      res = {
        message: err.message,
        messageType: FlashMessage.TYPES.ERROR,
        redirectUrl: redirectLoginError
      };
    }

    // No error but no user found or not created. Should not occured at any time
    else if(!user) {
      ctx.logger.error('Authentification failed', user);
      res = {
        message: ctx.i18n.__('authentification.failed'),
        messageType: FlashMessage.TYPES.SUCCESS,
        redirectUrl: redirectLoginError
      };
    }

    // Success
    else {
      yield ctx.logIn(user);

      res = {
        message: ctx.i18n.__('authentification.welcome', user.username),
        messageType: FlashMessage.TYPES.SUCCESS,
        redirectUrl: ctx.session[sessionKey] || redirectLoginSuccess
      };

      if(ctx.session[sessionKey]) {
        delete ctx.session[sessionKey];
      }
    }

    ctx.flash = new FlashMessage(res.message, res.messageType);
    ctx.redirect(res.redirectUrl);
  });
};


module.exports.logout = function *() {
  this.logout();
  this.redirect(redirectLogout);
};
