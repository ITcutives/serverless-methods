/**
 * Created by ashish on 29/05/2018.
 */
const JWT = require('jsonwebtoken');

class Token {
  constructor() {
    this.authorisation = Token.UNAUTHORISED;
    this.isSuper = false;
    this.decoded = undefined;
  }

  static get UNAUTHORISED() {
    return 'unauthorised';
  }

  static get AUTH0() {
    return 'auth0';
  }

  static get KEY() {
    return 'key';
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
  static async Handler(authorization = '', auth0) {
    const headerPart = authorization.split(' ');

    const t = new Token();
    if (headerPart[0] === 'Bearer') {
      t.authorisationType = Token.AUTH0;
      await t.verifyJwt(headerPart[1], auth0, 'base64');
    } else if (headerPart[0] === 'Token') {
      t.authorisationType = Token.KEY;
      await t.decodeJwt(headerPart[1]);
    } else {
      t.authorisationType = Token.UNAUTHORISED;
    }
    return Promise.resolve(t);
  }

  verifyJwt(jwt, auth0, encoding) {
    const secret = Buffer.from(auth0, encoding);
    this.decoded = JWT.verify(jwt, secret);
    return Promise.resolve(this);
  }

  decodeJwt(jwt) {
    this.decoded = JWT.decode(jwt);
    return Promise.resolve(this);
  }

  prepare() {
    switch (this.authorisation) {
      case Token.AUTH0:
      case Token.KEY:
        break;
    }
    return Promise.resolve(this);
  }

  isAllowed(plural, action, object) {
    const Cls = require(`${this.rootDir}/security/${plural}`);
    const obj = new Cls(this, action, object);
    return obj.isAllowed();
  }

  getPermission() {
    if (this.authorisation === Token.UNAUTHORISED) {
      return 'UNAUTHORISED';
    } if (this.isSuper === true) {
      return 'SUPER';
    }
    return 'ADMIN';
  }
}

module.exports = Token;
