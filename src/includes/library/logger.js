import winston from 'winston';
import humanize from 'humanize';
import cliColor from 'cli-color';
import deepExtend from 'deep-extend';

import config from 'config/main';
let loggerConfig = config.loggers.winston;

let cfg = deepExtend({
  'silly': { 'icon': '→', 'labelColor': 'magenta',     'messageColor': 'magenta'},
  'verbose': { 'icon': '→', 'labelColor': 'blackBright', 'messageColor': 'blackBright'},
  'debug': { 'icon': '→', 'labelColor': 'green',       'messageColor': 'green'},
  'info': { 'icon': '✔', 'labelColor': 'cyan',        'messageColor': 'cyan'},
  'warn': { 'icon': '!', 'labelColor': 'yellow',      'messageColor': 'yellow'},
  'error': { 'icon': '✖', 'labelColor': 'red',         'messageColor': 'red'},
}, loggerConfig.console.colors);

let loggerTransports = [];

// Console transporter
if (loggerConfig.console && loggerConfig.console.enabled) {
  let consoleTransporter = new winston.transports.Console({
    'timestamp': function() {
      return humanize.date('H:i:s');
    },
    'formatter': function(options) {
      let level = options.level.toLowerCase();
      let labelColor = cfg[level].labelColor   ? cfg[level].labelColor   : 'blackBright';
      let textColor  = cfg[level].messageColor ? cfg[level].messageColor : 'red';
      let icon       = cfg[level].icon         ? cfg[level].icon         : ' ';

      let time = options.timestamp();
      let timer = cliColor.green('[') + cliColor.blackBright(time) + cliColor.green(']');

      let message = options.message !== undefined ? options.message : '';
      let extra = options.meta && Object.keys(options.meta).length ?
        '\n\t' + JSON.stringify(options.meta) :
        '';

      let label = cliColor[labelColor](icon + ' [' + level + ']');

      return timer + ' ' + label + ' ' + cliColor[textColor](message) + ' ' + extra;
    },
    'colorize': true,
    'prettyPrint': true,
    'handleExceptions': true,
    'json': false,
    'level': loggerConfig.console.level,
    'maxsize': 5242880, // 5MB
    'maxFiles': 5,
  });

  loggerTransports.push(consoleTransporter);
}

// File transporter
if (loggerConfig.file && loggerConfig.file.enabled) {
  let fileTransporter = new winston.transports.File({
    'handleExceptions': true,
    'json': false,
    'colorize': false,
    'level': loggerConfig.file.level,
    'filename': loggerConfig.file.filename,
  });

  loggerTransports.push(fileTransporter);
}

let w = new winston.Logger({
  'transports': loggerTransports,
});

export default w;
