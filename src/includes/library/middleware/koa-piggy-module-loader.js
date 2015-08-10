/*
 * Controller helper to get service with context (user and app)
 */
import ModuleFactory from 'library/ModuleFactory';

export default function *(next) {
  this.getModuleService = (module) => {
    let user = this.utils.getUser();
    let app = 'api';
    let service = ModuleFactory.getServiceInstance(module);
    if (user) {
      service.setUserContext(user);
    }
    if (app) {
      service.setAppContext(app);
    }
    return service;
  };
  yield next;
}
