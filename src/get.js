/**
 * Created by ashish on 29/05/2018.
 */
const Abstract = require('./abstract');

class Get extends Abstract {
  async handle() {
    return this.response.respond(200, this.request);
  }
}

module.exports = Get;
