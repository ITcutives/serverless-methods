/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('@hapi/boom');
const loGet = require('lodash/get');
const loSet = require('lodash/set');
const ErrorCodes = require('./helpers/error-codes.json');
const { mapReflect } = require('./helpers/common');
const { ConditionBuilder, Prepare } = require('./helpers/queryStringParser');
const Get = require('./get');
const { ApiAction } = require('./helpers/enum');

class Head extends Get {
  async handle() {
    loSet(this, 'request.url.query.fields', ['id']);
    loSet(this, 'request.url.query.order', 'id');
    loSet(this, 'request.url.query.page.number', undefined);
    let pageSize = loGet(this, 'request.url.query.page.size');

    const { token } = this;

    const condition = ConditionBuilder(this.request.url.params, this.env.CLASSES, this.token.rootDir);
    const ClassConstructor = condition.class;
    pageSize = pageSize || ClassConstructor.PAGESIZE;
    const classInstance = this.getClassInstance(ClassConstructor);
    const select = Prepare.fields(ClassConstructor, loGet(this, 'request.url.query.fields'));
    const order = Prepare.orderBy(ClassConstructor, loGet(this, 'request.url.query.order'));

    condition.cond = condition.cond.concat(ClassConstructor.getCondition(token));

    const filter = Prepare.filter(ClassConstructor, this.request.url.query.filter);
    condition.cond = condition.cond.concat(filter);

    // condition, select, order, from, limit
    const queryResult = await classInstance.SELECT(condition.cond, select.fields, order);
    // if there are no record found
    if (queryResult.length <= 0) {
      throw Boom.notFound(ErrorCodes.E0015_NO_MATCHING_RECORD);
    }
    const afterPermissionChecked = await mapReflect(queryResult.map((o) => token.isAllowed(ClassConstructor.PLURAL, ApiAction.GET, o)));

    if (afterPermissionChecked.length <= 0) {
      throw Boom.forbidden(ErrorCodes.E0011_PERMISSION_READ);
    }

    const success = await Promise.all(afterPermissionChecked
      .filter((x) => x.status === 'resolved')
      .map((x) => x.v.toLink(select.links, this.token.rootDir)));

    const status = success.length === 0 ? 404 : 200;
    const { length } = success;
    const headers = {
      'Access-Control-Expose-Headers': [
        '*',
        'x-platform-count',
        'x-platform-pages',
      ].join(', '),
      'x-platform-count': length,
      'x-platform-pages': Math.ceil(length / pageSize),
      'content-type': 'application/json',
    };
    return this.response.respond(status, null, headers);
  }
}

module.exports = Head;
