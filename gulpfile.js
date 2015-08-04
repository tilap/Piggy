'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var del = require('del');
var runSequence = require('run-sequence');
var options = process.argv.slice(2);
var depcheck = require('depcheck');
var path = require('path');
var inquirer = require('inquirer');
var fs = require('fs');

var config = {
  es6: {
    src: './src',
    dist: './lib'
  },
  views: {
    src: './src/**/*.html',
    dist: './lib'
  }
};


gulp.task('clean', function() {
  runSequence(
    ['es6:clean', 'views:clean']
  );
});

gulp.task('build', function() {
  runSequence(
    ['es6', 'views'],
    ['unusedPackages']
  );
});

gulp.task('watch', function() {
  runSequence(
    ['server'],
    ['es6:watch', 'views:watch']
  );
});

gulp.task('watch:api', function() {
  runSequence(
    ['server:api']
  );
});

gulp.task('views', function() {
    return gulp.src(config.views.src)
      .pipe(gulp.dest(config.views.dist));
});

gulp.task('views:watch', function() {
    return gulp.watch(config.views.src, function(fileStatus) {
      console.log('[Wiews watcher] ' + fileStatus.type + ' ' + fileStatus.path);
      return gulp.src(fileStatus.path)
        .pipe(gulp.dest(config.views.dist));
    });
});

gulp.task('views:clean', function(cb) {
  del(config.views.dist + '/**/*', cb);
});

gulp.task('es6', function() {
    return gulp.src(config.es6.src + '/**/*.js')
      .pipe($.sourcemaps.init())
      .pipe($.babel({
        compact: false,
        comments: false,
        blacklist: ['regenerator'],
        optional: ['asyncToGenerator']
      }))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(config.es6.dist));
});

gulp.task('es6:watch', function() {
    return gulp.watch(config.es6.src + '/**/*.js', function(fileStatus) {
      var path = fileStatus.path.replace(__dirname, '');
      console.log('[ES6 watcher] ' + path + ' (' + fileStatus.type + ') ' +
        ' => transpile it into ' + config.es6.dist);

      return gulp.src(fileStatus.path, { base : config.es6.src })
        .pipe($.sourcemaps.init())
        .pipe($.babel({
          compact: false,
          comments: true,
          blacklist: ['regenerator'],
          optional: ['asyncToGenerator']
        }))
        .pipe($.sourcemaps.write('.')) // @tofix
        .pipe(gulp.dest(config.es6.dist));
    });
});

gulp.task('es6:clean', function(cb) {
  del(config.es6.dist + '/**/*', cb);
});


gulp.task('unusedPackages', function() {
  var options = {
    withoutDev: false,
    ignoreDirs: ['src', 'locales', 'logs', 'public'],
    ignoreMatches: ['gulp-*']
  };

  var root = path.resolve('.');
  depcheck(root, options, function(unused) {
    if(unused.dependencies.length > 0 || unused.devDependencies.length > 0) {
      console.log('=> Some packages are useless and should be removed');
      if(unused.dependencies.length > 0) {
        console.log('- ' + unused.dependencies.join("\n - "));
      }
      if(unused.devDependencies.length > 0) {
        console.log('- (dev) ' + unused.devDependencies.join("\n - "));
      }
    }
  });
});


// =============================================================================
// Serve =======================================================================
// =============================================================================

gulp.task('server', function() {
  $.nodemon({
    script: 'lib/app/web/server.js',
    ext: 'js html',
    verbose: false,
    env: {
      NODE_ENV: options.env ? options.env : 'development',
      NODE_PATH: './lib/app/modules:./lib/app/web:./lib/includes',
    },
    watch: [
      'lib/**/*.js'
    ],
    ignore: [
      'logs/**/*',
      'node_modules/**/*',
      'public/**/*',
      'src/**/*'
    ],
    delay: 150
  })
  .on('restart', function (files) {
    var filesStr = files ? 'Files changed: ' + files.join(', ') : '(manual request)';
    console.log('[Server restarted]', filesStr);
  });
});

