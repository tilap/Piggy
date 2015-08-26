import db from 'database';
import Storage from 'piggy-module/lib/Storage/Mongo';

import SourceService from './../../modules/source/Service';
import SourceManager from './../../modules/source/Manager';
import UserService from './../../modules/user/Service';
import UserManager from './../../modules/user/Manager';

let moduleClasses = {
  'source': {
    'service': SourceService,
    'manager': SourceManager,
  },
  'user': {
    'service': UserService,
    'manager': UserManager,
  },
};

export default class ModuleFactory {

  static getServiceInstance(module, context = {}) {
    if (!ModuleFactory.hasModule(module)) {
      throw new Error('Unable to get service module class ' + module);
    }

    let Service = ModuleFactory._classes[module].service;
    let Manager = ModuleFactory._classes[module].manager;

    let storage = new Storage(db, module);
    let manager = new Manager(storage);
    let service = new Service(manager);
    service.setFullContext(context);
    return service;
  }

  static hasModule(module) {
    return Object.keys(ModuleFactory._classes).indexOf(module) > -1;
  }
}

Object.defineProperty(ModuleFactory, '_classes', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': moduleClasses,
});



// import MongoStorage from 'piggy-module/lib/Storage/Mongo';
// import dbManager from 'database';
// import fs from 'fs';
// import path from 'path';

// export default class ModuleFactory {

//   static serviceExists(module) {
//     return Object.keys(ModuleFactory._classes.services).indexOf(module) > -1;
//   }

//   static managerExists(module) {
//     return Object.keys(ModuleFactory._classes.managers).indexOf(module) > -1;
//   }

//   static getServiceInstance(module, context = {}) {
//     let Service = ModuleFactory.getServiceClass(module);
//     return ModuleFactory.getManagerInstance(module)
//       .then( manager => {
//         let s = new Service(manager);
//         s.setFullContext(context);
//         return s;
//       });
//   }

//   static getManagerInstance(module) {
//     let Manager = ModuleFactory.getManagerClass(module);
//     return ModuleFactory.getStorage(module)
//       .then( storage => {
//         return new Manager(storage);
//       });
//   }

//   static getStorage(module) {
//     return dbManager.getCollection(module)
//       .then( collection => {
//         let storage = new MongoStorage(collection);
//         return storage;
//       });
//   }

//   static getServiceClass(module) {
//     if (!ModuleFactory.serviceExists(module)) {
//       throw new Error('Unable to get service module class ' + module);
//     }
//     return ModuleFactory._classes.services[module];
//   }

//   static getManagerClass(module) {
//     if (!ModuleFactory.managerExists(module)) {
//       throw new Error('Unable to get manager module class ' + module);
//     }
//     return ModuleFactory._classes.managers[module];
//   }
// }

// let moduleClasses = {
//   'services': {},
//   'managers': {},
// };

// const serviceDirectory = path.normalize( __dirname + '/../../modules/');
// let fileInServiceDirectory = fs.readdirSync(serviceDirectory);
// fileInServiceDirectory.forEach( file => {
//   let serviceFile = serviceDirectory + file + '/Service.js';
//   let managerFile = serviceDirectory + file + '/Manager.js';
//   if (fs.existsSync(managerFile)) {
//     moduleClasses.managers[file] = require(managerFile);
//   }
//   if (fs.existsSync(serviceFile)) {
//     moduleClasses.services[file] = require(serviceFile);
//   }
// });

// Object.defineProperty(ModuleFactory, '_classes', {
//   'enumerable': false,
//   'writable': false,
//   'configurable': false,
//   'value': moduleClasses,
// });
