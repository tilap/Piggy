/**
 * Redirect to a specific url on specific status code error thrown in controller layer
 * Provides trigger options: the error status code and the accept response type
 * Optionnaly add origin url and error content to the redirect url
 *
 * @param {Object} opts - the options
 * @param {String} opts.status_code - the integer status code
 * @param {String} opts.redirect_url - the url to redirect to
 * @param {String} opts.redirect_name - GET param name for the original url
 * @param {String} opts.message_name - GET param name for the message
 * @param {String} opts.accepts - accepts output by the client
 *
 * @example:
 *
 * If a 401 code error is thrown, will redirect to the login url
 *
 * app.use(redirectOnHtmlStatus({
 *  status_code: 401,
 *  redirect_url: '/login/',
 *  accept: 'html'
 * }));
 */
export default function(options) {
  let config = {
    'status_code': 401,
    'redirect_url': '',
    'redirect_name': 'redirect',
    'message_name': 'message',
    'accepts': 'html',
  };

  Object.keys(config).forEach( option => {
    if (options[option]) {
      config[option] = options[option];
    }
  });

  return function *(next) {
    try {
      return yield next;
    } catch (err) {
      if (err.status !== config.status_code || !this.accepts(config.accepts) || !config.redirect_url) {
        throw err;
      }

      let redirectUrl = config.redirect_url;
      if (config.redirect_name) {
        redirectUrl += redirectUrl.indexOf('?') < 0 ? '?' : '&';
        redirectUrl += config.redirect_name + '=' + encodeURIComponent(this.request.href);
      }
      if (err.message && err.message !== '' && config.message_name) {
        redirectUrl += '&' + config.message_name + '=' + encodeURIComponent(err.message);
      }
      return this.redirect(redirectUrl);
    }
  };
}
