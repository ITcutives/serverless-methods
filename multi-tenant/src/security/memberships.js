const Security = require('./deps/token');

class Membership extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Membership;
