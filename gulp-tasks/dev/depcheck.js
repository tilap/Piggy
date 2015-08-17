// Chack unused packages.
// As it grep, packages use with require(var) are not found...

var gulp = require('gulp');
var depcheck = require('depcheck');

gulp.task('unusedPackages', function() {
  var options = {
    withoutDev: true,
    ignoreDirs: ['src', 'locales', 'logs', 'public'],
    ignoreMatches: ['gulp-*']
  };

  depcheck(config.root, options, function(unused) {
    if(unused.dependencies.length > 0 || unused.devDependencies.length > 0) {
      console.log('=> Package without usage');
      if(unused.dependencies.length > 0) {
        console.log(' - ' + unused.dependencies.join("\n - "));
      }
      if(unused.devDependencies.length > 0) {
        console.log(' - (dev) ' + unused.devDependencies.join("\n - "));
      }
    }
  });
});

