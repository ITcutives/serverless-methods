/**
 * Created by ashish on 29/05/2018.
 */
const Adapter = require('@itcutives/adapter-mysql/src/adapter');
const Connect = require('@itcutives/adapter-mysql/src/connection');
const AdapterMongo = require('@itcutives/adapter-mongo/src/adapter');
const ConnectMongo = require('@itcutives/adapter-mongo/src/connection');

class MySQL extends Adapter {
  static async CONNECT(config) {
    if (!MySQL.CONN) {
      MySQL.CONN = new Connect(config);
    }
    return MySQL.CONN;
  }

  // eslint-disable-next-line no-unused-vars
  static getCondition(token) {
    return [];
  }
}

class Mongo extends AdapterMongo {
  static async CONNECT(config) {
    if (!Mongo.CONN) {
      Mongo.CONN = new ConnectMongo(config);
    }
    return Mongo.CONN;
  }

  // eslint-disable-next-line no-unused-vars
  static getCondition(token) {
    return [];
  }
}

module.exports = { MySQL, Mongo };
