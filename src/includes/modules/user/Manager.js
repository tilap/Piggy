import Manager from 'piggy-module/lib/Manager';
import ManagerError from 'piggy-module/lib/Errors';
import ItemVo from './Vo';
import ItemValidator from './Validator';

export default class UserManager extends Manager {

  constructor(storage) {
    super(storage);
  }

  getByStrategyToken(strategy, strategyId) {
    let criteria = {};
    criteria['auths.' + strategy + '.id'] = strategyId;

    return new Promise( (resolve) => {
      this.get(criteria).then( users => {
        switch(users.length) {
          case 0:
            return resolve(null);
          case 1:
            return resolve(users[0]);
          default:
            throw new ManagerError('Multiple results for getByStrategyToken method');
        }
      });
    });
  }

  assumeHasUniqueUsername(vo) {
    let me = this;
    let usernameBase = vo.username;
    let inc = 0;

    return new Promise((resolve, reject) => {
      setImmediate(function myPromise() {
        return me.getByUniqueProperty('username', vo.username)
          .then( result => {
            if (result!==null) {
              inc++;
              vo.username = usernameBase + inc;
              setImmediate(myPromise);
            } else {
              resolve(vo);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }

}

Manager.init(UserManager, ItemVo, ItemValidator);
