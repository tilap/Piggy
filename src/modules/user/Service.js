import Service from 'piggy-module/lib/Service';

export default class UserService extends Service {

  constructor(manager) {
    super(manager);
  }

  insertOne(data, source = '') {
    data._source = source;
    data.created_at = new Date();
    data.updated_at = new Date();
    return super.insertOne(data);
  }

  updateOne(id, data) {
    data.updated_at = new Date();
    return super.updateOne(id, data);
  }

  getOneByUsername(username) {
    return this.getOneByUniqueProperty('username', username);
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
