const Boom = require('boom');
const Security = require('../../src/helpers/Security');

class Article extends Security {
  async ADMIN() {
    if (this.token.decoded.iss === this.object.get('user_id')) {
      return this.object;
    }
    throw Boom.forbidden('not allowed to modify article');
  }
}

module.exports = Article;
