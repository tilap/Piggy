# NOTES

_Just to remember what I did and next steps_

## What's in?

### Basic stack

- simple gulp tasks to clean, reset, build the app/api
- ENV var easy override
- configuration by environment (development, staging, production)
- Makefile for quick tasks
- es6 transpilation with babel over gulp task (build and watch)
- logger for request, debug and code
- i18n
- ioJS

### App
- koa utils middleware
- authentification with 3rd party services via passport
- user module
- gulp tasks for interactive module creation
- FlashMessage better formating (FlashMessage class for levels that make sense)
- PassportDataExtractor: just a helper to get clean data or build some one from any remote (4ever wip)
- ViewBag

### Api
- basic api stack
- ApiBag and ApiResponse
- Global error catcher

### Side

Some stuff coded for this app need but that are generic (so release as standelone packages on npm)

- [piggy-module](https://www.npmjs.com/package/piggy-module), a basic business module: service, manager, vo, validator
- [piggy-htmldoc](https://www.npmjs.com/package/piggy-htmldoc), helper to build standard and easy to evolve html stuff (header/footer)
- [koa-sanitize-uri](https://www.npmjs.com/package/koa-sanitize-uri) based on [piggy-sanitize-uri](https://www.npmjs.com/package/piggy-sanitize-uri) to have cleaned uri

## Next: (?)

- [jwt](https://github.com/auth0/node-jsonwebtoken) for authentification on api call => cleaner and will allow to remove ugly passport middleware on API
- replace the linter: jshint => eslint (better es6 support)
- Shrinkwrap for packages versions?
- Change router to make it available with ease on frontend ?
- translation: find a way to get all the translation in code
- JSDoc ? Maybe just on modules? On API?
- Basic unit testing, at least on API?

DO NOT work on frontend before a clean enough back :)
