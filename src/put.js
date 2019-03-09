/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('boom');
const loIsArray = require('lodash/isArray');
const loFilter = require('lodash/filter');
const ErrorCodes = require('./helpers/error-codes.json');
const { mapReflect, validateEntityName } = require('./helpers/common');
const Abstract = require('./abstract');

class Put extends Abstract {
  static async searchInDB(ClassConstructor, ids) {
    const condition = [{
      field: 'id',
      operator: 'in',
      value: ids,
    }];
    // find all records
    const classInstance = new ClassConstructor();
    return classInstance.SELECT(condition);
  }

  static async mapRecords(ClassConstructor, ids) {
    const queryResult = await Put.searchInDB(ClassConstructor, ids);
    // technically find should return same number of records as the list of id provided
    if (ids.length !== queryResult.length) {
      throw Boom.badRequest(ErrorCodes.E0007_INVALID_IDS);
    }
    // create map of all objects
    const existing = {};
    queryResult.forEach((r) => {
      existing[r.get('id')] = r;
    });
    return existing;
  }

  /**
   * Assumption:
   * 1. operation is either all/one update or all/one insert
   * @returns {Promise<{status: undefined, objects: Array, plural: string} | never>}
   */
  async handle() {
    let ids;
    let doesObjectHadIds;
    let operation;
    let operationResult;

    const { token } = this;
    const { parent, id } = this.request.url.params;
    const content = this.request.body[parent];

    // check entity
    validateEntityName(this.env.CLASSES, parent);

    if (!content || !loIsArray(content)) {
      throw Boom.badRequest(ErrorCodes.E0008_BAD_REQUEST_BODY);
    }

    const ClassConstructor = this.getClassConstructor(parent);

    if (id) {
      operation = 'UPDATE';
      ids = decodeURIComponent(id).split(',').map(v => v.toString());

      // content supplied and id list should match appropriately
      const filtered = content.filter(object => ids.includes(object.id));

      if (filtered.length <= 0) {
        throw Boom.badRequest(ErrorCodes.E0005_URL_ID_MISMATCH_WITH_OBJECT_ID);
      }

      if (filtered.length !== content.length || filtered.length !== ids.length) {
        throw Boom.badRequest(ErrorCodes.E0004_ID_MISMATCH_WITH_OBJECT_ID);
      }
    } else {
      operation = 'CREATE';
      // this is to check if user has not provided ids in url but
      // there are ids in object, if that is the case throw 400
      doesObjectHadIds = 0;
      content.forEach((object) => {
        if (object.id) {
          doesObjectHadIds += 1;
        }
      });

      if (doesObjectHadIds > 0) {
        throw Boom.badRequest(ErrorCodes.E0006_NO_ID_IN_URL);
      }
    }

    const classInstances = await Promise.all(content.map(resource => ClassConstructor.fromLink(ClassConstructor, resource)));

    if (operation === 'UPDATE') {
      const validIds = loFilter(classInstances.map(o => o.get('id')), o => o !== undefined);
      const existing = await Put.mapRecords(ClassConstructor, validIds);
      const updatedClassInstances = classInstances.map((r) => {
        r.setOriginal(existing[r.get('id')]);
        return r;
      });

      try {
        operationResult = await Promise.all(updatedClassInstances.map(o => token.isAllowed(ClassConstructor.PLURAL, 'edit', o)));
        ids = await mapReflect(operationResult.map(instance => instance.UPDATE().then(() => instance.get('id'))));
      } catch (e) {
        throw Boom.forbidden(ErrorCodes.E0009_PERMISSION_UPDATE, e);
      }
    } else if (operation === 'CREATE') {
      try {
        operationResult = await Promise.all(classInstances.map(o => token.isAllowed(ClassConstructor.PLURAL, 'create', o)));
        ids = await mapReflect(operationResult.map(instance => instance.INSERT()));
      } catch (e) {
        throw Boom.forbidden(ErrorCodes.E0010_PERMISSION_INSERT, e);
      }
    }

    const errors = ids.filter(i => i.status === 'rejected').map(i => ({ error: i.e.message }));
    const updatedIds = ids.filter(i => i.status === 'resolved').map(i => i.v);
    const updatedRecords = await Put.searchInDB(ClassConstructor, updatedIds);

    const dbEntries = await Promise.all(updatedRecords.map(resource => resource.toLink(undefined, this.token.rootDir)));

    const rtn = {
      status: undefined,
      objects: [].concat(errors, dbEntries),
      plural: ClassConstructor.PLURAL,
    };

    if (dbEntries.length > 0 && errors.length >= 0) {
      rtn.status = (operation === 'CREATE') ? 201 : 200;
    } else if (errors.length > 0 && dbEntries.length === 0) {
      rtn.status = 400;
      rtn.plural = 'error';
    }

    const respond = {};
    respond[rtn.plural] = rtn.objects;
    return this.response.respond(rtn.status || 200, respond);
  }
}

module.exports = Put;
