import Vo from 'includes/modules/Vo';

import cfg from './config';

export default class {{Nicename}} extends Vo {
  constructor(data) {
    super(data);
  }
}

Vo.init({{Nicename}}, cfg.attributes);
