import DatabaseManager from 'DatabaseManager';
import config from 'config/server';

let database = new DatabaseManager(config.db);
export default database;
