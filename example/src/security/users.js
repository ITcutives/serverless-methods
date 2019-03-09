const Security = require('../../../src/helpers/security');

class User extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = User;
