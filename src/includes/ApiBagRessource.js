export default class ApiBagRessource {
  constructor(id = null, type = null, attributes = {}, links = {}) {
    this.id = id;
    this.type = type;
    this.attributes = attributes;
    this._links = links;
  }

  addLink(type, value) {
    this._links[type] = value;
    return this;
  }

  set attributes(attributes) {
    this._attributes = {};
    Object.keys(attributes).forEach(name => {
      if (name === '_id' || name.substring(0, 1) !== '_') {
        this._attributes[name] = attributes[name];
      }
    });
  }

  validate() {
    if (!this.id) {
      throw new Error('id required');
    }
    if (!this.type) {
      throw new Error('id required');
    }
  }

  toJson() {
    this.validate();
    let res = {
      'id': this.id,
      'type': this.type,
    };
    if (this._attributes && Object.keys(this._attributes).length > 0) {
      res.attributes = this._attributes;
    }
    if (this._links && Object.keys(this._links).length > 0) {
      res.links = this._links;
    }
    return res;
  }
}

