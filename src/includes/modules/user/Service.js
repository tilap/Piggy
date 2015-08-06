import Service from 'piggy-module/lib/Service';

export default class UserService extends Service{

  constructor(manager) {
    super(manager);
  }

  getOneByUsername(username) {
    return this._manager.getOneByUsername(username);
  }

  getOneByStrategyAndToken(strategy, token) {
    return this._manager.getByStrategyToken(strategy, token);
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
