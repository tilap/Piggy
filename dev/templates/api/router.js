import Router from 'koa-router';
import controller from '../controllers/{{module}}';

let router = new Router();

router.prefix('/{{module}}');

router.get('/', controller.get);
router.get('/:id/', controller.getOneById);
router.post('/', controller.createOne);
router.patch('/:id/', controller.updateOneById);
router.delete('/:id/', controller.deleteOneById);

module.exports = router;
