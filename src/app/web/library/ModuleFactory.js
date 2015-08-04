// For the moment, don't use specific storage class.
// Will have to put storage typ in config
// And then load the good storage class

import Storage from 'piggy-module/lib/Storage/Db';
import db from 'database';

export default class ModuleFactory {

  // static getStorage(module) {
  //   let Storage = require('modules/' + module + '/Storage/Db');
  //   return new Storage(db.getCollection(module));
  // }

  static getManager(module) {
    let Manager = require('modules/' + module + '/Manager');
    let storage = new Storage(db.getCollection(module));
    // let storage = ModuleFactory.getStorage(module);
    return new Manager(storage);
  }

  static getService(module) {
    let Service = require('modules/' + module + '/Service');
    let manager = ModuleFactory.getManager(module);
    return new Service(manager);
  }

}
