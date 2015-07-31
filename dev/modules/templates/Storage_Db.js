import DbStorage from 'includes/modules/Storage/Db';

export default class UserStorage extends DbStorage {
  constructor(collection, name) {
    super(collection, name);
  }
}
