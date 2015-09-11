import koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLocale from 'koa-locale';
import koai18n from 'koa-i18n';
import koaSession from 'koa-generic-session';
import KoaMongoStore from 'koa-sess-mongo-store';
import koaCompress from 'koa-compress';
import koaSwig from 'koa-swig';
import cors from 'kcors';
import koaUtils from 'koa-utils';
import ApiBag from 'ApiBag/Bag';
import logger from 'library/logger';
import koaJWTauth from 'library/koa-middlewares/jwt';
import koaAuth from 'library/koa-middlewares/auth';
import koaContext from 'library/koa-middlewares/context';
import moduleLoader from 'library/koa-middlewares/module-loader';
import routers from 'routers';
import config from 'config/server';

process.on('SIGINT', () => {
  logger.warn('Api Server stopped');
  process.exit(0);
});

const app = koa();
app.on('error', err => {
  logger.error('Api Server error: %s', err.message);
  logger.error('Error stack: %s', err.stack);
});

app.keys = config.keys;

// Cross domain authorization
app.use(cors());

// Logger (in file & console dep. on config) from controller
app.use(function *(next) {
  this.logger = logger;
  yield next;
});

// Session middleware
let sessionConfig = config.session;
if (sessionConfig.mongo) {
  sessionConfig.store = new KoaMongoStore({ 'url': sessionConfig.mongo });
}
app.use(koaSession(sessionConfig));

// Utils
app.use(koaUtils);

// Passport
import {registerSerializers, initMiddlewares} from 'library/koa-middlewares/passport';
registerSerializers();
initMiddlewares(app);

// Body parser middleware
app.use(koaBodyParser(config.bodyparser));

// i18n middleware
koaLocale(app, config.i18n.querystring);
app.use(koai18n(app, config.i18n));

app.use(koaContext('api'));
app.use(moduleLoader);
app.use(koaAuth);
app.use(koaJWTauth);

// Render middleware
app.context.render = koaSwig(config.view);

// Response compress
app.use(koaCompress());

app.use(function *(next) {
  this.bag = new ApiBag();
  this.renderBag = () => this.body = this.bag.toJson();

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




import initializeService from 'library/ServiceInitializer';
import jwt from 'jsonwebtoken';

// Socket io
let server = require('http').Server(app.callback());
let io = require('socket.io')(server);


io.use(function(socket, next) {
  // console.log(socket.client.request.headers);

  console.log('cookies =>=>=> ', socket.request.headers.cookie);
  next();
  /*
  let jwtToken = socket.handshake.query.token || '';

  if (jwtToken && config.authentification && config.authentification.token) {

    let tokenConfig = config.authentification.token;
    let jwtcfg = {
      'algorithm': tokenConfig.algorithm,
      'expiresInMinutes': tokenConfig.expiresInMinutes,
    };
    let payload = jwt.verify(jwtToken, tokenConfig.secret, jwtcfg);
    let userService = initializeService('user');
    userService.getOneById(payload.id)
      .then( user => {
        console.log('user found');
        socket.user = user;
        next();
      })
      .catch(err => {
        next();
      });

    next();
  }
  else {
    next();
  }
  */
});

io.on('connection', (socket) => {
  console.log('user enter socket');
  // console.log(socket.context);

  socket.on('testamoua', () => {
    console.log('useless test');
  });

  socket.on('disconnect', () => {
    console.log('user exit socket');
  });
});







let port = config.port || 3000;
server.listen(port);
// // Self app or required
// if (!module.parent) {
//   let port = config.port || 3000;
//   app.listen(port, () => {
//     logger.info('Server listening on port %s under %s environment', port, process.env.NODE_ENV || 'development' );
//   });
// } else {
//   module.exports = app;
// }
