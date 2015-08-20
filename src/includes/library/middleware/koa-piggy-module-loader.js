/*
 * Controller helper to get service with context (user and app)
 */
import ModuleFactory from 'library/ModuleFactory';

export default function *(next) {
  this.getModuleService = (module, app='api') => {
    let user = this.utils.getUser();
    return ModuleFactory.getServiceInstance(module)
      .then( service => {
        if (user) {
          service.setContext('user', user);
        }
        if (app) {
          service.setContext('app', app);
        }
        return service;
      });
  };
  yield next;
}
