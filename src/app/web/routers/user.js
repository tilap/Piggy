import Router from 'koa-router';
import controller from '../controllers/user';

let router= new Router();

router.prefix('/user');

router.get('user.list', '/', controller.list);
router.post('/', controller.listaction);
router.get('user.new', '/new/', controller.new);
router.post('/new/', controller.new);
router.get('user.viewById', '/view/:id/', controller.viewById);
router.get('user.viewByUsername', '/view/u/:username/', controller.viewByUsername);
router.get('user.edit', '/edit/:id/', controller.edit);
router.post('/edit/:id/', controller.edit);
router.get('user.delete', '/delete/:id/', controller.deleteById);

module.exports= router;
