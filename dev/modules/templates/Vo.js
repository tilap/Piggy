import Vo from 'piggy-module/lib/Vo';
import config from './config';

export default class {{Nicename}} extends Vo {
  constructor(data) {
    super(data);
  }
}

Vo.init({{Nicename}}, config.attributes);

