/**
 * Created by ashish on 29/05/2018.
 */
const REQ = require('@itcutives/serverless-helpers/src/request');
const RES = require('@itcutives/serverless-helpers/src/response');
const { finish, errorHandler } = require('@itcutives/serverless-helpers/src/lambdaCallbackHandler');

const Token = require('../src/helpers/token');

const Config = require('./helpers/config');
const DB = require('./helpers/db.provider');

/**
 * @param event
 * @param context
 * @param cb
 */
module.exports.handler = function (event, context, cb) {
  const request = REQ.normaliseLambdaRequest(event);
  const response = new RES();
  let handler;

  Token.Handler(request.headers.authorization, Config.AUTH0)
    .then(token => DB.CONNECT(Config.DATABASE).then(() => token.prepare()))
    .then((token) => {
      if (!token) {
        response.respond(403, { error: 'permission denied' });
        return finish(cb, response.statusCode, response.body, response.headers);
      }

      token.rootDir = __dirname;
      request.setToken(token);

      const Get = require('../src/get');
      handler = new Get(request, response, Config, token);
      return handler.handle();
    })
    .then(response => finish(cb, response.statusCode, response.body, response.headers))
    .catch(error => errorHandler(cb, error));
};
