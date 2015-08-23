// import ApiStorage from 'piggy-module/lib/Storage/Api';
import ApiStorage from './ApiStorage';

import SourceService from './modules/source/Service';
import SourceManager from './modules/source/Manager';
import UserService from './modules/user/Service';
import UserManager from './modules/user/Manager';

let moduleClasses = {
  'source': {
    'service': SourceService,
    'manager': SourceManager,
  },
  'user': {
    'service': UserService,
    'manager': UserManager,
  }
};

export default class ModuleFactory {

  static getServiceInstance(module, context={}) {
    if (Object.keys(ModuleFactory._classes).indexOf(module) < 0) {
      throw new Error('Unable to get service module class ' + module);
    }

    let Service = ModuleFactory._classes[module].service;
    let Manager = ModuleFactory._classes[module].manager;
    let collection = 'http://pickpic.com:2223/' + module + '/';

    let storage = new ApiStorage(collection);

    let manager = new Manager(storage);
    let service = new Service(manager);
    service.setFullContext(context);
    return service;
  }
}

Object.defineProperty(ModuleFactory, '_classes', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': moduleClasses,
});
