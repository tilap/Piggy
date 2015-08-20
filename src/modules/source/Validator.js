import Validator from 'piggy-module/lib/Validator';
import cfg from './config';

export default class SourceValidator extends Validator {
  constructor(vo) {
    super(vo);
  }
}

Validator.initFromVoClass(SourceValidator, cfg.attributes);
