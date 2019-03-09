const Security = require('../../../src/helpers/security');

class Article extends Security {
  async USER() {
    return this.object;
  }
}

module.exports = Article;
