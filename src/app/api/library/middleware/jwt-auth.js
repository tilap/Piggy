import jwt from 'jsonwebtoken';
import ModuleFactory from 'library/ModuleFactory';
let userService = ModuleFactory.getServiceInstance('user');

let config = require('config/main');

export default function *(next) {
  // If connected, skip
  if(this.utils.getUser()) {
    return yield next;
  }

  try {
    let user = null;

    if(config.authentification && config.authentification.token) {
      let tokenConfig = config.authentification.token;
      let name = tokenConfig.name;

      if(this.req.headers && this.req.headers[name]) {
        let token = this.req.headers[name];
        let config = {
          algorithm: tokenConfig.algorithm,
          expiresInMinutes: tokenConfig.expiresInMinutes
        };
        let payload = jwt.verify(token, tokenConfig.secret, config);
        user = yield userService.getOneById(payload.id);
      }
    }

    if(user) {
      let p = new Promise( (resolve, reject) => {
        return this.req.login(user, function(err, success) {
          resolve(true);
        });
      });
      yield p;
    }
  }
  catch(err) {
    this.logger.error(err.message);
  }

  return yield next;
}
