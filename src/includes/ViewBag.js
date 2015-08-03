export default class ViewBag {
  get dataKeys() {
    return Object.getOwnPropertyNames(this);
  }

  has(key) {
    return Object.getOwnPropertyNames(this).indexOf(key) > -1;
  }

  get(key, defaultValue='') {
    return this.has(key) ? this[key] : defaultValue;
  }

  set(key, value='') {
    this[key] = value;
  }

  setProtected(key, value='') {
    Object.defineProperty(this, key, {
      writable: false,
      configurable: false,
      enumerable: true,
      value: value,
    });
  }

  unset(key) {
    delete this[key];
  }
}
