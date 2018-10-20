const Boom = require('boom');
const Security = require('../../src/helpers/Security');

class User extends Security {
  async ADMIN() {
    if (['create', 'update'].includes(this.action)) {
      if (this.token.decoded.iss === this.object.get('id')) {
        return this.object;
      }
      throw Boom.forbidden('invalid name');
    }
    return this.object;
  }
}

module.exports = User;
