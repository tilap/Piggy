import passport from 'koa-passport';
import logger from 'library/logger';
import PassportExtractor from 'PassportExtractor';
import ModuleFactory from 'library/ModuleFactory';
import config from 'config/main';

const providersConfig = config.authentification.providers;

let strategiesClasses = {};
Object.keys(providersConfig).forEach( medium => {
  strategiesClasses[medium] = require('passport-' + providersConfig[medium].strategy ).Strategy;
});

let availableStrategies = {
  'register': config.authentification.register || [],
  'bind': config.authentification.bind || [],
  'login': config.authentification.login || [],
  'all': [],
};

['register', 'bind', 'login'].forEach( key => {
  availableStrategies[key].forEach( strategy => {
    if (availableStrategies.all.indexOf(strategy) < 0) {
      availableStrategies.all.push(strategy);
    }
  });
});

module.exports.availableStrategies = availableStrategies;

export function registerSerializers() {
  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    return ModuleFactory
      .getServiceInstance('user')
      .then( service => {
        return service.getOneById(id)
          .catch( err => {
            console.error('Passport deserialize user error', err);
            done(err);
          })
          .then( user => {
            done(null, user);
          });
      });
  });
}

export function registerAppStrategies(app) {
  logger.info('Passport available strategies for login: ' + availableStrategies.login.join(', '));
  logger.info('Passport available strategies for register: ' + availableStrategies.register.join(', '));
  logger.info('Passport available strategies for binding: ' + availableStrategies.bind.join(', '));

  availableStrategies.all.forEach( (strategy) => {
    let Strategy = strategiesClasses[strategy];

    // @todo use route instead of hard coded :)
    let strategyConfig = providersConfig[strategy];
    strategyConfig.callbackURL = 'http://pickpic.com:3013/login/' + strategy + '/callback/';
    strategyConfig.returnURL = 'http://pickpic.com:3013/login/' + strategy + '/callback/';

    passport.use( new Strategy(strategyConfig, (token, tokenSecret, profile, done) => {
      return ModuleFactory.getServiceInstance('user')
        .then( userService => {
          return userService.getOneByStrategyAndToken(strategy, profile.id)
            .then( user => {
              // Register
              if (!user && availableStrategies.register.indexOf(strategy) < 0) {
                throw new Error('Cannot use ' + strategy + ' to register');
              }

              // login
              if (user) {
                if (availableStrategies.login.indexOf(strategy) < 0 ) {
                  throw new Error('Cannot use ' + strategy + ' to log in');
                }
                return user;
              }

              // Build user data
              let userData = {};
              let profileData = new PassportExtractor(profile);
              ['username', 'lastname', 'firstname', 'email', 'gender'].forEach( property => {
                if (profileData[property]) {
                  userData[property] = profileData[property];
                }
              });
              userData._auths = {};
              userData._auths[strategy] = profile;
              let username;
              try {
                username = profileData.buildUsername();
              } catch(err) {
                throw new Error('Unable to generate a valid username'); // @todo: generate a unique random one
              }

              return userService.createUniqueUsername(username)
                .catch( err => {
                  console.error('Passport error (userService.generateUniqueUsername)', err);
                  throw err;
                })
                .then(username => {
                  userData.username = username;
                  return userService.createNewOne(userData, strategy);
                })
                .catch( err => {
                  console.error('Passport error (userService.saveOne)', err);
                  throw err;
                })
                .then( user => {
                  return user;
                });
            })
            .catch(err => {
              console.error('error', err);
              done(err);
            })
            .then( user => {
              return done(null, user);
            });
        });
    }));
  });
}

export function initMiddlewares(app) {
  app.use(passport.initialize());
  app.use(passport.session());
}

