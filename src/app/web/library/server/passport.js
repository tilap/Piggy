import passport from 'koa-passport';

import PassportExtractor from 'PassportExtractor';

import ModuleFactory from 'library/ModuleFactory';
let userManager = ModuleFactory.getManager('user');

let logger = require('library/loggers/common')();
let passportConfig = require('config/main').authentification.providers;

let PassportStrategies= {
  twitter: require('passport-twitter').Strategy,
  facebook: require('passport-facebook').Strategy,
  google: require('passport-google-auth').Strategy
};

let availableStrategies = {
  register: [],
  bind: [],
  login: []
};

Object.keys(PassportStrategies).forEach(strategy => {
  if(passportConfig[strategy]) {
    if(passportConfig[strategy].bind || passportConfig[strategy].register) {
      availableStrategies.login.push(strategy);
    }
    if(passportConfig[strategy].bind) {
      availableStrategies.bind.push(strategy);
    }
    if(passportConfig[strategy].register) {
      availableStrategies.register.push(strategy);
    }
  }
});

module.exports.strategies = availableStrategies;

module.exports.middlewares = function(app) {
  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    return userManager.getByUniqueProperty('_id', id)
      .catch( err => {
        done(err);
      })
      .then( user => {
        done(null, user);
      });
  });

  logger.info('Passport available strategies for login: ' + availableStrategies.login.join(', '));
  logger.info('Passport available strategies for register: ' + availableStrategies.register.join(', '));
  logger.info('Passport available strategies for binding: ' + availableStrategies.bind.join(', '));

  availableStrategies.login.forEach( (strategy) => {

    let strategyConfig = passportConfig[strategy];
    strategyConfig.callbackURL= 'http://pickpic.com:3013/login/' + strategy + '/callback/';
    strategyConfig.returnURL= 'http://pickpic.com:3013/login/' + strategy + '/callback/';

    passport.use( new PassportStrategies[strategy](strategyConfig, (token, tokenSecret, profile, done) => {

      userManager.getByStrategyToken(strategy, profile.id)
        .then(
          user => {
            // login
            if(user) {
              if(availableStrategies.login.indexOf(strategy) <0 ) {
                throw new Error('Cannot use ' + strategy + ' to log in');
              }
              return user;
            }
            // Register
            if(availableStrategies.register.indexOf(strategy) < 0) {
              throw new Error('Cannot use ' + strategy + ' to register');
            }

            user = userManager.getNewVo();

            let profileData = new PassportExtractor(profile);
            ['username', 'lastname', 'firstname', 'email', 'gender'].forEach( property => {
              if(profileData[property]) {
                user[property] = profileData[property];
              }
            });
            user.auths={};
            user.auths[strategy]=profile;

            try {
              user.username = profileData.buildUsername();
            } catch(err) {
              throw new Error('Unable to generate a valid username'); // @todo: generate a unique random one
            }

            return userManager.assumeHasUniqueUsername(user)
              .catch( err => {
                console.error('Passport error (userManager.assumeHasUniqueUsername)', err);
                throw err;
              })
              .then(user => {
                return userManager.saveOne(user);
              })
              .catch( err => {
                console.error('Passport error (userManager.saveOne)', err);
                throw err;
              })
              .then( user => {
                return user;
              });
          },
          err => {
            throw err;
          }
        )
        .catch(err => {
          done(err);
        })
        .then( user => {
          done(null, user);
        });
      }
    ));

  });

  app.use(passport.initialize());
  app.use(passport.session());
};
