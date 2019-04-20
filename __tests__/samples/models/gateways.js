/**
 * Created by ashish on 23/12/16.
 */
class gateway {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'gateways';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'gateway';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return [
      'id',
      'name',
      'adapter',
      'type',
      'pricePerUnit',
      'config',
      'blockSize',
    ];
  }

  /**
   * @returns {Array}
   */
  static get LINKS() {
    return [
      {
        PLURAL: 'organisations', LINK: 'organisation_id', CHILD: 'gateway_id', JOIN: 'credit', TYPE: 'MTOM', CANMODIFY: true,
      },
      {
        PLURAL: 'credits', LINK: 'gateway_id', TYPE: '1TOM', CANMODIFY: false,
      },
    ];
  }
}

module.exports = gateway;
