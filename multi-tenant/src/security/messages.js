const Security = require('./deps/token');

class Messages extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Messages;
