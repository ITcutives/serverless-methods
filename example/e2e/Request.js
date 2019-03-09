const http = require('http');
const JWT = require('jsonwebtoken');

class Request {
  /**
   * @param config - { hostname: '', jwt: { key: '', iss: ''} }
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * @returns {*}
   */
  generateJWT() {
    const iat = Math.floor(Date.now() / 1000);
    const obj = {
      iss: this.config.jwt.iss,
      iat,
      exp: iat + (60 * 0.5), // for 30 seconds validity
    };
    return `Bearer ${JWT.sign(obj, this.config.jwt.key)}`;
  }

  GET(entity, id) {
    return this.request('GET', `${this.config.path}/${entity}${id ? `/${id}` : ''}`);
  }

  PUT(entity, request, id = null) {
    return this.request('PUT', `${this.config.path}/${entity}${id ? `/${id}` : ''}`, { [entity]: [request] });
  }

  DELETE(entity, id) {
    return this.request('DELETE', `${this.config.path}/${entity}/${id}`);
  }

  request(method, path, requestBody = null) {
    const options = {
      method,
      host: this.config.host,
      port: this.config.port,
      path,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.generateJWT(),
      },
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          let resp;
          try {
            resp = JSON.parse(body.toString());
          } catch (e) {
            resp = body.toString();
          }
          resolve({ status: res.statusCode, body: resp });
        });
      });

      req.on('error', reject);

      if (requestBody) {
        req.write(JSON.stringify(requestBody));
      }

      req.end();
    });
  }
}

module.exports = Request;
