import winston from 'winston';
import humanize from 'humanize';
import cliColor from 'cli-color';
import deepExtend from 'deep-extend';

let config = require('../../config/main').loggers.winston; // @torefactor

export default function() {

  let cfg = deepExtend({
    silly:  { icon: '→', labelColor: 'magenta',     messageColor: 'magenta'},
    verbose:{ icon: '→', labelColor: 'blackBright', messageColor: 'blackBright'},
    debug:  { icon: '→', labelColor: 'green',       messageColor: 'green'},
    info:   { icon: '✔', labelColor: 'cyan',        messageColor: 'cyan'},
    warn:   { icon: '!', labelColor: 'yellow',      messageColor: 'yellow'},
    error:  { icon: '✖', labelColor: 'red',         messageColor: 'red'}
  }, config.console.colors);

  let loggerTransports = [];

  // Console transporter
  if(config.console && config.console.enabled) {

    let consoleTransporter = new (winston.transports.Console)({
      timestamp: function() {
        return humanize.date('H:i:s');
      },
      formatter: function(options) {
        let level = options.level.toLowerCase();
        let labelColor = cfg[level].labelColor   ? cfg[level].labelColor   : 'blackBright';
        let textColor  = cfg[level].messageColor ? cfg[level].messageColor : 'red';
        let icon       = cfg[level].icon         ? cfg[level].icon         : ' ';

        let time = options.timestamp();
        let timer = cliColor.green('[') + cliColor.blackBright(time) + cliColor.green(']');

        let message = options.message!==undefined ? options.message : '';
        let extra = options.meta && Object.keys(options.meta).length ?
          '\n\t' + JSON.stringify(options.meta) :
          '' ;

        let label = cliColor[labelColor](icon + ' [' + level + ']');

        return timer + ' ' + label + ' ' + cliColor[textColor](message) + ' ' + extra;
      },
      colorize: true,
      prettyPrint: true,
      handleExceptions: true,
      json: false,
      level: config.console.level,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    });

    loggerTransports.push(consoleTransporter);
  }

  // File transporter
  if(config.file && config.file.enabled) {
    let fileTransporter = new (winston.transports.File)({
      handleExceptions: true,
      json: false,
      colorize: false,
      level: config.file.level,
      filename: config.file.filename
    });

    loggerTransports.push(fileTransporter);
  }

  return new (winston.Logger)({
    transports: loggerTransports
  });
}
