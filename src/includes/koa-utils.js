export default function *(next) {
  this.utils = {

    'getFromPost': (key, defaultValue='') => {
      return this.request.body && this.request.body[key] ? this.request.body[key] : defaultValue;
    },

    'getFromPostM': (keys, defaultValue='', ignoreMultipleMissings=false) => {
      let result = {};
      keys.forEach(key => {
        if (Object.keys(this.request.body).indexOf(key) > -1) {
          result[key] = this.request.body[key];
        } else if (!ignoreMultipleMissings) {
          result[key] = defaultValue;
        }
      });
      return result;
    },

    'getFromQuery': (param, defaultValue) => {
      const queryStr = this.request.querystring;
      let result = defaultValue;
      if (queryStr === '' || queryStr.split('&').length === 0) {
        return result;
      }
      let temp;
      queryStr.split('&').forEach( query => {
        temp = query.split('=');
        if (temp[0] && param === temp[0] && temp[1]) {
          result = decodeURIComponent(temp[1]);
          try {
            result = JSON.parse(result);
          } catch(err) {}
        }
      });
      return result;
    },

    'getFromQueryM': (params, defaultValue, ignoreMultipleMissings=false) => {
      const queryStr = this.request.querystring;
      let result = {};
      if (!ignoreMultipleMissings) {
        params.forEach( param => {
          result[param] = defaultValue;
        });
      }
      if (queryStr === '' || queryStr.split('&').length === 0) {
        return result;
      }
      let temp;
      queryStr.split('&').forEach( query => {
        temp = query.split('=');
        if (temp[0] && temp[1] && params.indexOf(temp[0]) > -1) {
          result[temp[0]] = decodeURIComponent(temp[1]);
          try {
            result[temp[0]] = JSON.parse(result[temp[0]]);
          } catch(err) {}
        }
      });
      return result;
    },

    'requireConnected': () => {
      if (!this.isAuthenticated()) {
        this.throw(401);
      }
    },
    'requireNotConnected': () => {
      if (this.isAuthenticated()) {
        this.throw(404);
      }
    },
    'getUser': () => this.req.user ? this.req.user : null,
  };

  yield next;
}
