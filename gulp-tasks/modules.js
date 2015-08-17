var config = require('./config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');

var cfg = {
  src: config.modules.src,
  dist: config.modules.dist,
  sourcemap: config.modules.sourcemap,
};

gulp.task('modules:es6-build', function() {
  return gulp.src(cfg.src + '/**/*.js')
    .pipe($.if(cfg.sourcemap, $.sourcemaps.init()))
    .pipe($.babel(config.plugins.babel))
    .pipe($.if(cfg.sourcemap, $.sourcemaps.write('.')))
    .pipe(gulp.dest(cfg.dist));
});

gulp.task('modules:es6-lint', function() {
  gulp.src(cfg.src + '/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.formatEach('compact', process.stderr))
    .pipe($.eslint.failAfterError());
});

gulp.task('modules:es6-clean', function() {
  del(cfg.dist + '/**/*');
});

gulp.task('modules:es6-watch', function() {
  return gulp.watch(cfg.src + '/**/*.js', function(fileStatus) {
    console.log('[ES6 watcher] ' + fileStatus.path + ' (' + fileStatus.type + ') ' + ' => transpile it into ' + cfg.dist);
    return gulp.src(fileStatus.path, { base : cfg.src })
      .pipe($.if(cfg.sourcemap, $.sourcemaps.init()))
      .pipe($.babel(config.plugins.babel))
      .pipe($.if(cfg.sourcemap, $.sourcemaps.write('.')))
      .pipe(gulp.dest(cfg.dist));
  });
});
