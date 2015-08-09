let env = process.env.NODE_ENV || 'development';

import fs from 'fs';
import deepExtends from 'deep-extend';

import base from './base/main.js';
let file = env + '/main.js';
if (fs.existsSync(__dirname + '/' + file)) {
  let envSpecificConfig = require('./' + file);
  deepExtends(base, envSpecificConfig);
}
module.exports = Object.freeze(base);
