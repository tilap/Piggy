var config = require('./../config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');

var cfg= {
  src: config.browser.js.src,
  dist: config.browser.js.dist,
  sourcemap: config.enabled.js_sourcemap
};

gulp.task('front:js-build', function() {
  return gulp.src(cfg.src + '/**/*.js', { base : cfg.src })
    .pipe($.if(cfg.sourcemap, $.sourcemaps.init()))
    .pipe($.babel(config.plugins.babel_front))
    .pipe($.uglify(config.plugins.uglify))
    .pipe($.if(cfg.sourcemap, $.sourcemaps.write('.')))
    .pipe(gulp.dest(cfg.dist));
});

gulp.task('front:js-watch', function() {
  gulp.watch(cfg.src + '/**/*.js', ['front:js-build']);
});

gulp.task('front:js-clean', function(cb) {
  del(cfg.dist + '/**/*', cb);
});
