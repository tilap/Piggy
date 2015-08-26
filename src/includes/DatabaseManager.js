let MongoClient = require('mongodb').MongoClient;

export default class DBManager {

  constructor(config) {
    this._instance = null;
    this._config = config;
  }

  getCollection(collection) {
    return this.getDB()
      .then(db => {
        return db.collection(collection);
      })
      .catch(err => {
        throw new Error('DBManager error ' + err.message);
      });
  }

  getDB() {
    return new Promise( (resolve, reject) => {
      if (this._instance !== null) {
        return resolve(this._instance);
      }
      MongoClient.connect(this._config, (err, db) => {
        if (err) {
          return reject(err);
        }
        this._instance = db;
        return resolve(this._instance);
      });
    });
  }
}
