// Includes tasks
// - includes:es6-clean => clean the generated files
// - includes:es6-build => transpile inc. files to lib
// - includes:es6-lint =>  run linter over the inc. sources
// - includes:es6-watch => watch source changes and run build

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');

var cfg = {
  src: config.server.includes.src,
  dist: config.server.includes.dist
};

gulp.task('includes:es6-build', function() {
  return gulp.src(cfg.src + '/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel(config.babel))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(cfg.dist));
});

gulp.task('includes:es6-lint', function() {
  gulp.src(cfg.src + '/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.formatEach('compact', process.stderr))
    .pipe($.eslint.failAfterError());
});

gulp.task('includes:es6-clean', function() {
  del(cfg.dist + '/**/*');
});

gulp.task('includes:es6-watch', function() {
  return gulp.watch(cfg.src + '/**/*.js', function(fileStatus) {
    console.log('[ES6 watcher] ' + fileStatus.path + ' (' + fileStatus.type + ') ' + ' => transpile it into ' + cfg.dist);
    return gulp.src(fileStatus.path, { base : cfg.src })
      .pipe($.sourcemaps.init())
      .pipe($.babel(config.babel))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(cfg.dist));
  });
});
