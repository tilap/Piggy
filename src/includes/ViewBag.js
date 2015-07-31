export default class ViewBag {
  constructor() {
    this.dataset = {};
    this.protectedKeys = [];
  }

  get data() {
    return this.dataset;
  }

  get dataKeys() {
    return Object.keys(this.dataset);
  }

  has(key) {
    return Object.getOwnPropertyNames(this.dataset).indexOf(key) > -1;
  }

  get(key, defaultValue='') {
    return this.has(key) ? this.dataset[key] : defaultValue;
  }

  set(key, value='') {
    this._checkKeyIsNotProtected(key);
    this.dataset[key]=value;
  }

  setProtected(key, value='') {
    this._checkKeyIsNotProtected(key);
    this.dataset[key]=value;
    this.protectedKeys.push(key);
  }

  _checkKeyIsNotProtected(key) {
    if(this.protectedKeys.indexOf(key)>-1) {
      throw new Error('The key "' + key + ' is protected, you cannot override or delete it it');
    }
  }

  setM(data={}) {
    Object.getOwnPropertyNames(data).forEach(name => {
      this._checkKeyIsNotProtected(name);
      this.set(name, data[name]);
    });
  }

  unset(key) {
    if(this.has(key)) {
      this._checkKeyIsNotProtected(key);
      delete(this.dataset[key]);
    }
  }
}
