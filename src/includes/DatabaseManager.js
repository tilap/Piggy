import monk from 'monk';

export default class DatabaseManager {
  constructor(closeOnSigint = true) {
    this._servers = {};
    this._instances = {};
    this._defaultServer = '';

    if(closeOnSigint) {
      process.on('SIGINT', () => {
        this.closeAllInstances();
      });
    }
  }

  addServer(name, conf) {
    this._servers[name] = conf;
    if(!this.hasDefaultServer()) {
      this.setDefaultServer(name);
    }
  }

  setDefaultServer(name) {
    if(!this.hasServer(name)) {
      throw new Error('Unknwon server "' + name +'"');
    }
    this._defaultServer = name;
  }

  hasServer(name) {
    return Object.keys(this._servers).indexOf(name) > -1;
  }

  hasDefaultServer() {
    return this._defaultServer!=='';
  }

  getServer(name) {
    if(!this.hasServer(name)) {
      throw new Error('Database server ' + name + ' not set');
    }
    return this._servers[name];
  }

  _createInstance(name, config) {
    let db = monk(config);
    this._instances[name] = db;
  }

  _instanceExists(name) {
    return Object.keys(this._instances).indexOf(name) > -1;
  }

  _closeInstance(name) {
    if(!this._instanceExists(name)) {
      return false;
    }
    this._instances[name].close();
    return true;
  }

  closeAllInstances() {
    Object.keys(this._instances).forEach( name => {
      this._closeInstance(name);
    });
  }

  getDb(name) {
    if(!this._instanceExists(name)) {
      let config = this.getServer(name);
      this._createInstance(name, config);
    }

    return this._instances[name];
  }

  getCollection(collection, serverName) {
    serverName = serverName || this._defaultServer;
    return this.getDb(serverName).get(collection);
  }
}
