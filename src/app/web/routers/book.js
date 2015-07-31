import Router from 'koa-router';
import controller from '../controllers/book';

let router= new Router();

router.prefix('/book');

router.get('book.list', '/', controller.list);
router.post('/', controller.listaction);
router.get('book.new', '/new/', controller.new);
router.post('/new/', controller.new);
router.get('book.viewById', '/view/:id/', controller.viewById);
router.get('book.edit', '/edit/:id/', controller.edit);
router.post('/edit/:id/', controller.edit);
router.get('book.delete', '/delete/:id/', controller.deleteById);

module.exports= router;
