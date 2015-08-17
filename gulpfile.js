var gulp = require('gulp');
var runSequence = require('run-sequence');
var path = require('path');
var requireDir = require('require-dir');

global.config = {
  root: path.resolve('.'),
  env: 'development',
  server: {
    app: {
      web: {
        src: __dirname + '/src/app/web',
        dist: __dirname + '/lib/app/web',
        paths: ['./lib/app/web', './lib/includes'],
      },
      api: {
        src: __dirname + '/src/app/api',
        dist: __dirname + '/lib/app/api',
        paths: ['./lib/app/api', './lib/includes'],
      },
    },
    includes: {
      src: __dirname + '/src/includes',
      dist: __dirname + '/lib/includes',
    },
  },
  modules: {
    templates: __dirname + '/dev/modules/templates/',
    src: __dirname + '/src/includes/modules/',
  },
  views: {
    src: './src/**/*.html',
    dist: './lib'
  },
  babel: {
    compact: false,
    comments: true,
    blacklist: ['regenerator'],
    optional: ['asyncToGenerator']
  }
};

requireDir('./gulp-tasks', { recurse: true });

gulp.task('clean', function() {
  runSequence(
    ['web:es6-clean', 'api:es6-clean', 'includes:es6-clean', 'views:clean']
  );
});

gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['views:build', 'includes:es6-build'],
    ['web:es6-build', 'api:es6-build']
  );
});

gulp.task('web:dev', function() {
  runSequence(
    ['web:es6-clean', 'web:es6-lint'],
    ['includes:es6-build'],
    ['web:es6-build', 'views:build'],
    ['includes:es6-watch', 'web:es6-watch', 'views:watch'],
    ['web:server']
  );
});

gulp.task('api:dev', function() {
  runSequence(
    ['api:es6-clean', 'api:es6-lint'],
    ['includes:es6-build'],
    ['api:es6-build'],
    ['includes:es6-watch', 'api:es6-watch'],
    ['api:server']
  );
});

