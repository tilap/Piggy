import Router from 'koa-router';
import controller from '../controllers/me';

let router = new Router();

router.prefix('/me');

router.get('/', controller.whoami);

module.exports = router;
