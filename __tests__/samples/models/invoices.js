/**
 * Created by ashish on 23/12/16.
 */
class invoice {
  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      config: 'json',
      created_at: 'timestamp',
    };
  }

  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'invoices';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'invoice';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return [
      'id',
      'name',
      'config',
      'organisation_id',
      'user_id',
      'created_at',
      'type',
      'status',
      'reference',
    ];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'organisations', LINK: 'organisation_id', TYPE: '1TO1', CANMODIFY: false,
      },
      {
        PLURAL: 'users', LINK: 'user_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }
}

module.exports = invoice;
