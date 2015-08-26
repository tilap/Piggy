import Router from 'koa-router';
import controller from '../controllers/user';

let router = new Router();

router.prefix('/source');

router.get('/', controller.get);
router.get('/:id/', controller.getOneById);
router.post('/', controller.insertOne);
router.patch('/:id/', controller.updateOneById);
router.delete('/', controller.deleteMany);

module.exports = router;
