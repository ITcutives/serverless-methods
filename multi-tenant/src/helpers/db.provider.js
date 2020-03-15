/**
 * Created by ashish on 29/05/2018.
 */
const AdapterMongo = require('@itcutives/adapter-mongo/src/adapter');
const ConnectMongo = require('@itcutives/adapter-mongo/src/connection');

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

module.exports = { Mongo };
