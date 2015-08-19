import Router from 'koa-router';
import controller from '../controllers/statics';

let router = new Router();

router.get('home', '/', controller.home);
router.get('about', '/about', controller.about);

module.exports = router;
