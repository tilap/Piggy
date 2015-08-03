export default class ApiBagRessource {
  constructor(id=null, type=null, attributes={}) {
    this.id = id;
    this.type = type;
    this.attributes = attributes;
  }

  validate() {
    if(!this.id) {
      throw new Error('id required');
    }
    if(!this.type) {
      throw new Error('id required');
    }
  }

  toJson() {
    this.validate();
    let res = {
      id: this.id,
      type: this.type
    };
    if(this.attributes && Object.keys(this.attributes).length > 0) {
      res.attribues = this.attributes;
    }
    return res;
  }
}

