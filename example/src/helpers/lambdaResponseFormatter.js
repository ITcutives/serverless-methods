/**
 * Created by ashish on 31/12/16.
 */
const LambdaResponseFormatter = require('@itcutives/serverless-helpers/src/lambdaResponseFormatter');

class ResponseHandler extends LambdaResponseFormatter {
  static async middleware() {
    // const { Mongo } = require('./db.provider');
    // if (Mongo.CONN) {
    //   await Mongo.CONN.closeConnection();
    // }
    return true;
  }
}

module.exports = ResponseHandler;
