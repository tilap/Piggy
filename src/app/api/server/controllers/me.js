module.exports.whoami = function *() {
  this.bag.setResponseType('single');
  let user = this.auth.getUser();
  if (user) {
    this.bag.setDataFromVo(user);
  }
  else {
    this.bag.setData({});
  }
  return this.renderBag();
};
