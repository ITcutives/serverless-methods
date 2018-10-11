const Boom = require('boom');
const Security = require('../../src/helpers/Security');

class User extends Security {
  async ADMIN() {
    if (this.token.decoded.iss === this.object.get('id')) {
      return this.object;
    }
    throw Boom.forbidden('invalid name');
  }
}

module.exports = User;
