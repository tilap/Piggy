import Router from 'koa-router';
import controller from '../controllers/user';

let router = new Router();

router.prefix('/user');

router.get( '/', controller.list);
router.get( '/new/', controller.new);
router.post('/new/', controller.new);
router.get( '/view/:id/', controller.viewById);
router.get( '/view/u/:username/', controller.viewByUsername);
router.get( '/edit/:id/', controller.edit);
router.post('/edit/:id/', controller.edit);
router.get( '/delete/:id/', controller.deleteById);

module.exports = router;
