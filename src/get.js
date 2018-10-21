/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('boom');
const loIsEmpty = require('lodash/isEmpty');
const ErrorCodes = require('./helpers/error-codes.json');
const { mapReflect } = require('./helpers/common');
const { conditionBuilder, qsPrep } = require('./helpers/queryStringParser');
const Abstract = require('./abstract');

class Get extends Abstract {
  async handle() {
    const { token } = this;

    const condition = conditionBuilder.ConditionBuilder(this.request.url.params, this.env.CLASSES, this.token.rootDir);
    const ClassConstructor = condition.class;
    const classInstance = new ClassConstructor();
    const select = qsPrep.fields(ClassConstructor, this.request.url.query.fields);
    const order = qsPrep.orderBy(ClassConstructor, this.request.url.query.order);
    const paging = qsPrep.page(ClassConstructor, parseInt(this.request.url.query['page[number]'], 10), parseInt(this.request.url.query['page[size]'], 10));

    condition.cond = condition.cond.concat(ClassConstructor.getCondition(token));

    const filter = qsPrep.filter(ClassConstructor, this.request.url.query.filter);
    condition.cond = condition.cond.concat(filter);

    // condition, select, order, from, limit
    const queryResult = await classInstance.SELECT(condition.cond, select.fields, order, paging.from, paging.limit);
    const afterPermissionChecked = await mapReflect(queryResult.map(o => token.isAllowed(ClassConstructor.PLURAL, 'get', o)));

    if (afterPermissionChecked.length <= 0) {
      throw Boom.forbidden(ErrorCodes.E0011_PERMISSION_READ);
    }

    const success = await Promise.all(afterPermissionChecked.filter(x => x.status === 'resolved').map(x => x.v.toLink(select.links, this.token.rootDir)));

    if (loIsEmpty(success)) {
      // internal server error
      throw Boom.wrap(new Error(ErrorCodes.E0012_INTERNAL_ERROR), 500);
    }
    const rtn = {};
    const status = success.length === 0 ? 404 : 200;
    rtn[ClassConstructor.PLURAL] = success;
    return this.response.respond(status, rtn);

  }
}

module.exports = Get;
