import Router from 'koa-router';
import controller from '../controllers/passport';

import config from 'config/server';
let providers = config.authentification.providers;
let strategies = Object.keys(providers);

let router = new Router();

router.get('login', '/login', controller.login);
router.get('register', '/register', controller.register);

strategies.forEach( medium => {
  router.get('passport.login.' + medium, '/login/:medium/', controller.authentificate);
  router.get('passport.login.' + medium + '.cb', '/login/:medium/callback', controller.authentificateCB);
  router.get('passport.logout', '/logout', controller.logout );
});

router.get('get_token', '/mytoken/', controller.getToken);

module.exports = router;
