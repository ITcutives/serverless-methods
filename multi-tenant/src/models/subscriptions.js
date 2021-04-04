const Boom = require('@hapi/boom');
const Abstract = require('../helpers/db.provider').Mongo;

class Subscription extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'subscriptions';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'subscription';
  }

  static get ALLOWED_TYPES() {
    return {
      ANDROID: 'ANDROID',
      IOS: 'IOS',
      CHROME: 'CHROME',
    };
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return ['id', 'user_id', 'type', 'address', 'device_id'];
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
        PLURAL: 'devices', LINK: 'device_id', TYPE: '1TO1', CANMODIFY: false,
      },
    ];
  }

  /**
   * @returns {{}}
   */
  static get SERIALIZED() {
    return {
      id: 'objectId',
    };
  }

  getDatabase() {
    return `tenant-${this.context.url.params.tenant}`;
  }

  INSERT() {
    Subscription.LINKS.forEach((link) => {
      if (!this.get(link.LINK)) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.INSERT();
  }

  UPDATE() {
    Subscription.LINKS.forEach((link) => {
      const col = link.LINK;
      if (this.get(col) && this.get(col) !== this.original.get(col).toString()) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.UPDATE();
  }
}

module.exports = Subscription;
