/**
 * Created by ashish on 23/12/16.
 */
class user {
  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      verification_code: 'json',
      created_at: 'timestamp',
    };
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
    return [
      'id',
      'name',
      'privilege',
      'created_at',
      'verification_code',
    ];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'organisations', LINK: 'organisation_id', CHILD: 'user_id', JOIN: 'permission', TYPE: 'MTOM', CANMODIFY: true,
      },
    ];
  }
}

module.exports = user;
