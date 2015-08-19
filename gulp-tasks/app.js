// Applications main tasks
// - *:es6-clean => clean the generated files
// - *:es6-build => transpile app files to lib
// - *:es6-lint =>  run linter over the app sources
// - *:es6-watch => watch source changes (and incudes changes) and run build

var config = require('./config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');

['web', 'api'].forEach(function(app) {
  var appConfig = config.app[app];
  var cfg = {
    src : appConfig.src,
    dist : appConfig.dist,
    watch: [appConfig.src + '/**/*.js', config.includes.src],
    tasks: {
      clean: app + ':es6-clean',
      build: app + ':es6-build',
      lint: app + ':es6-lint',
      watch: app + ':es6-lint',
      views: {
        clean: app + ':views-clean',
        build: app + ':views-build',
        watch: app + ':views-watch'
      }
    }
  };

  gulp.task(cfg.tasks.build, function() {
    return gulp.src(cfg.src + '/**/*.js')
      .pipe($.if(appConfig.sourcemap, $.sourcemaps.init()))
      .pipe($.babel(config.plugins.babel))
      .pipe($.if(appConfig.sourcemap, $.sourcemaps.write('.')))
      .pipe(gulp.dest(cfg.dist));
  });

  gulp.task(cfg.tasks.lint, function() {
    gulp.src(cfg.src + '/**/*.js')
      .pipe($.eslint())
      .pipe($.eslint.formatEach('compact', process.stderr))
      .pipe($.eslint.failAfterError());
  });

  gulp.task(cfg.tasks.clean, function() {
    del(cfg.dist + '/**/*');
  });

  gulp.task(app + ':es6-watch', function() {
    return gulp.watch(cfg.watch, function(fileStatus) {
      console.log('[ES6 watcher] ' + fileStatus.path + ' (' + fileStatus.type + ') ' + ' => transpile it into ' + cfg.dist);
      return gulp.src(fileStatus.path, { base : cfg.src })
        .pipe($.if(appConfig.sourcemap, $.sourcemaps.init()))
        .pipe($.babel(config.plugins.babel))
        .pipe($.if(appConfig.sourcemap, $.sourcemaps.write('.')))
        .pipe(gulp.dest(cfg.dist));
    });
  });



  gulp.task(cfg.tasks.views.clean, function() {
    if(!appConfig.views) {
      console.log('No view for app ' + app);
    }
    del(appConfig.views.dist + '/**/*.html');
  });

  gulp.task(cfg.tasks.views.build, function() {
    if(!appConfig.views) {
      console.log('No view for app ' + app);
    }
    return gulp.src(appConfig.views.src + '/**/*.html', { base: appConfig.views.src})
      .pipe(gulp.dest(appConfig.views.dist));
  });

  gulp.task(cfg.tasks.views.watch, function() {
    if(!appConfig.views) {
      console.log('No view for app ' + app);
    }
    return gulp.watch(appConfig.views.src + '/**/*.html', function(fileStatus) {
      console.log('[Views watcher] ' + fileStatus.type + ' ' + fileStatus.path);
      return gulp.src(fileStatus.path, { base: appConfig.views.src})
        .pipe(gulp.dest(appConfig.views.dist));
    });
  });

});



