import passport from 'koa-passport';
import logger from 'library/logger';
import PassportExtractor from 'PassportExtractor';

import ModuleFactory from 'library/ModuleFactory';
let userService = ModuleFactory.getService('user');

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
    return userService.getOneById(id)
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

      userService.getOneByStrategyAndToken(strategy, profile.id)
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

            // Build user data
            let userData = {};
            let profileData = new PassportExtractor(profile);
            ['username', 'lastname', 'firstname', 'email', 'gender'].forEach( property => {
              if(profileData[property]) {
                userData[property] = profileData[property];
              }
            });
            userData.auths={};
            userData.auths[strategy]=profile;
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
                return userService.createFromData(userData);
              })
              .catch( err => {
                console.error('Passport error (userService.saveOne)', err);
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
