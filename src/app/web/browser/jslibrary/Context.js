export default class Context {
  constructor() {
    this._context = {};
  }

  set(key, value) {
    this._context[key] = value;
  }

  get(key, defaultValue) {
    return Object.keys(this._context).indexOf(key) ? this._context[key] : defaultValue;
  }

  getAll() {
    return this._context;
  }
}
