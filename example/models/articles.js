const Boom = require('boom');
const Abstract = require('../helpers/db.provider').Mongo;

class Article extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'articles';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'article';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'user_id', 'post', 'created_at', 'modified_at'];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'users', LINK: 'user_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      post: 'json',
    };
  }

  INSERT() {
    Article.LINKS.forEach((link) => {
      if (!this.get(link.LINK)) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.INSERT();
  }

  UPDATE() {
    Article.LINKS.forEach((link) => {
      const col = link.LINK;
      if (this.get(col) && this.get(col) !== this.original.get(col)) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.UPDATE();
  }
}

module.exports = Article;
