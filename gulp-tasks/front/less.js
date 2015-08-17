var config = require('./../config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');

var cfg= {
  src: config.browser.css.src,
  dist: config.browser.css.dist,
  sourcemap: config.enabled.less_sourcemap
};

gulp.task('front:css-build', function() {
  return gulp.src(cfg.src + '/**/*.less', { base : cfg.src })
    .pipe($.if(cfg.sourcemap, $.sourcemaps.init()))
    .pipe($.less(config.plugins.less))
    .pipe($.autoprefixer(config.plugins.less_autoprefixer))
    .pipe($.if(cfg.sourcemap, $.sourcemaps.write('.')))
    .pipe(gulp.dest(cfg.dist));
});

gulp.task('front:css-watch', function() {
  gulp.watch(cfg.src + '/**/*.less', ['front:css-build']);
});

gulp.task('front:css-clean', function(cb) {
  del(cfg.dist + '/**/*', cb);
});
