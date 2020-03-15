const Security = require('./deps/token');

class Permission extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Permission;
