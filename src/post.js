const Boom = require('boom');
const ErrorCodes = require('./helpers/error-codes.json');
const { validateEntityName } = require('./helpers/common');
const Abstract = require('./abstract');

class Post extends Abstract {
  static async searchInDB(ClassConstructor, id) {
    const condition = [{
      field: 'id',
      value: id,
    }];
    // find all records
    const classInstance = new ClassConstructor();
    return classInstance.SELECT(condition);
  }

  async handle() {
    let operationResult;

    const { token } = this;
    const { parent } = this.request.url.params;
    const content = this.request.body[parent];

    // check entity
    validateEntityName(this.env.CLASSES, parent);

    if (!content) {
      throw Boom.badRequest(ErrorCodes.E0008_BAD_REQUEST_BODY);
    }

    const ClassConstructor = this.getClassConstructor(parent);

    const classInstance = await ClassConstructor.fromLink(ClassConstructor, content);
    try {
      operationResult = await token.isAllowed(ClassConstructor.PLURAL, 'create', classInstance);
    } catch (e) {
      throw Boom.forbidden(ErrorCodes.E0010_PERMISSION_INSERT, e);
    }

    const id = await operationResult.INSERT();
    const insertedRecords = await Post.searchInDB(ClassConstructor, id);
    const dbEntries = await insertedRecords[0].toLink(undefined, this.token.rootDir);

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
