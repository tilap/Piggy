export default class ModuleFactory {

  static serviceExists(module) {
    return Object.keys(ModuleFactory._classes.services).indexOf(module) > -1;
  }

  static managerExists(module) {
    return Object.keys(ModuleFactory._classes.managers).indexOf(module) > -1;
  }

  static getServiceInstance(module, context={}) {
    let Service = ModuleFactory.getServiceClass(module);
    return ModuleFactory.getManagerInstance(module)
      .then( manager => {
        let s = new Service(manager);
        s.setFullContext(context);
        return s;
      });
  }

  static getManagerInstance(module) {
    let Manager = ModuleFactory.getManagerClass(module);
    return ModuleFactory.getStorage(module)
      .then( storage => {
        return new Manager(storage);
      });
  }

  static getStorage(module) {
    return dbManager.getCollection(module)
      .then( collection => {
        let storage = new Storage(collection);
        return storage;
      });
  }

  static getServiceClass(module) {
    if (!ModuleFactory.serviceExists(module)) {
      throw new Error('Unable to get service module class ' + module);
    }
    return ModuleFactory._classes.services[module];
  }

  static getManagerClass(module) {
    if (!ModuleFactory.managerExists(module)) {
      throw new Error('Unable to get manager module class ' + module);
    }
    return ModuleFactory._classes.managers[module];
  }
}

let sourceService = require('./modules/source/Service');
let sourceManager = require('./modules/source/Manager');

let moduleClasses = {
  'services': {},
  'managers': {},
};
moduleClasses.services.source = sourceService;
moduleClasses.managers.source = sourceManager;

Object.defineProperty(ModuleFactory, '_classes', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': moduleClasses,
});
