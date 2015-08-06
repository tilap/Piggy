import Storage from 'piggy-module/lib/Storage/Db';
import db from 'database';

export default class ModuleFactory {

  static getManager(module) {
    let Manager = require('modules/' + module + '/Manager');
    let storage = new Storage(db.getCollection(module));
    return new Manager(storage);
  }

  static getService(module) {
    let Service = require('modules/' + module + '/Service');
    return Service;
  }

  static getServiceInstance(module) {
    let Service = ModuleFactory.getService(module);
    let manager = ModuleFactory.getManager(module);
    return new Service(manager);
  }

}
