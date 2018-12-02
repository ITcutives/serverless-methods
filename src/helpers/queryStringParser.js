/* eslint-disable no-param-reassign */
/**
 * Created by ashish on 2/2/17.
 */
const Boom = require('boom');
const loIsEmpty = require('lodash/isEmpty');
const loIsArray = require('lodash/isArray');
const loMap = require('lodash/map');
const loTrim = require('lodash/trim');
const loForEach = require('lodash/forEach');
const loFind = require('lodash/find');

const { validateEntityName } = require('./common');
const ErrorCodes = require('./error-codes');

class Prepare {
  /**
   * @param cls
   * @param filter
   * @returns {Array}
   */
  static filter(cls, filter) {
    if (loIsEmpty(filter)) {
      return [];
    }

    if (typeof filter === 'string') {
      try {
        filter = JSON.parse(filter);
      } catch (e) {
        return [];
      }
      if (!Array.isArray(filter)) {
        filter = [filter];
      }
    }

    const finalFilters = [];
    loForEach(filter, (c) => {
      if (typeof c === 'string') {
        try {
          c = JSON.parse(c);
        } catch (e) {
          // no code
        }
      }
      const f = c.field.split('.');
      if (cls.FIELDS.indexOf(f[0]) !== -1) {
        finalFilters.push(c);
      }
    });
    return finalFilters;
  }

  /**
   * @param cls
   * @param qsFields
   * @returns {{fields: Array, links: Array}}
   */
  static fields(cls, qsFields) {
    let isEmptyFieldList;
    const actualFields = cls.FIELDS;
    isEmptyFieldList = false;
    const rtn = {
      fields: [],
      links: [],
    };

    // case 1: no fields
    if (loIsEmpty(qsFields)) {
      isEmptyFieldList = true;
      qsFields = actualFields;
    }
    if (!loIsArray(qsFields)) {
      qsFields = loMap(qsFields.split(','), v => loTrim(v));
    }
    // case 2: valid + invalid fields
    // clean field list, just keep valid fields
    rtn.fields = qsFields.filter((f) => {
      const ff = f.split('.');
      return actualFields.indexOf(ff[0]) !== -1;
    });

    // Links Field values
    // links.users = fields: employer_id, links: users
    // links.applications = links: applications
    // links = fields: employer_id, links: users, applications || links: undefined

    // case 3: links.1to1 + fields
    // case 4: all links
    // case 5: links.1toM + fields

    cls.LINKS.forEach((link) => {
      const linkName = `links.${link.PLURAL}`;
      if (link.TYPE === '1TO1') {
        if (rtn.fields.indexOf(link.LINK) === -1) {
          rtn.fields.push(link.LINK);
        }
        rtn.links.push(link.PLURAL);
      } else if ((qsFields.indexOf(linkName) !== -1 || qsFields.indexOf('links') !== -1 || isEmptyFieldList) && ['1TOM', 'MTOM'].indexOf(link.TYPE) !== -1) {
        rtn.links.push(link.PLURAL);
      }
    });

    if (rtn.fields.indexOf('id') === -1) {
      rtn.fields.push('id');
    }

    return rtn;
  }

  /**
   * @param cls
   * @param qsOrder
   * @returns {*}
   */
  static orderBy(cls, qsOrder) {
    let rtn;
    const actualFields = cls.FIELDS;
    if (!qsOrder) {
      return '';
    }
    if (typeof qsOrder === 'string') {
      qsOrder = loMap(qsOrder.split(','), v => loTrim(v));
    }

    if (loIsArray(qsOrder)) {
      rtn = qsOrder.filter((q) => {
        if (q.indexOf('-') === 0) {
          return (actualFields.indexOf(q.substr(1)) !== -1);
        }
        return (actualFields.indexOf(q) !== -1);
      });
    } else {
      rtn = {};
      loForEach(qsOrder, (v, k) => {
        if (actualFields.indexOf(k) !== -1) {
          rtn[k] = v;
        }
      });
    }
    return rtn;
  }

  /**
   * @param cls
   * @param qsPage
   * @param qsLimit
   * @returns {{from: undefined, limit: *}|*}
   */
  static page(cls, qsPage, qsLimit) {
    if (!qsLimit) {
      qsLimit = cls.PAGESIZE;
    }
    const limit = { from: undefined, limit: qsLimit };
    // 0-999
    // 1000-1999
    if (qsPage) {
      limit.from = (qsPage - 1) * qsLimit;
    }
    return limit;
  }
}

const ConditionBuilder = (path, CLASSES, ModelPath) => {
  const returnv = {
    class: '',
    cond: [],
  };
  if (path.association) {
    // validate the class name
    validateEntityName(CLASSES, path.association);

    // only load the class that is required
    try {
      returnv.class = require(`${ModelPath}/models/${path.association}`);
    } catch (e) {
      throw Boom.badRequest(ErrorCodes.E0013_BAD_ENTITY_NAME);
    }

    const link = loFind(returnv.class.LINKS, v => v.PLURAL === path.parent);
    if (!link) {
      throw Boom.badRequest(ErrorCodes.E0014_BAD_ENTITY_RELATIONSHIP);
    }

    if (link.TYPE === '1TO1') {
      returnv.cond.push({
        field: link.LINK,
        value: path.id,
      });
    } else if (link.TYPE === '1TOM') {
      returnv.cond.push({
        field: 'id',
        operator: 'in',
        value: {
          class: require(`${ModelPath}/models/${path.parent}`),
          condition: { id: path.id },
          select: link.LINK,
        },
      });
    } else if (link.TYPE === 'MTOM') {
      returnv.cond.push({
        field: 'id',
        operator: 'in',
        value: {
          table: link.JOIN,
          condition: {},
          select: link.CHILD,
        },
      });
      returnv.cond[0].value.condition[link.LINK] = path.id;
    }
  } else {
    // validate the class name
    validateEntityName(CLASSES, path.parent);

    // only load the class that is required
    try {
      returnv.class = require(`${ModelPath}/models/${path.parent}`);
    } catch (e) {
      throw Boom.badRequest(ErrorCodes.E0013_BAD_ENTITY_NAME);
    }

    if (path.id) {
      returnv.cond.push({
        field: 'id',
        value: path.id,
      });
    }
  }
  return returnv;
};

module.exports = {
  Prepare,
  ConditionBuilder,
};
