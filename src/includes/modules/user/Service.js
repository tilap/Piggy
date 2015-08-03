import Service from 'piggy-module/lib/Service';

export default class UserService extends Service{

  constructor(manager) {
    super(manager);
  }

  getOneByUsername(username) {
    return this._manager.getByUniqueProperty('username', username);
  }

  getOneByStrategyAndToken(strategy, token) {
    return this._manager.getByStrategyToken(strategy, token);
  }

  OldcreateUniqueUsername(username) {
    let usernameBase = username;
    let inc = 0;
    return new Promise((resolve, reject) => {
      setImmediate(function myPromise() {
        return this._manager.getByUniqueProperty('username', username)
          .then( result => {
            if (result!==null) {
              inc++;
              username = usernameBase + inc;
              setImmediate(myPromise);
            } else {
              resolve(username);
            }
          })
          .catch(err => {
            reject(err);
          });
      }.bind(this));
    });
  }

  async createUniqueUsername(username) {
    let usernameBase = username;
    let inc = 0;

    while (true) {
      let result = await this._manager.getByUniqueProperty('username', username);
      if (result === null) {
        return username;
      }
      inc++;
      username = usernameBase + inc;
    }
  }
}
