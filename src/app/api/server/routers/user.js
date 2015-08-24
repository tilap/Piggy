import Router from 'koa-router';
import controller from '../controllers/user';

let router = new Router();

router.prefix('/user');

router.get('/', controller.get);
router.post('/', controller.insertOne);
// router.delete('/:id/', controller.deleteOneById);
router.delete('/', controller.delete);

router.get('/:id/', controller.getOneById);
router.get('/username/:username/', controller.getOneByUsername);
router.patch('/:id/', controller.updateOneById);

module.exports = router;
