/**
 * Created by ashish on 29/05/2018.
 */
const Adapter = require('@itcutives/adapter-mysql/src/adapter');
const Connect = require('@itcutives/adapter-mysql/src/connection');
class MySQL extends Adapter {
  static CONNECT(config) {
    if (!MySQL.CONN) {
      MySQL.CONN = new Connect(config);
    }
    return Promise.resolve(MySQL.CONN);
  }

  static getCondition(token) {
    return [];
  }
}

module.exports = MySQL;
