export default class EventManager {
  constructor() {
    this.events = {};
  }

  isEventRegistered(eventname) {
    return Object.keys(this.events).indexOf(eventname) > -1;
  }

  _assumeEventnameExists(eventname) {
    if(!this.isEventRegistered(eventname)) {
      this.events[eventname] = [];
    }
  }

  subscribe(eventname, cb) {
    this._assumeEventnameExists(eventname);
    this.events[eventname].push(cb);
  }

  trigger(eventname, data) {
    let resCount = 0;
    if(!this.isEventRegistered(eventname)) {
      return resCount;
    }
    this.events[eventname].forEach( cb => {

      cb(data);
      resCount++;
    });
    return resCount;
  }
}
