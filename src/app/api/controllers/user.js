import ModuleFactory from 'library/ModuleFactory';
let userService = ModuleFactory.getService('user');

module.exports.get = function *() {
  try {
    this.bag.setMultipleRessourceResponse(); // Coz method viewOneByUsername
    let items = yield userService.getByPage();
    this.bag.setDataFromVos(items);
    return this.renderBag();
  }
  catch(err) {
    this.bag.addError('api.error');
    this.bag.addError(err.message);
  }
};


module.exports.getOneByUsername = function *() {
  this.bag.setSingleRessourceResponse(); // Coz method viewOneByUsername
  let username = this.params.username || ''; // Coz arg and default value in service method
  try {
    let item = yield userService.getOneByUsername(username);
    if(item) {
      this.bag.setDataFromVo(item);
      return this.renderBag();
    }
    this.bag.addError('api.item.notfound');
    return this.renderBag();
  }
  catch(err) {
    this.bag.addError('api.error');
    this.bag.addError(err.message);
    return this.renderBag();
  }
};


module.exports.getOneById = function *() {
  this.bag.setSingleRessourceResponse(); // Coz method viewOneByUsername
  let id = this.params.id || ''; // Coz arg and default value in service method
  try {
    let item = yield userService.getOneById(id);
    if(item) {
      this.bag.setDataFromVo(item);
      return this.renderBag();
    }
    this.bag.addError('api.item.notfound');
    return this.renderBag();
  }
  catch(err) {
    this.bag.addError('api.error');
    this.bag.addError(err.message);
    return this.renderBag();
  }
};


module.exports.createOne = function *() {
  this.bag.setSingleRessourceResponse();
  let itemData = this.utils.getFromPost(['username', 'firstname', 'lastname', 'email']);
  try {
    let newVo = yield userService.createOneFromData(itemData, 'api');
    this.bag.setDataFromVo(newVo);
    this.renderBag();
  }
  catch(errors) {
    if(errors instanceof Error) {
      this.bag.addError('api.error.user.create');
      return this.renderBag();
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};


module.exports.updateOneById = function *() {
  this.bag.setSingleRessourceResponse();

  let id = this.params.id || '';
  let itemData = this.utils.getFromPost(['username', 'firstname', 'lastname', 'email']);

  let item = yield userService.getOneById(id);
  if(!item) {
    this.bag.addError('api.item.notfound');
    return this.renderBag();
  }

  try {
    let updatedVo = yield userService.updateOneFromData(itemData, item.id);
    this.bag.setDataFromVo(updatedVo);
    return this.renderBag();
  }
  catch(errors) {
    if(errors instanceof Error) {
      this.bag.addError('api.error.user.patch');
      return this.renderBag();
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};

module.exports.deleteOneById = function *() {
  this.bag.setRawResponse();

  let id = this.params.id || '';
  let item = yield userService.getOneById(id);
  if(!item) {
    this.bag.addError('api.item.notfound');
    return this.renderBag();
  }

  try {
    let successDeleted = yield userService.deleteOneById(item.id);
    this.bag.setData({deleted: true===successDeleted ? 1: 0});
    return this.renderBag();
  }
  catch(errors) {
    this.bag.addError(errors);
    return this.renderBag();
  }
}
