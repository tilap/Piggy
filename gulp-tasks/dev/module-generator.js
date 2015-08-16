var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var inquirer = require('inquirer');
var fs = require('fs');

gulp.task('create-module', function (done) {
  var srcPath = config.modules.templates;
  var distPath = config.modules.src;
  var moduleFiles = fs.readdirSync(srcPath).sort();

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
