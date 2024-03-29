/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('@hapi/boom');
const ErrorCodes = require('./helpers/error-codes.json');
const Abstract = require('./abstract');
const { validateEntityName } = require('./helpers/common');
const { ApiAction } = require('./helpers/enum');

class Delete extends Abstract {
  async handle() {
    const { parent, id } = this.request.url.params;

    // check entity
    validateEntityName(this.env.CLASSES, parent);

    // check the id from params
    if (!id) {
      throw Boom.badRequest(ErrorCodes.E0003_ID_REQUIRED_FOR_DELETE);
    }

    const ClassConstructor = this.getClassConstructor(parent);
    const classInstance = this.getClassInstance(ClassConstructor);
    const records = await classInstance.SELECT({ id });
    if (records.length === 0) {
      throw Boom.notFound(ErrorCodes.E0002_RECORD_NOT_FOUND_DELETE);
    }
    let record = records[0];
    record = await this.token.isAllowed(ClassConstructor.PLURAL, ApiAction.DELETE, record);
    await record.DELETE();
    return this.response.respond(204, undefined, { 'content-type': 'application/json' });
  }
}

module.exports = Delete;
