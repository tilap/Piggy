/*
 * Basic Flash message class with title, structured type and content
 */
export default class FlashMessage {

  constructor(title = '', type = null, content = '') {
    this.title = title;
    this.type = this.isType(type) ? type : FlashMessage.TYPES.INFO;
    this.content = content;
  }

  isType(type) {
    let vals = Object.keys(FlashMessage.TYPES).map(key => FlashMessage.TYPES[key]);
    return vals.indexOf(type) > -1;
  }
}

Object.defineProperty(FlashMessage, 'TYPES', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': Object.freeze({
    'INFO': 'info',
    'SUCCESS': 'success',
    'WARNING': 'warning',
    'ERROR': 'error',
  }),
});
