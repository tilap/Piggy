import Router from 'koa-router';
import userController from '../controllers/api/user';

let router= new Router();

router.prefix('/api/user');

router.get('api.user.list', '/', userController.list);
router.get('api.user.viewById', '/:id/', userController.viewById);

module.exports= router;
