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

// Specific
import commonLogger from 'library/loggers/common';
import redirectOnHtmlStatus from 'koa-redirectOnHtmlStatus';
import requestLogger from 'library/loggers/request';


let config = require('config/main');
let logger = commonLogger();
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

// On 401, redirect to login page
app.use(redirectOnHtmlStatus({redirect_url: '/login/'}));

// Add logs on requests
if(config.loggers.requests) {
  let logReq = requestLogger();
  app.use(logReq);
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

// Viewdata
app.use(function *(next) {
  this.viewBag = new ViewBag();
  this.viewBag.setProtected('html', {
    head: new Head()
  });

  this.viewBag.get('html').head.title.queue('Mon appli');
  this.renderView = (file) => this.render('scripts/' + file, this.viewBag.data);

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

// Get param helper
app.use(function *(next) {
  let queryStr = this.request.querystring;
  let params = {}, temp;

  if(queryStr!=='' && queryStr.split('&').length > 0) {
    queryStr.split('&').forEach( query => {
      temp = query.split('=');
      params[temp[0]] = decodeURIComponent(temp[1]) || '';
    });
  }

  this.request.args = params;
  yield next;
});

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
