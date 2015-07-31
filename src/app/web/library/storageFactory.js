import Storage from 'piggy-module/lib/Storage/Db';
import db from 'database';

export default function storageFactory(name) {
  let collection = db.getMonkCollection(name);
  return new Storage(collection);
}
