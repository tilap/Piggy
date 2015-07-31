import Validator from 'includes/modules/Validator';
import Vo from './Vo';

export default class {{Nicename}}Validator extends Validator {
  constructor(vo) {
    super(vo);
  }
}

Validator.initFromVoClass({{Nicename}}Validator, Vo);
