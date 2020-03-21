const http = require('http');
const JWT = require('jsonwebtoken');

class Request {
  /**
   * @param config - { hostname: '', jwt: { key: '', iss: ''}, tenant: '' }
   */
  constructor(config) {
    this.config = config;
    this.setTenant(this.config.tenant);
  }

  setTenant(tenant) {
    this.tenant = tenant;
  }

  getTenant() {
    return this.tenant;
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

  getPathString() {
    let template = this.config.path;
    if (this.getTenant()) {
      template = `${this.config.path}/account-{{tenant}}`;
    }
    return template.replace('{{tenant}}', this.getTenant());
  }

  GET(entity, id, relationship = '') {
    let url = `${this.getPathString()}/${entity}${id ? `/${id}` : ''}`;
    if (relationship !== '' && id) {
      url = `${this.getPathString()}/${relationship}/${id}/${entity}`;
    }
    return this.request('GET', url, null);
  }

  PUT(entity, request, id = null) {
    return this.request('PUT', `${this.getPathString()}/${entity}${id ? `/${id}` : ''}`, { [entity]: Array.isArray(request) ? request : [request] });
  }

  POST(entity, request) {
    return this.request('POST', `${this.getPathString()}/${entity}`, { [entity]: request });
  }

  PATCH(entity, request, id = null) {
    return this.request('PATCH', `${this.getPathString()}/${entity}${id ? `/${id}` : ''}`, { [entity]: request });
  }

  DELETE(entity, id) {
    return this.request('DELETE', `${this.getPathString()}/${entity}/${id}`);
  }

  request(method, path, requestBody = null) {
    const options = {
      method,
      host: this.config.host,
      port: this.config.port || 443,
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
