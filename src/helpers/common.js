/**
 * Created by ashish on 1/2/17.
 */
const Boom = require('boom');
const ErrorCodes = require('./error-codes.json');

const reflect = promise => promise.then(v => ({ v, status: 'resolved' }), e => ({ e, status: 'rejected' }));

const mapReflect = promises => Promise.all(promises.map(reflect));

const validateEntityName = (classes, parent) => {
  // check entity
  if (classes.indexOf(parent) === -1) {
    throw Boom.badRequest(ErrorCodes.E0001_BAD_ENTITY_NAME);
  }
  return true;
};

module.exports = { reflect, mapReflect, validateEntityName };
