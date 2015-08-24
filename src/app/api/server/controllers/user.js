import ValidationError from 'piggy-module/lib/ValidationError';
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
  let item = yield service.getOneByUniqueProperty('username', username);
  this.assert(item, 404, 'item not found');
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.insertOne = function *(next) {
  let service = yield this.getModuleService(serviceName);

  this.bag.setSingleRessourceResponse();

  let itemData = this.utils.getFromPostM(['username', 'firstname', 'lastname', 'email']);
  try {
    let newVo = yield service.insertOne(itemData, 'api');
    this.bag.setDataFromVo(newVo);
    this.status = 201;
    this.renderBag();
  } catch(errors) {
    if (errors instanceof ValidationError) {
      this.bag.addError(errors);
      return this.renderBag();
    }
    throw errors;
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
    let updatedVo = yield service.updateOne(itemData, item.id);
    this.bag.setDataFromVo(updatedVo);
    return this.renderBag();
  } catch(errors) {
    if (errors instanceof ValidationError) {
      this.bag.addError(errors);
      return this.renderBag();
    }
    throw errors;
  }
};

module.exports.delete = function *() {
  let service = yield this.getModuleService(serviceName);

  this.bag.setRawResponse();
  let criteria = this.utils.getFromQuery('criteria', {});
  let successDeletedItemCount = yield service.delete(criteria);
  this.bag.setData({'deleted': successDeletedItemCount});
  return this.renderBag();
};
