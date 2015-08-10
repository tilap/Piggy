/*
 * Overide process env from flat file
 * Make it easy for dev environment. However, shouldn't be used for prod.
 */
import fs from 'fs';

module.exports = function(env) {
  env = env || (process.env.NODE_ENV || 'development');
  let file = env + '/env-override.js';
  if (fs.existsSync(__dirname + '/' + file)) {
    let envOverride = require('./' + file);
    Object.keys(envOverride).forEach( key => {
      process.env[key] = envOverride[key];
    });
    console.info('Environment variables override: ' + Object.keys(envOverride).join(', '));
    return true;
  }
  return false;
};
