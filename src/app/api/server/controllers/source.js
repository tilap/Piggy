import ValidationError from 'piggy-module/lib/ValidationError';
let serviceName = 'source';
let insertFields = ['title', 'description', 'url', 'rss', 'online'];
let updateFields = ['title', 'description', 'url', 'rss', 'online'];

module.exports.get = function *() {
  let service = this.getModuleService(serviceName);

  this.bag.setResponseType('multiple');

  let criteria = this.utils.getFromQuery('criteria', {});
  let options = this.utils.getFromQuery('options', {});
  let items = yield service.get(criteria, options);
  this.bag.setDataFromVos(items);
  return this.renderBag();
};

module.exports.getOneById = function *() {
  let service = this.getModuleService(serviceName);

  this.bag.setResponseType('single');

  let id = this.params.id || '';
  let item = yield service.getOneById(id);
  this.assert(item, 404, 'item not found');
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.insertOne = function *(next) {
  let service = this.getModuleService(serviceName);

  this.bag.setResponseType('single');

  let itemData = this.utils.getFromPostM(insertFields);
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
  let service = this.getModuleService(serviceName);

  this.bag.setResponseType('single');

  let id = this.params.id || '';

  let item = yield service.getOneById(id);
  this.assert(item, 404, 'item not found');

  let itemData = this.utils.getFromPostM(updateFields, null, true);
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
  let service = this.getModuleService(serviceName);

  this.bag.setResponseType('raw');
  let criteria = this.utils.getFromQuery('criteria', {});
  let successDeletedItemCount = yield service.delete(criteria);
  this.bag.setData({'deleted': successDeletedItemCount});
  return this.renderBag();
};
