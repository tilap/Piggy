import Vo from 'piggy-module/lib/Vo';
import config from './config';

export default class User extends Vo {
  constructor(data) {
    super(data);
  }
}

Vo.init(User, config.attributes);
