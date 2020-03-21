const basePostman = require('./base.postman_collection');

class TestGenerator {
  /**
   * @param config - { hostname: '', jwt: { key: '', iss: ''}, tenant: '' }
   */
  constructor(config) {
    this.config = config;
    this.basePostman = basePostman;
    this.setTenant(this.config.tenant);
  }

  setTenant(tenant) {
    this.tenant = tenant;
  }

  getTenant() {
    return this.tenant;
  }

  getPathString(entity) {
    if (['organisations', 'users', 'permissions'].includes(entity)) {
      return this.config.path;
    }
    return `${this.config.path}/account-{{tenant}}`.replace('tenant', this.getTenant());
  }

  GET(entity, id, relationship = '', test = []) {
    let url = `${this.getPathString(entity)}/${entity}${id ? `/${id}` : ''}`;
    if (relationship !== '' && id) {
      url = `${this.getPathString(entity)}/${relationship}/${id}/${entity}`;
    }
    return { method: 'GET', path: url, test };
  }

  PUT(entity, request, id = null, test = []) {
    return {
      method: 'PUT',
      path: `${this.getPathString(entity)}/${entity}${id ? `/${id}` : ''}`,
      body: { [entity]: Array.isArray(request) ? request : [request] },
      test,
    };
  }

  POST(entity, request, test = []) {
    return {
      method: 'POST',
      path: `${this.getPathString(entity)}/${entity}`,
      body: { [entity]: request },
      test,
    };
  }

  PATCH(entity, request, id = null, test = []) {
    return {
      method: 'PATCH',
      path: `${this.getPathString(entity)}/${entity}${id ? `/${id}` : ''}`,
      body: { [entity]: request },
      test,
    };
  }

  DELETE(entity, id, test = []) {
    return {
      method: 'DELETE',
      path: `${this.getPathString(entity)}/${entity}/${id}`,
      test,
    };
  }

  static Get404Template() {
    return `pm.test("Status code is 404", () => {
  pm.response.to.have.status(404);
});

pm.test("response body is error message", () => {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.eql({
    "errors": [
      {
        "status": "404",
        "title": "Not Found",
        "detail": "No matching record found",
        "code": "E0015",
        "meta": "E0015:No matching record found"
      }
    ]
  });
});`;
  }

  static Post201Template() {
    return `pm.test("Status code is 201", () => {
  pm.response.to.have.status(201);
});
var jsonData = pm.response.json();
pm.environment.set("{{itemName}}.id", jsonData.{{plural}}[0].id);
`;
  }

  static Patch200Template() {
    return `pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});
pm.test("response body is valid", () => {
  var jsonData = pm.response.json();
  pm.expect(jsonData.{{plural}}[0]).to.eql({{response}});
});
`;
  }

  static Get200Template() {
    return `pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});
pm.test("response body is valid", () => {
  var jsonData = pm.response.json();
  pm.expect(jsonData.{{plural}}.map((e) => e.id)).to.eql({{response}});
});`;
  }

  static Delete204Template() {
    return `pm.test("Status code is 204", () => {
  pm.response.to.have.status(204);
});`;
  }

  addTest({
    method, path, body, test,
  }) {
    this.basePostman.item.push({
      name: `${method} ${path}`,
      event: test.length < 0 ? undefined : [
        {
          script: {
            exec: test,
            type: 'text/javascript',
          },
        },
      ],
      request: {
        method,
        header: ['GET', 'DELETE'].includes(method) ? [] : [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
        body: ['GET', 'DELETE'].includes(method) ? undefined : {
          mode: 'raw',
          raw: JSON.stringify(body, null, 2),
        },
        url: {
          raw: `{{URL}}${path}`,
          host: [
            '{{URL}}',
          ],
          path: path.split('/').filter((v) => v !== ''),
        },
      },
      response: [],
    });
  }
}

module.exports = TestGenerator;
