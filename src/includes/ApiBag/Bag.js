import ApiBagBase from './Base';
import ApiBagRessource from './Ressource';

export default class ApiBag extends ApiBagBase {

  constructor() {
    super();
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

  setDataFromVos(vos) {
    vos.forEach( vo => {
      this.addDataFromVo(vo);
    });
  }

  setDataFromVo(vo) {
    let ressource = this._convertVoToRessource(vo);
    return this.setDataFromRessource(ressource);
  }
}
