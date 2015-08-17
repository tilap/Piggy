var config = require('./../config.js');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');

gulp.task('create-module', function (done) {
  var srcPath = config.modules.templates;
  var distPath = config.modules.src;
  var moduleFiles = fs.readdirSync(srcPath).sort();

  console.info('');
  console.info('');
  console.info('  =====================================');
  console.info('    Generate an empty business module');
  console.info('  =====================================');
  console.info('');
  console.info('  Answer these few questions to generate a business module boilerplate.');
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
      default: function(answers) {
        return answers.name.toLowerCase();
      },
      validate: function(value) {
        return value!=='';
      }
    },
    { type: 'checkbox',
      name: 'files',
      message: 'What to generate?',
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
      message: 'Create the module?'
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
      .pipe($.rename(function (pathInfo) {
        pathInfo.dirname += '/' + data.Lowername;
        pathInfo.extname = '.js';
        console.info('Create ' + pathInfo.basename + pathInfo.extname + ' in ' + path.resolve(destinationFolder + '/' + pathInfo.dirname));
      }))
      .pipe(gulp.dest(destinationFolder))
      .on('end', function () {
        console.info('=> Module ' + data.Nicename + ' successfully created');
        done();
      });
  });
});
