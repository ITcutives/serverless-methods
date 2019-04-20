/**
 * Created by ashish on 23/12/16.
 */
class organisation {
  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      config: 'json',
      subscription: 'json',
      created_at: 'timestamp',
    };
  }

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
    return [
      'id',
      'name',
      'config',
      'created_at',
      'status',
      'plan_id',
      'subscription',
      'created_by',
      'expiry',
    ];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'gateways', LINK: 'gateway_id', CHILD: 'organisation_id', JOIN: 'credit', TYPE: 'MTOM', CANMODIFY: true,
      },
      {
        PLURAL: 'users', LINK: 'user_id', CHILD: 'organisation_id', JOIN: 'permission', TYPE: 'MTOM', CANMODIFY: true,
      },
      {
        PLURAL: 'invoices', LINK: 'organisation_id', TYPE: '1TOM', CANMODIFY: false,
      },
      {
        PLURAL: 'credits', LINK: 'organisation_id', TYPE: '1TOM', CANMODIFY: false,
      },
      {
        PLURAL: 'plans', LINK: 'plan_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }
}

module.exports = organisation;
