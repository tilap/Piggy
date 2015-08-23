let serviceName = 'user';

module.exports.get = function *() {
  let service = yield this.getModuleService(serviceName);

  this.bag.setMultipleRessourceResponse();

  let criteria = this.utils.getFromQuery('criteria', {});
  let options = this.utils.getFromQuery('options', {});
  let items = yield service.get(criteria, options);
  this.bag.setDataFromVos(items);
  return this.renderBag();
};


module.exports.getOneById = function *() {
  let service = yield this.getModuleService(serviceName);

  this.bag.setSingleRessourceResponse();

  let id = this.params.id || '';

  let item = yield service.getOneById(id);
  this.assert(item, 404, 'item not found');
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.getOneByUsername = function *() {
  let service = yield this.getModuleService(serviceName);

  this.bag.setSingleRessourceResponse();

  let username = this.params.username || '';

  let item = yield service.getOneByUsername(username);
  this.assert(item, 404, 'item not found');
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.createOne = function *(next) {
  let service = yield this.getModuleService(serviceName);

  this.bag.setSingleRessourceResponse();

  let itemData = this.utils.getFromPostM(['username', 'firstname', 'lastname', 'email']);
  try {
    let newVo = yield service.createNewOne(itemData, 'api');
    this.bag.setDataFromVo(newVo);
    this.renderBag();
  } catch(errors) {
    if (errors instanceof Error) {
      throw errors;
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};


module.exports.updateOneById = function *() {
  let service = yield this.getModuleService(serviceName);

  this.bag.setSingleRessourceResponse();

  let id = this.params.id || '';
  let item = yield service.getOneById(id);

  this.assert(item, 404, 'item not found');

  let itemData = this.utils.getFromPostM(['firstname', 'lastname', 'email'], null, true);
  try {
    let updatedVo = yield service.updateOneFromData(itemData, item.id);
    this.bag.setDataFromVo(updatedVo);
    return this.renderBag();
  } catch(errors) {
    if (errors instanceof Error) {
      throw errors;
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};

module.exports.deleteOneById = function *() {
  let service = yield this.getModuleService(serviceName);

  this.bag.setRawResponse();

  let id = this.params.id || '';
  let item = yield service.getOneById(id);

  this.assert(item, 404, 'item not found');

  let successDeleted = yield service.deleteOneById(item.id);
  this.bag.setData({'deleted': successDeleted === true ? 1 : 0});
  return this.renderBag();
};
