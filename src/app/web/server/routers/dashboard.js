import Router from 'koa-router';
import controller from '../controllers/dashboard';

let router = new Router();

router.prefix('/dashboard');

router.get('dashboard.user', '/users', controller.users);

module.exports = router;
