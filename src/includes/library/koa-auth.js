/**
 * Authentification helper for koa controller based on User business module with profiles
 *
 */
export default function *(next) {
  this.auth = {};

  this.auth.requireConnected = () => {
    this.assert(this.isAuthenticated(), 401);
  };

  this.auth.requireNotConnected = () => {
    this.assert(!this.isAuthenticated(), 404);
  };

  this.auth.getUser = () => this.req.user ? this.req.user : null;

  this.auth.requireProfile = (profile) => {
    this.auth.requireConnected();
    let user = this.auth.getUser();
    let userService = this.getModuleService('user');
    this.assert(userService.hasProfile(profile), 403);
  };

  this.auth.hasProfile = (profile) => {
    let userService = this.getModuleService('user');
    return userService.hasProfile(profile);
  }

  this.auth.hasAnyProfile = (profiles) => {
    return userService.hasAnyProfile(profiles);
  }

  this.auth.hasAllProfiles = (profiles) => {
    return userService.hasAllProfiles(profiles);
  }

  yield next;
}
