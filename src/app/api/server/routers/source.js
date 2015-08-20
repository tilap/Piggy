import Router from 'koa-router';
import controller from '../controllers/source';

let router = new Router();

router.prefix('/source');

router.get('/', controller.get);
router.get('/:id/', controller.getOneById);
router.post('/', controller.createOne);
router.patch('/:id/', controller.updateOneById);
router.delete('/:id/', controller.deleteOneById);

module.exports = router;
