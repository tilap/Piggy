import Router from 'koa-router';
import controller from '../controllers/passport';

let providers = require('config/main').authentification.providers;

let router= new Router();
let strategies = Object.keys(providers);

router.get('login', '/login', controller.login);
router.get('register', '/register', controller.register);

strategies.forEach( medium => {
  router.get('passport.login.' + medium, '/login/:medium/', controller.authentificate);
  router.get('passport.login.' + medium + '.cb', '/login/:medium/callback', controller.authentificateCB);
  router.get('passport.logout', '/logout', controller.logout );
});

router.get('get_token', '/mytoken/', controller.getToken);

module.exports= router;
