const Boom = require('boom');
const Security = require('../../src/helpers/Security');

class Article extends Security {
  async ADMIN() {
    if (['create', 'update'].includes(this.action)) {
      if (this.token.decoded.iss === this.object.get('user_id')) {
        return this.object;
      }
      throw Boom.forbidden('not allowed to modify article');
    }
    return this.object;
  }
}

module.exports = Article;
