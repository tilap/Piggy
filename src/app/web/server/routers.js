import fs from 'fs';

let routers = {};

let routerFiles = fs.readdirSync(__dirname + '/routers');
routerFiles.forEach( file => {
  let ext = file.substring(file.length - 3, file.length);
  if (ext === '.js') {
    let key = file.replace('.js', '');
    routers[key] = require('./routers/' + file);
  }
});

export default routers;
