import Context from './includes/Context';
import initializeService from './includes/library/ServiceInitializer';
import ServiceAuth from './includes/library/ServiceAuth';
import UserVo from './modules/user/Vo';

// Load context from dom
let context = new Context();
if(currentContext) {
  if(currentContext.app) {
    context.set('app', currentContext.app);
  }
  if(currentContext.auth) {
    let user = new UserVo(currentContext.auth._user.data);
    let authService = new ServiceAuth(user);
    context.set('auth', authService);
  }
}

export default function getModuleService(module) {
  return initializeService(module, context);
};
