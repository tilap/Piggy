var config = require('./../config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');

var cfg= {
  src: config.browser.js.src,
  dist: config.browser.js.dist,
  includes: config.browser.js.includes,
  sourcemap: config.enabled.js_sourcemap
};

gulp.task('front:js-module', function() {
  return gulp.src(config.modules.src + '/**/*.js', { base : config.modules.src })

    // CLEAN
    .pipe($.replace(/\{BACK\}(.|[\n])*?{\/BACK\}/ig, function(reg) {
      return reg.split(/\r\n|\r|\n/).join('\n// ');
    }))

    .pipe($.if(cfg.sourcemap, $.sourcemaps.init()))
    .pipe($.babel(config.plugins.babel_front))
    .pipe($.uglify(config.plugins.uglify))
    .pipe($.if(cfg.sourcemap, $.sourcemaps.write('.')))
    .pipe(gulp.dest(config.modules.dist_front));
});

gulp.task('front:library', function() {
  var includesSrc = cfg.includes.src;
  var includesDist = cfg.includes.dist;
  var src = [];
  cfg.includes.files.forEach(function(file) {
    src.push(includesSrc + '/' + file);
  });

  return gulp.src(src, { base : includesSrc })
    // CLEAN
    .pipe($.replace(/\{BACK\}(.|[\n])*?{\/BACK\}/ig, function(reg) {
      return reg.split(/\r\n|\r|\n/).join('\n// ');
    }))

    .pipe($.if(cfg.sourcemap, $.sourcemaps.init()))
    .pipe($.babel(config.plugins.babel_front))
    .pipe($.uglify(config.plugins.uglify))
    .pipe($.if(cfg.sourcemap, $.sourcemaps.write('.')))
    .pipe(gulp.dest(includesDist));
});

gulp.task('front:library-watch', function() {
  var includesSrc = cfg.includes.src;
  var src = [];
  cfg.includes.files.forEach(function(file) {
    src.push(includesSrc + '/' + file);
  });

  gulp.watch(src + '/**/*.js', ['front:library']);
});


gulp.task('front:js-build', ['front:js-module'], function() {
  return gulp.src(cfg.src + '/**/*.js', { base : cfg.src })

    // CLEAN
    .pipe($.replace(/\{BACK\}(.|[\n])*?{\/BACK\}/ig, function(reg) {
      return reg.split(/\r\n|\r|\n/).join('\n// ');
    }))

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
