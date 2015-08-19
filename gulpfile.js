var config = require('./gulp-tasks/config.js');

var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');


requireDir('./gulp-tasks', { recurse: true });

gulp.task('clean', function() {
  runSequence(
    [
      'web:es6-clean',
      'api:es6-clean',
      'includes:es6-clean',
      'modules:es6-clean',
      'web:views-clean',
      'front:js-clean',
      'front:css-clean'
    ]
  );
});

gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['web:views-build'],
    ['includes:es6-build', 'modules:es6-build'],
    ['web:es6-build', 'api:es6-build'],
    ['front:js-build', 'front:css-build']
  );
});

gulp.task('web:dev', function() {
  runSequence(
    ['web:es6-clean', 'web:es6-lint'],
    ['includes:es6-build', 'modules:es6-build'],
    ['web:es6-build', 'web:views-build', 'front:js-build', 'front:css-build'],
    ['includes:es6-watch', 'modules:es6-watch'],
    ['web:es6-watch', 'web:views-watch', 'front:js-watch', 'front:css-watch'],
    ['web:server'],
    ['browsersync']
  );
});

gulp.task('api:dev', function() {
  runSequence(
    ['api:es6-clean', 'api:es6-lint'],
    ['includes:es6-build', 'modules:es6-build'],
    ['api:es6-build'],
    ['includes:es6-watch', 'modules:es6-watch'],
    ['api:es6-watch'],
    ['api:server']
  );
});

