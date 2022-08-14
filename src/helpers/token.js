/**
 * Created by ashish on 29/05/2018.
 */
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');

class Token {
  constructor() {
    this.authorisation = Token.UNAUTHORISED;
    this.decoded = undefined;
  }

  static get UNAUTHORISED() {
    return 'unauthorised';
  }

  static get AUTH0() {
    return 'auth0';
  }

  set rootDir(path) {
    this.root = path;
  }

  get rootDir() {
    return this.root;
  }

  set authorisationType(type) {
    this.authorisation = type;
  }

  /**
   * @param authorization
   * @param auth0
   * @returns {*}
   * @constructor
   */
  static async Handler(authorization, auth0) {
    const headerPart = (authorization || '').split(' ');
    const ClassConstructor = this;

    const t = new ClassConstructor();
    try {
      if (headerPart[0].toLowerCase() !== 'bearer') {
        throw Boom.badRequest(`TOKEN01: Bad header ${authorization}`);
      }
      await t.verifyJwt(headerPart[1], auth0);
      t.authorisationType = Token.AUTH0;
    } catch (e) {
      t.authorisationType = Token.UNAUTHORISED;
      console.error(e);
    }
    return t;
  }

  async verifyJwt(jwt, getKeyFn) {
    return new Promise((resolve, reject) => {
      JWT.verify(jwt, getKeyFn, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        this.decoded = decoded;
        resolve(this);
      });
    });
  }

  async decodeJwt(jwt) {
    this.decoded = JWT.decode(jwt);
    return this;
  }

  async prepare() {
    if (this.authorisation === Token.AUTH0) {
      // no code
    }
    return this;
  }

  isAllowed(plural, action, object) {
    const ClassConstructor = require(`${this.rootDir}/security/${plural}`);
    const obj = new ClassConstructor(this, action, object);
    return obj.isAllowed();
  }

  getPermission() {
    if (this.authorisation === Token.UNAUTHORISED) {
      return 'UNAUTHORISED';
    }

    return 'USER';
  }
}

module.exports = Token;
