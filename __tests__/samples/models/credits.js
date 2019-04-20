/**
 * Created by ashish on 23/12/16.
 */
class credit {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'credits';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'credit';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return [
      'id',
      'organisation_id',
      'gateway_id',
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
        PLURAL: 'gateways', LINK: 'gateway_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }
}

module.exports = credit;
