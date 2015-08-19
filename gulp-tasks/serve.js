// Run a nodemon for the apps, watching usefull lib files to restart
// web:server
// api:server

var config = require('./config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});

function nodemon(env, cfg, key) {
  $.nodemon({
    script: cfg.dist + '/server.js',
    ext: 'js html',
    verbose: false,
    env: {
      NODE_ENV: env,
      NODE_PATH: cfg.paths.join(':'),
      APP_SLUG: key,
    },
    watch: [
      cfg.dist + '/**/*.js',
      cfg.dist + '/**/*.html',
      config.includes.dist,
      config.modules.dist
    ],
    delay: 150,
  })
  .on('restart', function (files) {
    var filesStr = files ? 'Files changed: ' + files.join(', ') : '(manual request)';
    console.log('[Server restarted]', filesStr);
  });
}

['web', 'api'].forEach(function(app) {
  gulp.task(app + ':server', function() {
    nodemon(config.env, config.app[app], app);
  });
});