gulp.task('server:api', function() {
  $.nodemon({
    script: 'lib/app/api/server.js',
    ext: 'js html',
    verbose: false,
    env: {
      NODE_ENV: options.env ? options.env : 'development',
      NODE_PATH: './lib/app/modules:./lib/app/api:./lib/includes',
    },
    watch: [
      'lib/**/*.js'
    ],
    ignore: [
      'logs/**/*',
      'node_modules/**/*',
      'public/**/*',
      'src/**/*'
    ],
    delay: 150
  })
  .on('restart', function (files) {
    var filesStr = files ? 'Files changed: ' + files.join(', ') : '(manual request)';
    console.log('[Server restarted]', filesStr);
  });
});


// =============================================================================
// Dev tool ====================================================================
// =============================================================================

gulp.task('module', function (done) {
  var srcPath = __dirname + '/dev/modules/templates/';
  var distPath = path.resolve(__dirname + '/src/includes/modules/');
  let moduleFiles = fs.readdirSync(srcPath).sort();

  console.info('');
  console.info('==============================');
  console.info('  Generator for empty module');
  console.info('==============================');
  console.info('');

  inquirer.prompt([
    { type: 'input',
      name: 'name',
      message: 'Module name',
      default: '',
      validate: function(value) {
        return value!=='';
      }
    },
    { type: 'input',
      name: 'collection',
      message: 'Mongo Collection',
      default: '',
      validate: function(value) {
        return value!=='';
      }
    },
    { type: 'checkbox',
      name: 'files',
      message: 'What to generate ?',
      choices: moduleFiles,
      default: moduleFiles
    },
    { type: 'input',
      name: 'destination',
      message: 'Destination',
      default: distPath
    },
    { type: 'confirm',
      name: 'moveon',
      message: 'Continue ?'
    }
  ],
  function (answers) {

    if (!answers.moveon) {
      console.info('Module creation aborted');
      return done();
    }

    var data = {
      Lowername: answers.name.toLowerCase(),
      Nicename: answers.name.charAt(0).toUpperCase() + answers.name.substr(1).toLowerCase(),
      collection: answers.collection
    };
    var destinationFolder = answers.destination;

    var sourcesFiles = answers.files;
    sourcesFiles.forEach( function(file, index) {
      sourcesFiles[index] = srcPath + file;
    });

    gulp.src(sourcesFiles)
      .pipe($.data(data))
      .pipe($.swig())
      .pipe($.rename(function (path) {
        path.dirname += '/' + data.Lowername;
        path.extname = '.js';
        console.info('Creating ' + path.basename + path.extname + ' in ' + destinationFolder + '/' + path.dirname);
      }))
      .pipe(gulp.dest(destinationFolder))
      .on('end', function () {
        console.info('Module ' + data.Nicename + ' created');
        done();
      });
  });
});


gulp.task('module:api', function (done) {
  var srcPath = path.resolve(__dirname + '/lib/includes/modules/');

  if(!fs.existsSync(srcPath)) {
    console.error('The source path was not found (' + srcPath + ').');
    console.error('Maybe you should run build before asking me that...');
    return done();
  }
  let modules = fs.readdirSync(srcPath).sort();

  console.info('');
  console.info('=============================');
  console.info('  Generator api from module');
  console.info('=============================');
  console.info('');

  inquirer.prompt([
    { type: 'list',
      name: 'module',
      choices: modules,
      message: 'Choose the source module',
      default: modules[0]
    },
    { type: 'checkbox',
      name: 'methods',
      message: function(inquirer) {
        var module = inquirer.module;
        return 'What API method to generate for the module ' + module +'?';
      },
      choices: function(inquirer) {
        var module = inquirer.module;
        var Service = require(srcPath + '/' + module + '/Service');
        var service = new Service(null);
        var methods = service.availableMethods;
        return methods;
      },
      default: function(inquirer) {
        var module = inquirer.module;
        var Service = require(srcPath + '/' + module + '/Service');
        var service = new Service(null);
        var methods = service.availableMethods;
        return methods;
      }
    },
    { type: 'confirm',
      name: 'moveon',
      message: 'Continue ?'
    }
  ],
  function (answers) {

    if (!answers.moveon) {
      console.info('Module creation aborted');
      return done();
    }
    console.log('do stuff here');
    return done();
  });
});


