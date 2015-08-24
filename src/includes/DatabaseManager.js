let MongoClient = require('mongodb').MongoClient;

export default class DBManager {

  constructor(closeOnSigint = true) {
    this._dbConfigs = {};
    this._instances = {};
    this._defaultDB = '';

    if (closeOnSigint) {
      process.on('SIGINT', () => {
        this.closeAllInstances();
      });
    }
  }

  addDBConfig(name, conf) {
    this._dbConfigs[name] = conf;
    if (!this.hasDefaultDBName()) {
      this.setDefaultDBName(name);
    }
  }

  hasDBConfig(name) {
    return Object.keys(this._dbConfigs).indexOf(name) > -1;
  }

  getDBConfig(name) {
    if (!this.hasDBConfig(name)) {
      throw new Error('DB ' + name + ' not set');
    }
    return this._dbConfigs[name];
  }

  setDefaultDBName(name) {
    this._defaultDB = name;
  }

  hasDefaultDBName() {
    return this._defaultDB !== '';
  }

  getDB(name) {
    return new Promise( (resolve, reject) => {
      if (this._instanceExists(name)) {
        return resolve(this._instances[name]);
      }

      let config = this.getDBConfig(name);
      return this._createInstance(name, config)
        .then( instance => {
          this._instances[name] = instance;
          resolve(this._instances[name]);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getCollection(collection, database = null) {
    let dbName = database || this._defaultDB;
    return this.getDB(dbName)
      .then(db => {
        return db.collection(collection);
      })
      .catch(err => {
        throw new Error('DB Collection error ' + err.message);
      });
  }

  closeAllInstances() {
    Object.keys(this._instances).forEach( name => {
      this._closeInstance(name);
    });
  }

  _createInstance(name, config) {
    return new Promise( (resolve, reject) => {
      MongoClient.connect(config, function(err, db) {
        if (err) {
          return reject(err);
        }
        resolve(db);
      });
    });
  }

  _instanceExists(name) {
    return Object.keys(this._instances).indexOf(name) > -1;
  }

  _closeInstance(name) {
    if (!this._instanceExists(name)) {
      return false;
    }
    this._instances[name].close();
    return true;
  }
}
