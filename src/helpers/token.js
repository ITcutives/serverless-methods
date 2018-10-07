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
  static Handler(authorization, auth0) {
    let headerPart;


    let t;

    authorization = authorization || '';
    headerPart = authorization.split(' ');

    t = new Token();
    // in case if we need the raw jwt in future
    t.jwt = headerPart[1];
    switch (headerPart[0]) {
      case 'Bearer':
        t.authorisationType = Token.AUTH0;
        return t.verifyJwt(headerPart[1], auth0, 'base64');
      case 'Token':
        t.authorisationType = Token.KEY;
        return t.decodeJwt(headerPart[1]);
    }
    return Promise.resolve(t);
  }

  verifyJwt(jwt, auth0, encoding) {
    let secret;
    secret = new Buffer(auth0, encoding);
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
