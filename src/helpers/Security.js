const Boom = require('boom');

class Security {
  constructor(token, action, object) {
    this.token = token;
    this.action = action.toLowerCase();
    this.object = object;
  }

  isAllowed() {
    let permission;
    return Promise.resolve().then(() => {
      permission = this.token.getPermission();
      return this[permission]();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  UNAUTHORISED() {
    throw Boom.unauthorized();
  }

  async SUPER() {
    return this.object;
  }

  async ADMIN() {
    return this.object;
  }
}

module.exports = Security;
