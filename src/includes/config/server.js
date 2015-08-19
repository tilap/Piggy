import fs from 'fs';
import deepExtends from 'deep-extend';

let env = process.env.NODE_ENV || 'development';
let app = process.env.APP_SLUG || 'web';

let base = require('./base/' + app + '.js');
let file = env + '/' + app + '.js';

if (fs.existsSync(__dirname + '/' + file)) {
  let envSpecificConfig = require('./' + file);
  deepExtends(base, envSpecificConfig);
}
let config = Object.freeze(base);
export default config;
