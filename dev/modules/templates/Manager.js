import Manager from 'includes/modules/Manager';
import ManagerError from 'includes/modules/Errors/ManagerError';
import ItemVo from './Vo';
import ItemValidator from './Validator';
import moduleConfig from './config';

import ItemDbStorage from './Storage_Db';
import db from 'app/library/database';
let collection = db.getMonkCollection(moduleConfig.collection);
let storage = new ItemDbStorage(collection, moduleConfig.collection);

export default class {{Nicename}}Manager extends Manager {
  constructor() {
    super();
  }
}

Manager.init({{Nicename}}Manager, ItemVo, ItemValidator, storage);
