class User {
  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {};
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
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'name', 'type'];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [];
  }

  static validate() {

  }
}

module.exports = User;
