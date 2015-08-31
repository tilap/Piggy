/**
 * Authentification helper for koa controller based on auth context
 */
export default function *(next) {
  this.auth = {};

  this.auth.getService = () => {
    if (!this.context) {
      throw new Error('No context found');
    }
    if (!this.context.get('auth', null)) {
      throw new Error('No auth context');
    }
    return this.context.get('auth');
  };

  this.auth.getUser = () => {
    return this.auth.getService.getUser();
  };

  this.auth.hasProfile = (profile) => {
    return this.auth.getService().hasProfile(profile);
  };

  this.auth.hasAnyProfile = (profiles) => {
    return this.auth.getService().hasAnyProfile(profiles);
  };

  this.auth.hasAllProfiles = (profiles) => {
    return this.auth.getService().hasAllProfiles(profiles);
  };

  this.auth.requireConnected = () => {
    this.assert(this.auth.getService().isConnected(), 401);
  };

  this.auth.requireNotConnected = () => {
    this.assert(!this.auth.getService().isConnected(), 401);
  };

  this.auth.requireProfile = (profile) => {
    this.auth.requireConnected();

    this.assert(this.auth.getService().hasProfile(profile), 403);
  };

  yield next;
}
