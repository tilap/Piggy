import Router from 'koa-router';
import controller from '../controllers/user';

let router= new Router();

router.prefix('/user');
router.get('user.viewById', '/:id/', controller.viewById);

module.exports= router;
