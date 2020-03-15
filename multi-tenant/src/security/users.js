const Security = require('./deps/token');

class User extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = User;
