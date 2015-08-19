import Router from 'koa-router';
import controller from '../controllers/statics';

let router = new Router();

router.get('home', '/', controller.home);
router.get('about', '/about', controller.about);
router.get('test', '/test', controller.test);

module.exports = router;
