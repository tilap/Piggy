export default function *(next) {

  this.utils = {

    getFromPost: (keys, defaultValue='') => {
      if(keys.constructor === Array) {
        let result = {};
        keys.forEach(key => {
          result[key] = this.request.body[key] || defaultValue;
        });
        return result;
      }
      else {
        return this.request.body[keys] || defaultValue;
      }
    },

    // Passport stuff
    requireConnected: () => {
      if (!this.isAuthenticated()) {
        this.throw(401);
      }
    },

    requireNotConnected: () => {
      if (this.isAuthenticated()) {
        this.throw(404);
      }
    },

    getUser: () => this.req.user ? this.req.user : null

  };

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
