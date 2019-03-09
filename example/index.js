/**
 * Created by ashish on 29/05/2018.
 */
const path = require('path');
const REQ = require('@itcutives/serverless-helpers/src/request');
const RES = require('@itcutives/serverless-helpers/src/response');
const ResponseHandler = require('./src/helpers/lambdaResponseFormatter');
const Token = require('../src/helpers/token');

const Config = require('./src/helpers/config');
const DB = require('./src/helpers/db.provider').Mongo;

/**
 * @param event
 * @param context
 * @param cb
 */
module.exports.handler = (event, context, cb) => {
  const request = REQ.normaliseLambdaRequest(event);
  const response = new RES();
  let handler;

  Token.Handler(request.headers.authorization, Config.JWT_SECRET)
    .then(token => DB.CONNECT(Config.DB).then(() => token.prepare()))
    .then((token) => {
      // eslint-disable-next-line no-param-reassign
      token.rootDir = path.join(__dirname, 'src');
      request.setToken(token);

      const Method = require(`../src/${request.method}`);
      handler = new Method(request, response, Config, token);
      return handler.handle();
    })
    .then(resp => ResponseHandler.finish(cb, resp))
    .catch(error => ResponseHandler.errorHandler(cb, error));
};
