import ModuleFactory from 'library/ModuleFactory';

export default function *(next) {
  this.getModuleService = (module) => {
    let user = this.utils.getUser();
    let app = 'web';
    let service = ModuleFactory.getServiceInstance(module);
    if(user) {
      service.setUserContext(user);
    }
    if(app) {
      service.setAppContext(app)
    }
    return service;
  };
  yield next;
}
