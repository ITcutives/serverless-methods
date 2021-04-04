const Boom = require('@hapi/boom');
const Abstract = require('../helpers/db.provider').Mongo;

class Membership extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'memberships';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'membership';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'user_id', 'tag_id', 'role'];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'users', LINK: 'user_id', TYPE: '1TO1', CANMODIFY: false,
      },
      {
        PLURAL: 'tags', LINK: 'tag_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      id: 'objectId',
      tag_id: 'objectId',
    };
  }

  getDatabase() {
    return `tenant-${this.context.url.params.tenant}`;
  }

  INSERT() {
    Membership.LINKS.forEach((link) => {
      if (!this.get(link.LINK)) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.INSERT();
  }

  UPDATE() {
    Membership.LINKS.forEach((link) => {
      const col = link.LINK;
      if (this.get(col) && this.get(col) !== this.original.get(col).toString()) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.UPDATE();
  }
}

module.exports = Membership;
