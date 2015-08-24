import Manager from 'piggy-module/lib/Manager';
import ItemVo from './Vo';
import ItemValidator from './Validator';

export default class SourceManager extends Manager {
  constructor(storage) {
    super(storage);
  }
}

Manager.init(SourceManager, ItemVo, ItemValidator);
