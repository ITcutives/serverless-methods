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
    try {
      if (headerPart[0] === 'Bearer') {
        await t.verifyJwt(headerPart[1], auth0, 'base64');
        t.authorisationType = Token.AUTH0;
      } else if (headerPart[0] === 'Token') {
        await t.decodeJwt(headerPart[1]);
        t.authorisationType = Token.KEY;
      }
    } catch (e) {
      t.authorisationType = Token.UNAUTHORISED;
      console.error(e);
    }
    return t;
  }

  async verifyJwt(jwt, auth0, encoding) {
    const secret = Buffer.from(auth0, encoding);
    this.decoded = JWT.verify(jwt, secret);
    return this;
  }

  async decodeJwt(jwt) {
    this.decoded = JWT.decode(jwt);
    return this;
  }

  async prepare() {
    switch (this.authorisation) {
      case Token.AUTH0:
      case Token.KEY:
        break;
    }
    return this;
  }

  isAllowed(plural, action, object) {
    const Cls = require(`${this.rootDir}/security/${plural}`);
    const obj = new Cls(this, action, object);
    return obj.isAllowed();
  }

  getPermission() {
    if (this.authorisation === Token.UNAUTHORISED) {
      return 'UNAUTHORISED';
    }

    if (this.isSuper === true) {
      return 'SUPER';
    }
    return 'ADMIN';
  }
}

module.exports = Token;
