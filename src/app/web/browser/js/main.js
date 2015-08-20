import ModuleFactory from './ModuleLoader';

let service = ModuleFactory.getServiceInstance('user');
console.log('got service', service);
service.get().then(res => {
  console.log(res);
});
