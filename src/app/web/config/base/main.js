require('./../env-override')();
import path from 'path';

let root = path.normalize(__dirname + '/../../../../../');

// @todo: make it as a function and give it the few path as args
// @todo: put local in app dir maybe?

export default {
    port: 3013,
    keys: ['some-secret-key'],

    db: {
      local: 'mongodb://localhost/piggy'
    },

    loggers: {
      winston: {
        console: {
          enabled: true,
          level: 'silly',
          colors: {
            silly : {label: 'magenta', message: 'magenta'},
            verbose : { label: 'blackBright', message: 'blackBright'},
            debug : { label: 'green', message: 'green'},
            info : { label: 'cyan', message: 'cyan'},
            warn : { label: 'yellow', message: 'yellow'},
            error : { label: 'red', message: 'red'},
          }
        },
        file: {
          enabled: true,
          level: 'warn',
          filename: path.resolve(root, 'logs/web.log.json')
        }
      },
      requests: true
    },

    // PassportJs
    authentification: {
      providers: {
        twitter: {
          register: true,
          bind: false,
          consumerKey: process.env.TWITTER_CLIENTID,
          consumerSecret: process.env.TWITTER_SECRET
        },
        facebook: {
          register: true,
          bind: true,
          clientID: process.env.FACEBOOK_CLIENTID,
          clientSecret: process.env.FACEBOOK_SECRET
        },
        google: {
          register: false,
          bind: true,
          clientId: process.env.GOOGLE_CLIENTID,
          clientSecret: process.env.GOOGLE_SECRET
        }
      },
      redirections: {
        success: '/',
        error: '/login/',
        logout: '/',
        sessionkey: 'redirectAfterLogin'
      }
    },

    // @see https://github.com/koajs/body-parser#options
    bodyparser: {},

    // @see https://github.com/fundon/koa-locale#usage
    locale: {},

    // @see https://github.com/fundon/koa-i18n
    i18n: {
      directory: path.join(root, 'locales'),
      locales: ['en', 'fr'],
      querystring: 'lang',
      modes: [
        'query',    //  optional detect querystring - `/?locale=en-US`
        'subdomain',//  optional detect subdomain   - `zh-CN.koajs.com`
        'cookie',   //  optional detect cookie      - `Accept-Language: zh-CN,zh;q=0.5`
        'header',   //  optional detect header      - `Cookie: locale=zh-TW`
        'url',      //  optional detect url         - `/en`
        'tld'       //  optional detect tld(the last domain) - `koajs.cn`
      ]
    },

    static: {
        directory: path.join(root, 'public')
    },

    // @see https://github.com/koajs/generic-session#options
    session: {
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //24 hours
        },
        key: 'myapp-cookie',
        mongo: 'mongodb://localhost/piggy-sessions'
    },

    // @see https://www.npmjs.com/package/koa-flash
    flash: {
        key: 'piggy'
    },

    // @see https://github.com/fundon/koa-swig
    view: {
      root: './lib/app/web/views',
      autoescape: true,
      cache: false,
      ext: 'html'
    },

    // @see https://github.com/koajs/error
    error: {
        template: './lib/app/web/views/layouts/error.html'
    }
};
