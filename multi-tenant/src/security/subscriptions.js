const Security = require('./deps/token');

class Subscriptions extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Subscriptions;
