const Security = require('./deps/token');

class Organisation extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Organisation;
