require('./../env-override')();
import path from 'path';

let root = path.normalize(__dirname + '/../../../../');

export default {
  'port': 3013,
  'keys': ['some-secret-key'],
  'db': {
    'local': 'mongodb://localhost:27017/piggy',
  },
  'loggers': {
    'winston': {
      'console': {
        'enabled': true,
        'level': 'silly',
        'colors': {
          'silly': { 'label': 'magenta', 'message': 'magenta'},
          'verbose': { 'label': 'blackBright', 'message': 'blackBright'},
          'debug': { 'label': 'green', 'message': 'green'},
          'info': { 'label': 'cyan', 'message': 'cyan'},
          'warn': { 'label': 'yellow', 'message': 'yellow'},
          'error': { 'label': 'red', 'message': 'red'},
        },
      },
      'file': {
        'enabled': true,
        'level': 'warn',
        'filename': path.resolve(root, 'logs/api.log.json'),
      },
    },
    'requests': true,
  },

  // PassportJs
  'authentification': {
    'providers': {
      'twitter': {
        'strategy': 'twitter',
        'consumerKey': process.env.TWITTER_CLIENTID,
        'consumerSecret': process.env.TWITTER_SECRET,
      },
      'facebook': {
        'strategy': 'facebook',
        'clientID': process.env.FACEBOOK_CLIENTID,
        'clientSecret': process.env.FACEBOOK_SECRET,
      },
      'google': {
        'strategy': 'google-auth',
        'clientId': process.env.GOOGLE_CLIENTID,
        'clientSecret': process.env.GOOGLE_SECRET,
      },
    },
    'register': ['facebook', 'twitter'],
    'bind': ['twitter', 'facebook', 'google'],
    'login': ['twitter', 'facebook'],
    'redirections': {
      'success': '/',
      'error': '/login/',
      'logout': '/',
      'sessionkey': 'redirectAfterLogin',
    },
    'token': {
      'name': '_tokenidentifier',
      'secret': 'plug_in_baby',
      'algorithm': 'HS256',
      'expiresInMinutes': 10080, // 7 days
    },
  },

  // @see https://github.com/koajs/body-parser#options
  'bodyparser': {},

  // @see https://github.com/fundon/koa-locale#usage
  'locale': {},

  // @see https://github.com/fundon/koa-i18n
  'i18n': {
    'directory': path.join(root, 'locales'),
    'locales': ['en', 'fr'],
    'querystring': 'lang',
    'modes': [
      'query',    //  optional detect querystring - `/?locale=en-US`
      'subdomain',//  optional detect subdomain   - `zh-CN.koajs.com`
      'cookie',   //  optional detect cookie      - `Accept-Language: zh-CN,zh;q=0.5`
      'header',   //  optional detect header      - `Cookie: locale=zh-TW`
      'url',      //  optional detect url         - `/en`
      'tld',      //  optional detect tld(the last domain) - `koajs.cn`
    ],
  },

  'static': {
    'directory': path.join(root, 'public'),
  },

  // @see https://github.com/koajs/generic-session#options
  'session': {
    'cookie': {
      'maxAge': 1000 * 60 * 60 * 24, // 24 hours
    },
    'key': 'myapp-cookie',
    'mongo': 'mongodb://localhost/piggy-sessions',
  },

  // @see https://github.com/fundon/koa-swig
  'view': {
    'root': './lib/app/web/views',
    'autoescape': true,
    'cache': false,
    'ext': 'html',
  },

  // @see https://github.com/koajs/error
  'error': {
    'template': './lib/app/web/views/layouts/error.html',
  },
};
