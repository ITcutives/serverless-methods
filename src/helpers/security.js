const Boom = require('boom');

class Security {
  constructor(token, action, object) {
    this.token = token;
    this.action = action.toLowerCase();
    this.object = object;
  }

  async isAllowed() {
    const permission = this.token.getPermission();
    return this[permission]();
  }

  // eslint-disable-next-line class-methods-use-this
  async UNAUTHORISED() {
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
