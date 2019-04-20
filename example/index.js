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
 */
module.exports.handler = async (event) => {
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
    return ResponseHandler.responseHandler(resp);
  } catch (e) {
    return ResponseHandler.errorHandler(e);
  }
};
