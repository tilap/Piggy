// Built by reading http://jsonapi.org/
import ApiBagRessource from 'ApiBagRessource';

export default class ApiBag {

  constructor() {
    this.reset();
  }

  reset() {
    this.resetDatas();
    this.resetErrors();
    this.resetMetas();
    this.setResponseMultiple();
  }

  setResponseMultiple() {
    if(this.hasDatas()) {
      throw new Error('Cannot change multiple type of bag that already has data');
    }
    this._multiple = true;
    this.resetDatas();
    return this;
  }

  setResponseUnique() {
    if(this.hasDatas()) {
      throw new Error('Cannot change multiple type of bag that already has data');
    }
    this._multiple = false;
    this.resetDatas();
    return this;
  }

  setVoRessource(vo) {
    let r = new ApiBagRessource();
    r.id = vo.id;
    r.type = vo.constructor.name;
    r.attributes = vo.data;
    this.setData(r);
    return this;
  }

  setData(ressource) {
    this._checkRessoure(ressource);
    if(this._multiple) {
      throw new Error('Response must contain multidata');
    }
    this._datas = ressource;
    return this;
  }

  setDatas(datas) {
    if(!this._multiple) {
      throw new Error('Response must contain single data.');
    }
    if(datas.constructor!==Array) {
      throw new Error('Response can only handle multiple data - Array expected');
    }
    datas.forEach( obj=> {
      this.addData(obj);
    });
    return this;
  }

  addData(ressource) {
    this._checkRessoure(ressource);

    if(!this._multiple) {
      throw new Error('Response can have only one data set with setData');
    }
    this._datas.push(ressource);
    return this;
  }

  hasDatas() {
    if(this._multiple) {
      return this._datas.length > 0;
    }
    return this._datas!==null;
  }

  resetDatas() {
    this._datas = this._multiple ? [] : null;
    return this;
  }

  setErrors(errors) {
    this._errors = errors;
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

  setMetas(metas) {
    this._metas = metas;
    return this;
  }

  addMeta(name, value) {
    this._metas[meta] = value;
    return this;
  }

  hasMeta(key) {
    return Object.keys(this._metas).indexOf(key) > -1;
  }

  hasMetas() {
    return Object.keys(this._metas).length > 0;
  }

  resetMetas() {
    this._metas = {};
    return this;
  }

  _checkRessoure(ressource) {
    if(!ressource instanceof ApiBagRessource) {
      throw new Error('Not a ressource');
    }
    try {
      ressource.validate()
    }
    catch(err) {
      throw new Error('Invalid ressource: ' + err.message);
    }
  }

  checkFormat() {
    if(!this.hasDatas() && !this.hasErrors() && !this.hasMetas()) {
      throw new Error(ApiBag.OUTPUT_FORMAT_EMPTY);
    }

    if(this.hasDatas() && this.hasErrors()) {
      throw new Error(ApiBag.OUTPUT_FORMAT_DUAL);
    }
  }

  toJson() {
    try {
      this.checkFormat();
    }
    catch(err) {
      // TODO: return json response
      return {errors: ['Internal error: bad response format']};
    }

    let res = {};
    if(this.hasDatas()) {
      res.data = this._datas;
    }
    if(this.hasErrors()) {
      res.errors = this._errors;
    }
    if(this.hasMetas()) {
      res.metas = this._metas;
    }
    return res;
  }
}

Object.defineProperty(ApiBag, 'ERRORS', {
  enumerable: false,
  writable: false,
  configurable: false,
  value: Object.freeze({
    OUTPUT_FORMAT_EMPTY: 'OUTPUT_FORMAT_EMPTY',
    OUTPUT_FORMAT_DUAL: 'OUTPUT_FORMAT_DUAL',
    RESSOURCE_MISSING: 'RESSOURCE_MISSING'
  })
});


