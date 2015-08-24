var config = require('./../config.js');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');

gulp.task('create-api', function (done) {
  function propertyList(module, excludeId) {
    excludeId =excludeId || false;
    var moduleConfig = require(config.modules.dist + '/' + module + '/config.js');
    var properties = moduleConfig.attributes;
    var propertyList = [];
    Object.keys(properties).forEach( function (key) {
      if(!excludeId || key!=='_id') {
        propertyList.push(key);
      }
    });
    return propertyList;
  }

  var templateFile = config.generators.api.controller.template;
  var distPath = config.generators.api.controller.dist;
  var modules = fs.readdirSync(config.modules.src).sort();

  console.info('');
  console.info('');
  console.info('  =====================================');
  console.info('    Generate an module api controller');
  console.info('  =====================================');
  console.info('');

  inquirer.prompt([
    { type: 'list',
      name: 'module',
      message: 'Which module?',
      choices: modules,
      default: modules[0]
    },
    { type: 'checkbox',
      name: 'properties_create',
      message: 'Create properties',
      choices: function(answers) {
        return propertyList(answers.module);
      },
      default: function(answers) {
        return propertyList(answers.module, true);
      },
    },
    { type: 'checkbox',
      name: 'properties_update',
      message: 'Update properties',
      choices: function(answers) {
        return propertyList(answers.module);
      },
      default: function(answers) {
        return propertyList(answers.module, true);
      },
    },
    { type: 'checkbox',
      name: 'properties_filter',
      message: 'Filters list',
      choices: function(answers) {
        return propertyList(answers.module);
      },
      default: function(answers) {
        return propertyList(answers.module, true);
      },
    }
  ],
  function (answers) {
    var moduleName = answers.module;
    var data = {
      module : moduleName,
      properties_list_create_public : "['" + answers.properties_create.join("', '") + "']",
      properties_list_update_public : "['" + answers.properties_update.join("', '") + "']",
      properties_list_public : "['" + answers.properties_filter.join("', '") + "']"
    };
    var destinationFolder = answers.destination;

    var templateFile = config.generators.api.controller.template;
    var destinationFolder = config.generators.api.controller.dist;
    gulp.src(templateFile)
      .pipe($.data(data))
      .pipe($.swig({defaults: {
        autoescape: false,
        cache: false
      }}))
      .pipe($.rename(function (pathInfo) {
        // pathInfo.dirname += '/' + moduleName;
        pathInfo.basename = moduleName;
        pathInfo.extname = '.js';
        console.info('Create ' + pathInfo.basename + pathInfo.extname + ' in ' + path.resolve(destinationFolder + '/' + pathInfo.dirname));
      }))
      .pipe(gulp.dest(destinationFolder))
      .on('end', function () {
        console.info('=> Api controller "' + moduleName + '"" successfully created');
      });

    templateFile = config.generators.api.router.template;
    destinationFolder = config.generators.api.router.dist;
    gulp.src(templateFile)
      .pipe($.data(data))
      .pipe($.swig({defaults: {
        autoescape: false,
        cache: false
      }}))
      .pipe($.rename(function (pathInfo) {
        pathInfo.basename = moduleName;
        pathInfo.extname = '.js';
        console.info('Create ' + pathInfo.basename + pathInfo.extname + ' in ' + path.resolve(destinationFolder + '/' + pathInfo.dirname));
      }))
      .pipe(gulp.dest(destinationFolder))
      .on('end', function () {
        console.info('=> Api router "' + moduleName + '"" successfully created');
        done();
      });


  });
});
