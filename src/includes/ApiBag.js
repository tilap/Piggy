// Built by reading http://jsonapi.org/
import ApiBagRessource from 'ApiBagRessource';

export default class ApiBag {

  constructor() {
    this.reset();
  }

  reset() {
    this.resetDatas();
    this.resetErrors();
    this.setRawResponse();
  }

  setMultipleRessourceResponse() {
    if (this.hasDatas()) {
      throw new Error('Cannot change multiple type of bag that already has data');
    }
    this._multiple = true;
    this._raw = false;
    this.resetDatas();
    return this;
  }

  setSingleRessourceResponse() {
    if (this.hasDatas()) {
      throw new Error('Cannot change multiple type of bag that already has data');
    }
    this._multiple = false;
    this._raw = false;
    this.resetDatas();
    return this;
  }

  setRawResponse() {
    this._multiple = null;
    this._raw = true;
    this.resetDatas();
    return this;
  }

  _convertVoToRessource(vo) {
    let ressource = new ApiBagRessource();
    ressource.id = vo.id;
    ressource.type = vo.constructor.name;
    ressource.attributes = vo.data;
    return ressource;
  }

  addDataFromVo(vo) {
    let ressource = this._convertVoToRessource(vo);
    return this.addDataFromRessource(ressource);
  }

  addDataFromRessource(ressource) {
    this._checkRessoure(ressource);
    return this.addData(ressource.toJson());
  }

  addData(data) {
    if (this._raw) {
      if (!this._datas) {
        this._datas = [];
      }
      this._datas.push(data);
      return this;
    }

    if (!this._multiple) {
      throw new Error('Response must contain multidata');
    }
    this._datas.push(data);
    return this;
  }

  setDataFromVos(vos) {
    vos.forEach( vo => {
      this.addDataFromVo(vo);
    });
  }

  setDataFromVo(vo) {
    let ressource = this._convertVoToRessource(vo);
    return this.setDataFromRessource(ressource);
  }

  setDataFromRessource(ressource) {
    this._checkRessoure(ressource);
    return this.setData(ressource.toJson());
  }

  setData(data) {
    if (this._raw) {
      this._datas = data;
      return this;
    }

    if (this._multiple) {
      throw new Error('Response must contain multidata');
    }
    this._datas = data;
    return this;
  }

  hasDatas() {
    return this._multiple ? this._datas.length > 0 : this._datas !== null;
  }

  resetDatas() {
    this._datas = this._multiple === true ? [] : null;
    return this;
  }

  addErrors(errors) {
    if (errors.constructor !== Array) {
      throw new Error('Array expected');
    }
    errors.forEach(error => {
      this.addError(error);
    });
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
      throw new Error(ApiBag.ERRORS.OUTPUT_FORMAT_EMPTY);
    }

    if (this.hasDatas() && this.hasErrors()) {
      throw new Error(ApiBag.ERRORS.OUTPUT_FORMAT_DUAL);
    }
  }

  toJson() {
    try {
      this.checkFormat();
    } catch(err) {
      // TODO: return json response
      return {
        'errors': [err.message],
      };
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

Object.defineProperty(ApiBag, 'ERRORS', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': Object.freeze({
    'OUTPUT_FORMAT_EMPTY': 'OUTPUT_FORMAT_EMPTY',
    'OUTPUT_FORMAT_DUAL': 'OUTPUT_FORMAT_DUAL',
    'RESSOURCE_MISSING': 'RESSOURCE_MISSING',
  }),
});


