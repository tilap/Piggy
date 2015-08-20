import Vo from 'piggy-module/lib/Vo';
import config from './config';

export default class Source extends Vo {
  constructor(data) {
    super(data);
  }
}

Vo.init(Source, config.attributes);

