const Boom = require('boom');
const Abstract = require('../helpers/db.provider').Mongo;

class Tag extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'tags';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'tag';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'name', 'config', 'created_at', 'modified_at', 'organisation_id'];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'users',
        LINK: 'user_id',
        CHILD: 'tag_id',
        JOIN: 'membership',
        TYPE: 'MTOM',
        CANMODIFY: true,
      },
      {
        PLURAL: 'organisations', LINK: 'organisation_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      id: 'objectId',
      organisation_id: 'objectId',
    };
  }

  getDatabase() {
    return `tenant-${this.context.url.params.tenant}`;
  }

  INSERT() {
    Tag.LINKS.forEach((link) => {
      if (!this.get(link.LINK) && link.TYPE === '1TO1') {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.INSERT();
  }

  UPDATE() {
    Tag.LINKS.forEach((link) => {
      const col = link.LINK;
      if (this.get(col) && this.get(col) !== this.original.get(col).toString() && link.TYPE === '1TO1') {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.UPDATE();
  }
}

module.exports = Tag;
