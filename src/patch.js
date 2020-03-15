/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('boom');
const ErrorCodes = require('./helpers/error-codes.json');
const { validateEntityName } = require('./helpers/common');
const Abstract = require('./abstract');

class Patch extends Abstract {
  async handle() {
    let operationResult;

    const { token } = this;
    const { parent, id } = this.request.url.params;
    const content = this.request.body[parent];

    // check entity
    validateEntityName(this.env.CLASSES, parent);

    if (!content) {
      throw Boom.badRequest(ErrorCodes.E0008_BAD_REQUEST_BODY);
    }

    const ClassConstructor = this.getClassConstructor(parent);

    if (content.id !== id) {
      throw Boom.badRequest(ErrorCodes.E0004_ID_MISMATCH_WITH_OBJECT_ID);
    }

    const classInstance = await ClassConstructor.fromLink(ClassConstructor, this.getContext(), content);

    const validId = classInstance.get('id');
    const existing = await this.searchInDB(ClassConstructor, validId);
    const updatedClassInstance = classInstance.setOriginal(existing[0]);

    try {
      operationResult = await token.isAllowed(ClassConstructor.PLURAL, 'edit', updatedClassInstance);
    } catch (e) {
      throw Boom.forbidden(ErrorCodes.E0009_PERMISSION_UPDATE, e);
    }

    await operationResult.UPDATE();
    const [updatedRecords] = await this.searchInDB(ClassConstructor, id);
    const dbEntries = await updatedRecords.toLink(undefined, this.token.rootDir);

    const rtn = {
      status: undefined,
      objects: [dbEntries],
      plural: ClassConstructor.PLURAL,
    };
    const respond = {};
    respond[rtn.plural] = rtn.objects;
    return this.response.respond(200, respond);
  }
}

module.exports = Patch;
