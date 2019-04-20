/**
 * Created by ashish on 23/12/16.
 */
class plan {
  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      monthly: 'json',
      yearly: 'json',
      gateways: 'json',
    };
  }

  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'plans';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'plan';
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return [
      'id',
      'name',
      'monthly',
      'yearly',
      'status',
      'gateways',
    ];
  }
}

module.exports = plan;
