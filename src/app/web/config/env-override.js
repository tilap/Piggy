/*
 * Overide process env from flat file
 * Make it easy for dev environment. However, shouldn't be used for prod.
 * @usage require('config/env-override')();
 */
import fs from 'fs';

module.exports = function(env) {

  env = env || (process.env.NODE_ENV || 'development');

  let envOverrideConfigFile = './src/app/web/config/environment/' + env + '/env-override.json';

  if(fs.existsSync(envOverrideConfigFile)) {

    let envOverride = {};
    envOverride = fs.readFileSync(envOverrideConfigFile, 'utf-8');
    envOverride = JSON.parse(envOverride);

    Object.keys(envOverride).forEach(function (key) {
      process.env[key] = envOverride[key];
    });
    console.info('Environment variables override: ' + Object.keys(envOverride).join(', '));

    return true;
  }
  return false;
};
