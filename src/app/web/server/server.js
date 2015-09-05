import koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLocale from 'koa-locale';
import koai18n from 'koa-i18n';
import koaStatic from 'koa-static'; // @todo see if koa-static-cache is bette?
import koaSession from 'koa-generic-session';
import KoaMongoStore from 'koa-sess-mongo-store';
import koaCompress from 'koa-compress';
import koaFlash from 'koa-flash';
import koaSwig from 'koa-swig';
import koaError from 'koa-error';
import sanitizeUri from 'koa-sanitize-uri';
import logger from 'library/logger';
import {Head} from 'piggy-htmldoc';
// import ElementBase from 'piggy-htmldoc/lib/ElementBase';
import ViewBag from 'ViewBag';
import koaUtils from 'koa-utils';
import koaContext from 'library/koa-middlewares/context';
import koaAuth from 'library/koa-middlewares/auth';
import moduleLoader from 'library/koa-middlewares/module-loader';
import {registerSerializers, registerAppStrategies, initMiddlewares} from 'library/koa-middlewares/passport';
import redirectOnHtmlStatus from 'koa-redirectOnHtmlStatus';
import config from 'config/server';
import appConfig from 'config/app';

process.on('SIGINT', () => {
  logger.warn('Web Server stopped');
  process.exit(0);
});

const app = koa();
app.on('error', err => {
  logger.error('Web Server error: %s', err.message);
  logger.error('Error stack: %s', err.stack);
});

app.keys = config.keys;

// Logger (in file & console dep. on config) from controller
app.use(function *(next) {
  this.logger = logger;
  yield next;
});

app.use(koaError(config.error));

// On 401, redirect to login page
app.use(redirectOnHtmlStatus({
  'status_code': 401,
  'redirect_url': '/login/',
  'redirect_name': 'redirect',
  'message_name': 'message',
  'accepts': 'html',
}));


// Force clean uri
app.use(sanitizeUri({
  'ignore': [/^assets\/.*/i, /.*\.(js|html|css|png|jpg|gif|ico|js.map)$/i],
}));

// Session middleware
let sessionConfig = config.session;
if (sessionConfig.mongo) {
  sessionConfig.store = new KoaMongoStore({ 'url': sessionConfig.mongo });
}
app.use(koaSession(sessionConfig));

// Utils
app.use(koaUtils);

// Passport
registerSerializers();
registerAppStrategies(app);
initMiddlewares(app);

app.use(koaContext('backoffice'));
app.use(moduleLoader);
app.use(koaAuth);

// View stuff
app.use(function *(next) {
  // Viewbag initialization
  this.viewBag = new ViewBag();
  this.viewBag.setProtected('html', {
    'head': new Head("\n  "),
  });
  this.viewBag.setProtected('context', this.context);
  this.viewBag.setProtected('app', appConfig);

  this.viewBag.get('html').head
    .siteTitle(appConfig.name)
    .setDescription('Une super description')
    .setCharset('UTF-8')
    .setLocale('fr-FR')
    .setCanonical('http://tralala.com/pouet/')
    .addDnsPrefetch('http://pouetpouet.com')
    .addDnsPrefetch('http://pouetpouet2.com');

  // Helper
  this.renderView = (file) => this.render('scripts/' + file, this.viewBag);

  yield next;
});


app.use(koaBodyParser(config.bodyparser));

koaLocale(app, config.i18n.querystring);
app.use(koai18n(app, config.i18n));

app.use(koaStatic(config.static.directory, config.static));

app.use(koaFlash(config.flash));

app.context.render = koaSwig(config.view);

app.use(koaCompress());

// Routing
import routers from 'routers';
Object.keys(routers).forEach( id => {
  app.use(routers[id].middleware());
});

// Self app or required
if (!module.parent) {
  let port = config.port || 3000;
  app.listen(port, () => {
    logger.info('Server listening on port %s under %s environment', port, process.env.NODE_ENV || 'development' );
  });
} else {
  module.exports = app;
}
