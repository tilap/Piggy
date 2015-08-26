import Manager from 'piggy-module/lib/Manager';
import ItemVo from './Vo';
import ItemValidator from './Validator';


export default class {{Nicename}}Manager extends Manager {
  constructor(storage) {
    super(storage);
  }
}

Manager.init({{Nicename}}Manager, ItemVo, ItemValidator);
