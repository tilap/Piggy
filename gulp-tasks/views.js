var gulp = require('gulp');
var del = require('del');

gulp.task('views:build', function() {
    return gulp.src(config.views.src)
      .pipe(gulp.dest(config.views.dist));
});

gulp.task('views:watch', function() {
    return gulp.watch(config.views.src, function(fileStatus) {
      console.log('[Views watcher] ' + fileStatus.type + ' ' + fileStatus.path);
      return gulp.src(fileStatus.path)
        .pipe(gulp.dest(config.views.dist));
    });
});

gulp.task('views:clean', function(cb) {
  del(config.views.dist + '/**/*', cb);
});
