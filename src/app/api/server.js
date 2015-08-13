import koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLocale from 'koa-locale';
import koai18n from 'koa-i18n';
import koaSession from 'koa-generic-session';
import KoaMongoStore from 'koa-sess-mongo-store';
import koaCompress from 'koa-compress';
import koaSwig from 'koa-swig';
import sanitizeUri from 'koa-sanitize-uri';
import koaUtils from 'koa-utils';
import ApiBag from 'ApiBag';
import logger from 'library/logger';
import koaRequestLog from 'library/middleware/koa-request-log';
import koaJWTauth from 'library/middleware/jwt-auth';
import koaModuleLoader from 'library/middleware/koa-piggy-module-loader';
import routers from 'routers';
import config from 'config/main';

process.on('SIGINT', () => {
  logger.warn('Api Server stopped');
  process.exit(0);
});

process.on('uncaughtException', err => {
  console.error('Api uncaughtException !');
  console.error(err);
});

const app = koa();
app.on('error', err => logger.error('Api Server error', err) );


if (!config.keys) {
  throw new Error('Please add session secret key in the config file!');
}
app.keys = config.keys;

// Logger (in file & console dep. on config) from controller
app.use(function *(next) {
  this.logger = logger;
  yield next;
});

// Add logs on requests
if (config.loggers.requests) {
  app.use(koaRequestLog);
}

// Force clean uri
app.use(sanitizeUri({
  'ignore': [/^assets\/.*/i, /.*\.(js|html|css|png|jpg|gif)$/i],
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
import {registerSerializers, initMiddlewares} from 'library/middleware/passport';
registerSerializers();
initMiddlewares(app);

// Body parser middleware
app.use(koaBodyParser(config.bodyparser));

// i18n middleware
koaLocale(app, config.i18n.querystring);
app.use(koai18n(app, config.i18n));

app.use(koaJWTauth);
app.use(koaModuleLoader);

// Render middleware
app.context.render = koaSwig(config.view);

// Response compress
app.use(koaCompress());

app.use(function *(next) {
  this.bag = new ApiBag();
  this.renderBag = () => this.body = this.bag.toJson();

  // Error interception for clean response whatever happens
  try {
    yield next;
  } catch(err) {
    logger.error('Api dispatch error: ' + err.message, err);

    this.bag.reset();
    if (this.response.status === 404) {
      this.bag.addError('not found');
    } else {
      this.status = 500;
      this.bag.addError('internal error');
    }
    return this.renderBag();
  }
});

// Routing
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

process.on('SIGINT', function() {
  logger.warn('Server stopped');
  process.exit(0);
});
