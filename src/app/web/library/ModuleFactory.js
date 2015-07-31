import Storage from 'piggy-module/lib/Storage/Db';
import db from 'database';

export default class ModuleFactory {

  static getManager(module) {
    let Manager = require('modules/' + module + '/Manager');
    let collectionName = module;
    let storage = new Storage(db.getMonkCollection(collectionName));
    return new Manager(storage);
  }

}
