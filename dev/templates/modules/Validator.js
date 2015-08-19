import Validator from 'piggy-module/lib/Validator';
import cfg from './config';

export default class {{Nicename}}Validator extends Validator {
  constructor(vo) {
    super(vo);
  }
}

Validator.initFromVoClass({{Nicename}}Validator, cfg.attributes);
