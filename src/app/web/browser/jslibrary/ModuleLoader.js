import ModuleFactory from './ModuleFactory';

export default class ModuleLoader {
  static setContext(context) {
    ModuleLoader._context = context;
  }

  static setRemoteUrl(url) {
    ModuleLoader._url = url;
  }

  static getServiceInstance(module) {
    let url = ModuleLoader._url;
    let service = ModuleFactory.getServiceInstance(module, url);
    service.setFullContext(ModuleLoader._context.getAll());
    return service;
  }
}

Object.defineProperty(ModuleLoader, '_context', {
  'enumerable': false,
  'writable': true,
  'configurable': false,
  'value': '',
});

Object.defineProperty(ModuleLoader, '_url', {
  'enumerable': false,
  'writable': true,
  'configurable': false,
  'value': '',
});
