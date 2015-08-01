export default function *(next) {

  this.utils = {

    getFromPost: (keys, defaultValue='') => {
      if(keys.constructor === Array) {
        let result = {};
        keys.forEach(key => {
          result[key] = this.request.body[key] || defaultValue;
        })
        return result;
      }
      else {
        return this.request.body[keys] || defaultValue;
      }
    },

    requireConnected: () => {
      if (!this.isAuthenticated()) {
        this.throw(401);
      }
    }
  }

  // Get param helper
  let queryStr = this.request.querystring;
  let params = {}, temp;
  if(queryStr!=='' && queryStr.split('&').length > 0) {
    queryStr.split('&').forEach( query => {
      temp = query.split('=');
      params[temp[0]] = decodeURIComponent(temp[1]) || '';
    });
  }
  this.request.args = params;


  yield next;
}
