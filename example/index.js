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
 */
module.exports.handler = async (event, context) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const request = REQ.normaliseLambdaRequest(event);
  const response = new RES();
  let handler;
  let token;

  try {
    token = await Token.Handler(request.headers.authorization, Config.JWT_SECRET);
    await DB.CONNECT(Config.DB);
    await token.prepare();
    token.rootDir = path.join(__dirname, 'src');
    request.setToken(token);
    const Method = require(`../src/${request.method}`);
    handler = new Method(request, response, Config, token);
    const resp = await handler.handle();
    return await ResponseHandler.responseHandler(resp);
  } catch (e) {
    // eslint-disable-next-line no-return-await
    return await ResponseHandler.errorHandler(e);
  }
};
