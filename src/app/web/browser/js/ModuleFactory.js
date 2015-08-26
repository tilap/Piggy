import Storage from 'piggy-module/lib/Storage/Api';
// import Storage from './ApiStorage';

import UserService from './modules/user/Service';
import UserManager from './modules/user/Manager';

let moduleClasses = {
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

    let storage = new Storage('http://pickpic.com:2223/', module);
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
