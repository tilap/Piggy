import DatabaseManager from 'DatabaseManager';
import config from 'config/main';

let db = new DatabaseManager();
export default db;

if (config.db) {
  Object.keys(config.db).forEach(name => {
    db.addDBConfig(name, config.db[name]);
  });
}
