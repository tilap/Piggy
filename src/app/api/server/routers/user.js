import Router from 'koa-router';
import controller from '../controllers/user';

let router = new Router();

router.prefix('/user');

router.get('/', controller.get);
router.get('/:id/', controller.getOneById);
router.get('/username/:username/', controller.getOneByUsername);
router.post('/', controller.createOne);
router.patch('/:id/', controller.updateOneById);
router.delete('/:id/', controller.deleteOneById);

module.exports = router;
