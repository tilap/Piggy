// node modules
import koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLocale from 'koa-locale';
import koai18n from 'koa-i18n';
import koaStatic from 'koa-static'; // @todo if koa-static-cache is bette?
import koaSession from 'koa-generic-session';
import koaMongoStore from 'koa-sess-mongo-store';
import koaCompress from 'koa-compress';
import koaFlash from 'koa-flash';
import koaSwig from 'koa-swig';
import koaError from 'koa-error';
import sanitizeUri from 'koa-sanitize-uri';
import {Head} from 'piggy-htmldoc';

// local modules
import ViewBag from 'ViewBag';
import koaUtils from 'koa-utils';

// Specific
import logger from 'library/logger';
import redirectOnHtmlStatus from 'koa-redirectOnHtmlStatus';
import koaRequestLog from 'library/middleware/koa-request-log';


let config = require('config/main');
let app= koa();


if (!config.keys) {
  throw new Error('Please add session secret key in the config file!');
}
app.keys = config.keys;

// Logger (in file & console dep. on config) from controller
app.use(function *(next) {
  this.logger = logger;
  yield next;
});

app.use(koaError(config.error));

import {parse as stackParser} from 'springbokjs-errors';
import HtmlStackRenderer from 'springbokjs-errors/lib/HtmlRenderer';
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    // @todo: depend on environment var
    logger.error(stackParser(err).toString());

    if(config.display_error) {
      const htmlStackRenderer = new HtmlStackRenderer();
      this.status = 500;
      this.body=htmlStackRenderer.render(err);
    }
  }
});



// On 401, redirect to login page
app.use(redirectOnHtmlStatus({redirect_url: '/login/'}));

// Add logs on requests
if(config.loggers.requests) {
  app.use(koaRequestLog);
}

// Force clean uri
app.use(sanitizeUri({
  ignore: [/^assets\/.*/i, /.*\.(js|html|css|png|jpg|gif)$/i]
}));

// Session middleware
let sessionConfig = config.session;
if(sessionConfig.mongo) {
  sessionConfig.store = new koaMongoStore({ url: sessionConfig.mongo });
}
app.use(koaSession(sessionConfig));

// Utils
app.use(koaUtils);

// Viewdata
app.use(function *(next) {
  this.viewBag = new ViewBag();
  this.viewBag.setProtected('html', {
    head: new Head()
  });

  this.viewBag.get('html').head.title.queue('Mon appli');
  this.renderView = (file) => this.render('scripts/' + file, this.viewBag);

  yield next;
});

// Passport
require('./library/server/passport').middlewares(app);
app.use(function *(next) {
  this.viewBag.setProtected('currentUser', this.isAuthenticated() ? this.req.user : null);
  yield next;
});

// Body parser middleware
app.use(koaBodyParser(config.bodyparser));

// i18n middleware
koaLocale(app, config.i18n.querystring);
app.use(koai18n(app, config.i18n));

// Static files middleware
app.use(koaStatic(config.static.directory, config.static));

// Flash message middleware
app.use(koaFlash(config.flash));

// Render middleware
app.context.render = koaSwig(config.view);

// Response compress
app.use(koaCompress());

// Routing
// @todo: replace koa-router by a both front/back router (like https://github.com/kieran/barista )
import routers from 'routers';
Object.keys(routers).forEach( id => {
  app.use(routers[id].middleware());
});

// Self app or required
if (!module.parent) {
  let port = config.port || 3000;
  app.listen(port, () => {
    logger.info('Server listening on port %s under %s environment', port, (process.env.NODE_ENV || 'development') );
  });
}
else {
  module.exports=app;
}

process.on('SIGINT', function() {
  logger.warn('Server stopped');
  process.exit(0);
});
