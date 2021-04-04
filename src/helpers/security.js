const Boom = require('@hapi/boom');

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

  async USER() {
    return this.object;
  }
}

module.exports = Security;
