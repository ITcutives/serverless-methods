const Boom = require('boom');
const ErrorCodes = require('./helpers/error-codes.json');
const { validateEntityName } = require('./helpers/common');
const Abstract = require('./abstract');

class Post extends Abstract {
  async handle() {
    const { token } = this;
    const { parent } = this.request.url.params;
    const content = this.request.body[parent];

    // check entity
    validateEntityName(this.env.CLASSES, parent);

    if (!content) {
      throw Boom.badRequest(ErrorCodes.E0008_BAD_REQUEST_BODY);
    }

    const ClassConstructor = this.getClassConstructor(parent);

    const classInstance = await ClassConstructor.fromLink(ClassConstructor, this.getContext(), content);
    const operationResult = await token.isAllowed(ClassConstructor.PLURAL, 'create', classInstance);

    const id = await operationResult.INSERT();
    const [insertedRecords] = await this.searchInDB(ClassConstructor, id);
    const dbEntries = await insertedRecords.toLink(undefined, this.token.rootDir);

    const rtn = {
      status: undefined,
      objects: [dbEntries],
      plural: ClassConstructor.PLURAL,
    };
    const respond = {};
    respond[rtn.plural] = rtn.objects;
    return this.response.respond(201, respond);
  }
}

module.exports = Post;
