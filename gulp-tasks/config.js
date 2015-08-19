var path = require('path');

var root = path.resolve('.');
var env = 'development';
var debug = env === 'development';

module.exports = {
  root: root,
  env: env,
  app: {
    web: {
      src: root + '/src/app/web/server',
      dist: root + '/lib/app/web/server',
      paths: ['./lib/app/web/server', './lib/includes'],
      sourcemap: false,
      views: {
        src: './src/app/web/views/',
        dist: './lib/app/web/views'
      },
    },
    api: {
      src: root + '/src/app/api/server',
      dist: root + '/lib/app/api/server',
      paths: ['./lib/app/api/server', './lib/includes'],
      sourcemap: true,
    },
  },
  includes: {
    src: root + '/src/includes',
    dist: root + '/lib/includes',
    sourcemap: true,
  },
  browser: {
    js: {
      src: root + '/src/app/web/browser/js',
      dist: root + '/public/js',
    },
    css: {
      src: root + '/src/app/web/browser/style',
      dist: root + '/public/style',
    }
  },
  modules: {
    src: root + '/src/modules/',
    dist: root + '/lib/modules/',
    sourcemap: true,
  },
  plugins: {
    babel: {
      compact: !debug,
      comments: debug,
      blacklist: ['regenerator'],
      optional: ['asyncToGenerator', 'runtime']
    },
    babel_front: {
      compact: !debug,
      comments: debug,
      blacklist: [],
      optional: ['runtime']
    },
    less: {

    },
    less_autoprefixer: {
      browsers: ['> 1%', 'last 2 versions'],
      cascade: debug,
      remove: !debug
    },
    browsersync: { // @see http://www.browsersync.io/docs/options/
      baseDir: './',
      ui: {
        port: 4242,
        weinre: {
          port: 4243
        },
      },
      port: 3013,
      proxy: {
        target: 'localhost:2222'
      },
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
      },
      logLevel: 'info',
      logPrefix: 'BrowserSync PIGGY',
      logConnections: false,
      logFileChanges: true,
      reloadOnRestart: true,
      notify: true,
      scrollProportionally: true,
      injectChanges: true,
      codeSync: true
    },
    uglify: { // @see https://github.com/terinjokes/gulp-uglify
      mangle: !debug,
      preserveComments: debug ? 'all' : false,
      warnings: debug,
    },
  },
  enabled: {
    browsersync: debug,
    less_sourcemap: debug, // Sourcemap for frontend css
    js_sourcemap: debug, // Sourcemap for frontend javascript
  },
  generators: {
    api: {
      controller: {
        template: root + '/dev/templates/api/controller.js',
        dist: root + '/src/app/api/server/controllers/'
      },
      router: {
        template: root + '/dev/templates/api/router.js',
        dist: root + '/src/app/api/server/routers/'
      }
    },
    modules: {
      templates: root + '/dev/templates/modules/',
    }
  },

};
