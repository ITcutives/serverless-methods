/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('boom');
const ErrorCodes = require('./helpers/error-codes.json');
const Abstract = require('./abstract');

class Delete extends Abstract {
  validate() {

  }

  async handle() {
    let Cls, o, parent, id;

    parent = this.request.url.params.parent;
    id = this.request.url.params.id;

    // check entity
    if (this.env.CLASSES.indexOf(parent) === -1) {
      throw Boom.badRequest(ErrorCodes.BAD_ENTITY_NAME);
    }

    // check the id from params
    if (!id) {
      throw Boom.badRequest(ErrorCodes.ID_REQUIRED_FOR_DELETE);
    }

    Cls = require(this.token.rootDir + '/models/' + parent);
    o = new Cls();
    return o.SELECT({'id': id})
      .then(records => {
        if (records.length === 0) {
          throw Boom.notFound(ErrorCodes.RECORD_NOT_FOUND_DELETE);
        }
        return records[0];
      })
      .then(record => this.token.isAllowed(Cls.PLURAL, 'delete', record))
      .then(o => o.DELETE())
      .then(() => this.response.respond(204, undefined));
  }
}

module.exports = Delete;
