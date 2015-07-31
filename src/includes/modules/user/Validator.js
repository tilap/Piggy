import Validator from 'piggy-module/lib/Validator';
import cfg from './config';

export default class UserValidator extends Validator {
  constructor(vo) {
    super(vo);
  }
}

Validator.initFromVoClass(UserValidator, cfg.attributes);
