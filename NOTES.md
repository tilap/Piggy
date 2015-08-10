# NOTES

_Just to remember what I did and next steps_

## What's in?

### Basic stack

- [Makefile](https://github.com/tilap/piggy/blob/master/Makefile) for quick tasks
- Simple [gulp tasks](https://github.com/tilap/piggy/blob/master/gulpfile.js) to clean, reset, build the app/api
- ENV var easy override
- Configuration by environment (development, staging, production)
- Es6 transpilation with babel over gulp task (build and watch)
- [ESLint](https://github.com/tilap/piggy/blob/master/.eslintrc)
- Logger for request, debug and code
- i18n
- [ioJS](https://iojs.org/fr/)

### App
- Authentification
  - 3rd party services via passport
  - Basic user buiness module
  - PassportDataExtractor: a basic helper to get clean data or build some one from any passport remote dataset (4ever wip)
- ViewBag to store data (allow protected ones to avoid overriding them)
- A set of koa utils via a middleware
- A better FlashMessage formating (FlashMessage class with message levels that make sense)
- Gulp tasks for interactive module creation

### Api
- Authentification
  - via [jwt](https://github.com/auth0/node-jsonwebtoken)
  - based on PassportJS for consistency
- basic api stack with CRUD for the user module
- ApiBag and ApiResponse to store and output data in a consistent format
- Global error catcher

### Side stuff

Some stuff coded for this app need but that are generic (so release as standelone packages on npm)

- [piggy-module](https://www.npmjs.com/package/piggy-module), a basic business module: service, manager, vo, validator that can easily be extended and customizable to get consistent code
- [piggy-htmldoc](https://www.npmjs.com/package/piggy-htmldoc), a helper to build standard and easy to evolve html stuff (header/footer)
- [koa-sanitize-uri](https://www.npmjs.com/package/koa-sanitize-uri) based on [piggy-sanitize-uri](https://www.npmjs.com/package/piggy-sanitize-uri) to have cleaned and consistent uri

## Next: (?)

- **Shrinkwrap** for packages versions?
- **Translation**: find a way to get all the translation in code (and see if really usefull...)
- **JSDoc**? Maybe just on modules? On API?
- **Package dependancies security** with ESP ?
- **Unit testing** (mocha and so on), at least on API?
- **CircleCI** ?
- **Babel** config in a .babelrc file?
- **Api discovering** such like [Google Api discovering](https://developers.google.com/apis-explorer/#p/discovery/v1/discovery.apis.getRest?api=urlshortener&version=v1&_h=1&) ? => hard coz of format return description for automatied. Think of doc commenting maybe.

DO NOT work on frontend before a clean enough back :)
- **Router**: change to make it available with ease on frontend?
- **Webpack**: ?
- **JSPM**: ?
