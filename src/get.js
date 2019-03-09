/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('boom');
const loIsEmpty = require('lodash/isEmpty');
const ErrorCodes = require('./helpers/error-codes.json');
const { mapReflect } = require('./helpers/common');
const { ConditionBuilder, Prepare } = require('./helpers/queryStringParser');
const Abstract = require('./abstract');

class Get extends Abstract {
  async handle() {
    const { token } = this;

    const condition = ConditionBuilder(this.request.url.params, this.env.CLASSES, this.token.rootDir);
    const ClassConstructor = condition.class;
    const classInstance = new ClassConstructor();
    const select = Prepare.fields(ClassConstructor, this.request.url.query.fields);
    const order = Prepare.orderBy(ClassConstructor, this.request.url.query.order);
    const paging = Prepare.page(ClassConstructor, parseInt(this.request.url.query['page[number]'], 10), parseInt(this.request.url.query['page[size]'], 10));

    condition.cond = condition.cond.concat(ClassConstructor.getCondition(token));

    const filter = Prepare.filter(ClassConstructor, this.request.url.query.filter);
    condition.cond = condition.cond.concat(filter);

    // condition, select, order, from, limit
    const queryResult = await classInstance.SELECT(condition.cond, select.fields, order, paging.from, paging.limit);
    // if there are no record found
    if (queryResult.length <= 0) {
      throw Boom.notFound(ErrorCodes.E0015_NO_MATCHING_RECORD);
    }
    const afterPermissionChecked = await mapReflect(queryResult.map(o => token.isAllowed(ClassConstructor.PLURAL, 'get', o)));

    if (afterPermissionChecked.length <= 0) {
      throw Boom.forbidden(ErrorCodes.E0011_PERMISSION_READ);
    }

    const success = await Promise.all(afterPermissionChecked.filter(x => x.status === 'resolved').map(x => x.v.toLink(select.links, this.token.rootDir)));

    if (loIsEmpty(success)) {
      // internal server error
      throw Boom.boomify(new Error(ErrorCodes.E0012_INTERNAL_ERROR), 500);
    }
    const rtn = {};
    const status = success.length === 0 ? 404 : 200;
    rtn[ClassConstructor.PLURAL] = success;
    return this.response.respond(status, rtn);

  }
}

module.exports = Get;
