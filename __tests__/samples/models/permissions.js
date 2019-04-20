/**
 * Created by ashish on 23/12/16.
 */

class permission {
  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      config: 'json',
    };
  }

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
    return [
      'id',
      'organisation_id',
      'user_id',
      'config',
    ];
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
}

module.exports = permission;
