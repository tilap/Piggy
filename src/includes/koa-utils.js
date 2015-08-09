export default function *(next) {
  this.utils = {
    'getFromPost': (keys, defaultValue='') => {
      let result;
      if (keys.constructor !== Array) {
        result = this.request.body[keys] || defaultValue;
      } else {
        result = {};
        keys.forEach(key => {
          result[key] = this.request.body[key] || defaultValue;
        });
      }
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
    'getFromQuery': (param, defaultValue) => {
      const queryStr = this.request.querystring;
      if (queryStr === '' || queryStr.split('&').length === 0) {
        return defaultValue;
      }
      let temp;
      let result = defaultValue;
      queryStr.split('&').forEach( query => {
        temp = query.split('=');
        if (temp[0] && temp[1] && param === temp[0]) {
          result = decodeURIComponent(temp[1]);
        }
      });
      return result;
    },
  };

  yield next;
}
