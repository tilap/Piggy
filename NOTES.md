# What's done

Here's what I've done - will probably be refactor while learning new things :)

- gulp tasks
- es6 transpilation
- code base structure
- configuration by environment
- authentification with 3rd party services via passport
- logger for request, debug and code
- business module: a set of base class that can be extended with Object Manager, VO, Storage...
- i18n
- some homemade middlewares
- Makefile

I don't work on frontend yet.

## Code folders

- **lib**: generated src once transpiled / cleaned
- **locales**: translations
- **logs**
- **src** all the sources
  - app: application specific code
    - controllers
    - library: specific stuff for the app (middleware, helpers, ...)
    - modules: business models
    - routers
    - views
      - layouts
  - config
  - includes
    - common: generic lib, class, middlewares I can use in others projets
- **public** for static public files

### Environments & config

The app config is done in ```src/config```. It comes with a default base config, that can be extended. The env folder picked for the config is based on the NODE_ENV.


## Working on...

### WIP


### Todo

- replace the linter: jshint => eslint (better es6 support)
- modules: manage the required option for properties
- test JSDoc: not sure it's good for a whole project
- have a look at shrinkwrap for packages versions

### Ideas

- find a good way to have a url generator based on route. The koa one won't work fin on front...
- Package the stuffs located in src/includes
- Modules: Scaffolding
- Modules: check cast on set
- Modules: add sanitizer value options
- Translation: parser to get all the translations from the code and make sure the translation file has everything possible
