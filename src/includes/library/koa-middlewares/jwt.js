/*
 * Automatically log a user if jwt header is provided
 */

import jwt from 'jsonwebtoken';
import initializeService from 'library/ServiceInitializer';
import config from 'config/server';
let userService = initializeService('user');

export default function *(next) {
  // If connected, skip
  if (this.context.get('auth').isConnected()) {
    return yield next;
  }

  try {
    let user = null;

    if (config.authentification && config.authentification.token) {
      let tokenConfig = config.authentification.token;
      let name = tokenConfig.name;

      if (this.req.headers && this.req.headers[name]) {
        let token = this.req.headers[name];
        let config = {
          'algorithm': tokenConfig.algorithm,
          'expiresInMinutes': tokenConfig.expiresInMinutes,
        };
        let payload = jwt.verify(token, tokenConfig.secret, config);
        user = yield userService.getOneById(payload.id);
      }
    }

    if (user) {
      let p = new Promise( (resolve) => {
        return this.req.login(user, function() {
          resolve(true);
        });
      });
      yield p;
    }
  } catch(err) {
    this.logger.error(err.message);
  }

  return yield next;
}
