import initializeService from 'library/ServiceInitializer';
import ServiceAuth from 'library/ServiceAuth';
import Context from 'Context';

export default function(application) {
  return function *(next) {

    // Add context to controller
    let currentUser = this.isAuthenticated() ? this.req.user : null;
    let authService = new ServiceAuth(currentUser);
    let context = new Context();
    context.set('app', application);
    context.set('auth', authService);

    this.context = context;

    // Add module service loader
    this.getModuleService = (module) => {
      return initializeService(module, context);
    };

    yield next;
  };
}
