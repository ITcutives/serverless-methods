const Boom = require('boom');
const Abstract = require('../helpers/db.provider').Mongo;

class Message extends Abstract {
  /**
   * @returns {string}
   */
  static get PLURAL() {
    return 'messages';
  }

  /**
   * @returns {string}
   */
  static get TABLE() {
    return 'message';
  }

  static get ALLOWED_STATUSES() {
    return {
      UNREAD: 'UNREAD',
      READ: 'READ',
      READ_ARCHIVED: 'READ_ARCHIVED',
      UNREAD_ARCHIVED: 'UNREAD_ARCHIVED',
    };
  }

  static get TYPES() {
    return {
      EVENT: 'EVENT',
      INFO: 'INFO',
    };
  }

  static get TARGETS() {
    return {
      SMS: 'SMS',
      EMAIL: 'EMAIL',
      PUSH: 'PUSH',
    };
  }

  /**
   * @returns {Array}
   */
  static get FIELDS() {
    return [
      'id',
      'user_id',
      'sender_id',
      'type',
      'target',
      'config',
      'created_at',
      'status',
      'location',
      'broadcastId',
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
        PLURAL: 'senders', LINK: 'sender_id', TYPE: '1TO1', CANMODIFY: false,
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
    this.set('status', Message.ALLOWED_STATUSES.UNREAD);

    // validate type
    const type = this.get('type');
    if (!type) {
      this.set('type', 'info');
    } else if (!Object.values(Message.TYPES).includes(type)) {
      throw Boom.expectationFailed('bad message type');
    }

    Message.LINKS.forEach((link) => {
      if (!this.get(link.LINK)) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.INSERT();
  }

  UPDATE() {
    Message.LINKS.forEach((link) => {
      const col = link.LINK;
      if (this.get(col) && this.get(col) !== this.original.get(col).toString()) {
        throw Boom.expectationFailed(`missing linking information (${link.PLURAL})`);
      }
    });
    return super.UPDATE();
  }
}

module.exports = Message;
