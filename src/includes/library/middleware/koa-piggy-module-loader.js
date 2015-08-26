/*
 * Controller helper to get service with context (user and app)
 */
import ModuleFactory from 'library/ModuleFactory';

export default function *(next) {
  this.getModuleService = (module, app = 'api') => {
    let user = this.auth.getUser();
    let service = ModuleFactory.getServiceInstance(module);
    if (user) {
      service.setContext('user', user);
    }
    if (app) {
      service.setContext('app', app);
    }
    return service;
  };
  yield next;
}
