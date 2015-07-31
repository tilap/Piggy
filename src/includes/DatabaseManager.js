import monk from 'monk';

/**
 * Multidatabase config manager to get Monk and Monk collection with ease
 */
export default class DatabaseManager {
  constructor() {
    this._servers = {};
    this._instances = {};
    this._defaultServer = '';
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

  _createInstance(name, instance) {
    this._instances[name] = instance;
  }

  _instanceExists(name) {
    return Object.keys(this._instances).indexOf(name) > -1;
  }

  getMonk(name) {
    if(!this._instanceExists(name)) {
      let config = this.getServer(name);
      this._createInstance(name, monk(config));
    }

    return this._instances[name];
  }

  getMonkCollection(collection, serverName) {
    serverName = serverName || this._defaultServer;
    return this.getMonk(serverName).get(collection);
  }
}
