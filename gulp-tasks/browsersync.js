// browsersync singleton
// output null if browsersync is disabled

var config = require('./config.js');
var gulp = require('gulp');

gulp.task('browsersync', function() {
  if(config.enabled.browsersync) {
    setTimeout( function() {
      var browserSync = require('browser-sync');
      browserSync.create();
      browserSync.init(config.plugins.browsersync);

      gulp.watch([
        config.browser.js.dist + '/**/*.js',
        config.browser.css.dist + '/**/*.css'
      ]).on('change', browserSync.reload);
    }, 2000);
  }
});
