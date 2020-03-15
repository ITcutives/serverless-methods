const Abstract = require('../helpers/db.provider').Mongo;

class User extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'users';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'user';
  }

  static get USER() {
    return 'USER';
  }

  static get ADMIN() {
    return 'ADMIN';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'email', 'type', 'attributes'];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'permissions', LINK: 'user_id', TYPE: '1TOM', CANMODIFY: false,
      },
      {
        PLURAL: 'memberships', LINK: 'user_id', TYPE: '1TOM', CANMODIFY: false,
      },
      {
        PLURAL: 'subscriptions', LINK: 'user_id', TYPE: '1TOM', CANMODIFY: false,
      },
      {
        PLURAL: 'messages', LINK: 'user_id', TYPE: '1TOM', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      // id: 'objectId',
      attributes: 'json',
    };
  }

  async INSERT() {
    this.set('type', User.USER);
    // eslint-disable-next-line no-underscore-dangle
    this.properties._id = this.properties.id;
    return super.INSERT();
  }
}

module.exports = User;
