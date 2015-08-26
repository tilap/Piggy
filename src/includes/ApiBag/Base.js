// Built by reading http://jsonapi.org/
import ApiBagRessource from './Ressource';

export default class ApiBagBase {

  constructor() {
    this._responseType = '';
    this.reset();
  }

  reset() {
    this.resetDatas();
    this.resetErrors();
    this.setResponseType('raw');
  }

  static responseTypeExists(type) {
    return ApiBagBase.RESPONSE_TYPE.indexOf(type) > -1;
  }

  setResponseType(type) {
    if (this.hasDatas()) {
      throw new Error('Cannot change response type, the bag has already some data');
    }
    if(!ApiBagBase.responseTypeExists(type)) {
      throw new Error('Unknown response type ' + type);
    }
    this._responseType = type;
    this.resetDatas();
    return this;
  }

  addDataFromRessource(ressource) {
    this._checkRessoure(ressource);
    return this.addData(ressource.toJson());
  }

  setDataFromRessource(ressource) {
    this._checkRessoure(ressource);
    return this.setData(ressource.toJson());
  }

  addData(data) {
    switch (this._responseType) {
      case 'raw':
        if (!this._datas) {
          this._datas = [];
        }
        this._datas.push(data);
        break;
      case 'multiple':
        this._datas.push(data);
        break;
      case 'single':
      default:
        throw new Error('Response must contain multidata');
    }
    return this;
  }

  setData(data) {
    switch (this._responseType) {
      case 'raw':
      case 'single':
        this._datas = data;
        break;
      case 'multiple':
        throw new Error('Multiple result expected, use addData');
      default:
        throw new Error('responseType not managed');
    }
    return this;
  }

  hasDatas() {
    if(this._responseType === 'multiple') {
      return this._datas.length > 0;
    } else {
      return this._datas !== null;
    }
  }

  resetDatas() {
    this._datas = this._responseType === 'multiple' ? [] : null;
    return this;
  }

  addError(error) {
    this._errors.push(error);
    return this;
  }

  hasErrors() {
    return this._errors.length > 0;
  }

  resetErrors() {
    this._errors = [];
    return this;
  }

  _checkRessoure(ressource) {
    if (!ressource instanceof ApiBagRessource) {
      throw new Error('Not a ressource');
    }
    try {
      ressource.validate();
    } catch(err) {
      throw new Error('Invalid ressource: ' + err.message);
    }
  }

  checkFormat() {
    if (!this.hasDatas() && !this.hasErrors()) {
      throw new Error(ApiBagBase.ERRORS.OUTPUT_FORMAT_EMPTY);
    }

    if (this.hasDatas() && this.hasErrors()) {
      throw new Error(ApiBagBase.ERRORS.OUTPUT_FORMAT_DUAL);
    }
  }

  toJson() {
    try {
      this.checkFormat();
    } catch(err) {
      let res = {
        'errors': [err.message],
      };
      return res;
    }

    let res = {};
    if (this.hasDatas()) {
      res.data = this._datas;
    }
    if (this.hasErrors()) {
      res.errors = this._errors;
    }
    return res;
  }
}

Object.defineProperty(ApiBagBase, 'ERRORS', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': Object.freeze({
    'OUTPUT_FORMAT_EMPTY': 'OUTPUT_FORMAT_EMPTY',
    'OUTPUT_FORMAT_DUAL': 'OUTPUT_FORMAT_DUAL',
  }),
});

Object.defineProperty(ApiBagBase, 'RESPONSE_TYPE', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': ['single', 'multiple', 'raw'],
});


