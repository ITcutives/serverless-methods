const Boom = require('@hapi/boom');
const Abstract = require('../helpers/db.provider').Mongo;

class Permission extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'permissions';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'permission';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'user_id', 'organisation_id', 'role'];
  }

  static get ROLES() {
    return {
      ADMIN: 'ADMIN',
      USER: 'USER',
    };
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

  INSERT() {
    if (!Permission.ROLES[this.get('role')]) {
      throw Boom.expectationFailed(`PERMISSION01: bad role ${this.get('role')}`);
    }

    Permission.LINKS.forEach((link) => {
      if (!this.get(link.LINK)) {
        throw Boom.expectationFailed(`PERMISSION02: missing linking information (${link.PLURAL})`);
      }
    });
    return super.INSERT();
  }

  UPDATE() {
    if (!Permission.ROLES[this.get('role')]) {
      throw Boom.expectationFailed(`PERMISSION03: bad role ${this.get('role')}`);
    }

    Permission.LINKS.forEach((link) => {
      const col = link.LINK;
      if (this.get(col) && this.get(col) !== this.original.get(col).toString()) {
        throw Boom.expectationFailed(`PERMISSION04: missing linking information (${link.PLURAL})`);
      }
    });
    return super.UPDATE();
  }
}

module.exports = Permission;
