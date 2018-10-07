/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('boom');
const ErrorCodes = require('./helpers/error-codes.json');
const Abstract = require('./abstract');

class Delete extends Abstract {
  async handle() {
    const { parent, id } = this.request.url.params;

    // check entity
    if (this.env.CLASSES.indexOf(parent) === -1) {
      throw Boom.badRequest(ErrorCodes.BAD_ENTITY_NAME);
    }

    // check the id from params
    if (!id) {
      throw Boom.badRequest(ErrorCodes.ID_REQUIRED_FOR_DELETE);
    }

    const Cls = require(`${this.token.rootDir}/models/${parent}`);
    const classInstance = new Cls();
    const records = await classInstance.SELECT({ id });
    if (records.length === 0) {
      throw Boom.notFound(ErrorCodes.RECORD_NOT_FOUND_DELETE);
    }
    let record = records[0];
    record = await this.token.isAllowed(Cls.PLURAL, 'delete', record);
    record.DELETE();
    return this.response.respond(204, undefined);
  }
}

module.exports = Delete;
