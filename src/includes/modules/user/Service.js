import Service from 'piggy-module/lib/Service';

export default class UserService extends Service{

  constructor(manager) {
    super(manager);
  }

  getByUsername(username) {
    return this._manager.getByUniqueProperty('username', username);
  }

  getByStrategyToken(strategy, strategyId) {
    return this._manager.getByStrategyToken(strategy, strategyId);
  }

  createUniqueUsername(username) {
    let me = this;
    let usernameBase = username;
    let inc = 0;
    return new Promise((resolve, reject) => {
      setImmediate(function myPromise() {
        return me._manager.getByUniqueProperty('username', username)
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
      });
    });
  }
}
