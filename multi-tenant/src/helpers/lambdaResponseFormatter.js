/**
 * Created by ashish on 31/12/16.
 */
const LambdaResponseFormatter = require('@itcutives/serverless-helpers/src/lambdaResponseFormatter');

class ResponseHandler extends LambdaResponseFormatter {
  static async middleware() {
    return true;
  }
}

module.exports = ResponseHandler;
