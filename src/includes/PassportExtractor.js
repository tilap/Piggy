export default class PassportExtractor {

  constructor(profile = {}) {
    this.profile = profile;
  }

  get provider() {
    if(!this.profile.provider) {
      throw new Error('No provider');
    }
    return this.profile.provider.toLowerCase();
  }

  get firstname() {
    switch(this.provider) {
      case 'facebook':
        if(this.profile.name.givenName) {
          return this.profile.name.givenName;
        }
        break;
      case 'twitter':
        if(this.profile.displayName) {
          return this.profile.displayName;
        }
        break;
      default:
        throw new Error('Provider "' + this.provider + '" not supported for firstname');
    }
    return '';
  }

  get lastname() {
    switch(this.provider) {
      case 'facebook':
        if(this.profile.name.familyName) {
          return this.profile.name.familyName;
        }
        break;
      case 'twitter':
        break;
      default:
        throw new Error('Provider "' + this.provider + '" not supported for lastname');
    }
    return '';
  }

  get email() {
    switch(this.provider) {
      case 'facebook':
        if(this.profile.emails) {
          return this.profile.emails[0].value;
        }
        break;
      case 'twitter':
        break;
      default:
        throw new Error('Provider "' + this.provider + '" not supported for email');
    }
    return '';
  }

  get gender() {
    switch(this.provider) {
      case 'facebook':
        if(this.profile.gender && this.profile.gender!=='') {
          return this.profile.gender;
        }
        break;
      case 'twitter':
        break;
      default:
        throw new Error('Provider "' + this.provider + '" not supported for gender');
    }
    return '';
  }

  get username() {
    switch(this.provider) {
      case 'facebook':
      case 'twitter':
        if(this.profile.username && this.profile.username!=='') {
          return this.profile.username;
        }
        break;
      default:
        throw new Error('Provider "' + this.provider + '" not supported for username');
    }
    return '';
  }

  buildUsername() {
    if(this.username) {
      return this.cleanUsername(this.username);
    }
    if(this.firstname) {
      return this.cleanUsername(this.firstname);
    }
    if(this.lastname) {
      return this.cleanUsername(this.lastname);
    }
    throw new Error('Unable to build a username from the profile');
  }

  cleanUsername(username) {
    return username.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
  }
}
