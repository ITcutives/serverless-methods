const Abstract = require('../helpers/db.provider').Mongo;

class Organisation extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'organisations';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'organisation';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'name', 'config', 'created_at', 'modified_at'];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'users',
        LINK: 'user_id',
        CHILD: 'organisation_id',
        JOIN: 'permission',
        TYPE: 'MTOM',
        CANMODIFY: true,
      },
      {
        PLURAL: 'tags', LINK: 'organisation_id', TYPE: '1TOM', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      id: 'objectId',
    };
  }
}

module.exports = Organisation;
