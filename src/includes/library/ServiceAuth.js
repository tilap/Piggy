export default class ServiceAuth {

  constructor(user = null) {
    this.setUser(user);
  }

  setUser(user) {
    this._user = user;
  }

  getUser() {
    return this._user;
  }

  isConnected() {
    return this._user != null;
  }

  hasProfile(profile = '') {
    if (!this.isConnected()) {
      return false;
    }
    return this._user.profiles && this._user.profiles.indexOf(profile) > -1;
  }

  hasAnyProfile(profiles = []) {
    if (!this.isConnected()) {
      return false;
    }

    let result = false;
    profiles.forEach( profile => {
      if (this.hasProfile(profile)) {
        result = true;
      }
    });
    return result;
  }

  hasAllProfiles(profiles = []) {
    if (!this.isConnected()) {
      return false;
    }

    let result = true;
    profiles.forEach( profile => {
      if (!this.hasProfile(profile)) {
        result = false;
      }
    });
    return result;
  }
}
