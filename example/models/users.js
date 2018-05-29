const Abstract = require('../helpers/db.provider');

class User extends Abstract {
  constructor (entity) {
    super(entity);
  }

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
  };

  static get USER() {
    return 'USER';
  }

  static get SUPER() {
    return 'SUPER';
  }
}
