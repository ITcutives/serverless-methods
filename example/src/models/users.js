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
        PLURAL: 'articles', LINK: 'user_id', TYPE: '1TOM', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      id: 'objectId',
      attributes: 'json',
    };
  }

  INSERT() {
    this.set('type', User.USER);
    return super.INSERT();
  }
}

module.exports = User;
