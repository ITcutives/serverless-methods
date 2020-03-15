const Security = require('./deps/token');

class Tags extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Tags;
