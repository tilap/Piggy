import initializeService from 'library/ServiceInitializer';

export default function *(next) {
  let context = this.context;
  // Add module service loader
  this.getModuleService = (module) => {
    return initializeService(module, context);
  };

  yield next;
};
