const assert = require('assert');
const loGet = require('lodash/get');
const loCloneDeep = require('lodash/cloneDeep');
const loMerge = require('lodash/merge');
const Request = require('./Request');
const TestGenerator = require('./TestGenerator');
const { clean } = require('./Mongo');


async function validateEmptyResponses(r, testGenerator) {
  const entities = [
    { entity: 'organisations', tenant: null },
    { entity: 'users', tenant: null },
    { entity: 'permissions', tenant: null },
    { entity: 'tags', tenant: 'tenant1' },
    { entity: 'tags', tenant: 'tenant2' },
  ];
  /**
   * GET
   */
  const error404 = {
    status: 404,
    body: {
      errors: [{
        status: '404',
        title: 'Not Found',
        detail: 'No matching record found',
        code: 'E0015',
        meta: 'E0015:No matching record found',
      }],
    },
  };
  for (let index = 0; index <= entities.length - 1; index += 1) {
    const test = entities[index];
    testGenerator.setTenant(test.tenant);
    const testArgs = testGenerator.GET(test.entity, undefined, null, TestGenerator.Get404Template().split('\n'))
    testGenerator.addTest(testArgs);

    // console.time(`PASS \t ${testArgs.method} ${testArgs.path}`);
    r.setTenant(test.tenant);

    // eslint-disable-next-line no-await-in-loop
    const response = await r.GET(test.entity);
    assert.deepEqual(response, error404);
    // console.timeEnd(`PASS \t ${testArgs.method} ${testArgs.path}`);
  }
}

function replacePlaceholders(body, postObjects) {
  let o = JSON.stringify(body);
  const allPlaceholders = [...o.matchAll(/{{(.*?)}}/g)];
  allPlaceholders.forEach((search) => {
    o = o.replace(search[0], loGet(postObjects, search[1]));
  });
  return o;
}

function replacePlaceholdersForTest(o) {
  const allPlaceholders = [...o.matchAll(/{{(.*?)}}/g)];
  allPlaceholders.forEach((search) => {
    // eslint-disable-next-line no-param-reassign
    o = o.replace(`"${search[0]}"`, `pm.environment.get("${search[1]}")`);
  });
  return o;
}

const multiTenant = async () => {
  const config = {
    host: 'localhost',
    port: 3000,
    path: '/v1',
    // host: 'sgdd2m8ysc.execute-api.ap-southeast-2.amazonaws.com',
    // port: 443,
    // path: '/dev/v1',
    jwt: {
      key: 'abcd',
      iss: 'ashish@itcutives.com',
    },
  };

  const r = new Request(config);
  const testGenerator = new TestGenerator(config);
  await validateEmptyResponses(r, testGenerator);
  const postObjects = {
    tenant1: {
      entity: 'organisations',
      tenant: null,
      new: {
        name: 'tenant1',
        config: {
          address: 'newLane st.',
        },
        links: {},
      },
      update: {
        id: '{{tenant1.id}}',
        name: 'Hooli',
        config: {
          country: 'Australia',
        },
      },
      id: '',
    },
    tenant2: {
      entity: 'organisations',
      tenant: null,
      new: {
        name: 'tenant2',
        config: {
          address: 'newLane st.',
        },
        links: {},
      },
      update: {
        id: '{{tenant2.id}}',
        name: 'ITcutives',
        config: {
          country: 'India',
        },
      },
      id: '',
    },
    tenant3: {
      entity: 'organisations',
      tenant: null,
      new: {
        name: 'tenant3',
        config: {
          address: 'newLane st.',
        },
        links: {},
      },
      update: {
        id: '{{tenant3.id}}',
        name: 'Phoenix',
        config: {
          country: 'Japan',
        },
      },
      id: '',
    },
    ash: {
      entity: 'users',
      tenant: null,
      new: {
        id: 'ash@serverlesstest.com',
        attributes: {
          language: 'en',
        },
        links: {},
      },
      update: {
        id: '{{ash.id}}',
        attributes: {
          country: 'Australia',
        },
        type: 'USER',
      },
      id: '',
    },
    max: {
      entity: 'users',
      tenant: null,
      new: {
        id: 'max@serverlesstest.com',
        attributes: {
          language: 'en',
        },
        links: {},
      },
      update: {
        id: '{{max.id}}',
        attributes: {
          country: 'France',
        },
        type: 'USER',
      },
      id: '',
    },
    ronie: {
      entity: 'users',
      tenant: null,
      new: {
        id: 'ronie@serverlesstest.com',
        attributes: {
          language: 'en',
        },
        links: {},
      },
      update: {
        id: '{{ronie.id}}',
        attributes: {
          country: 'India',
        },
        type: 'USER',
      },
      id: '',
    },
    ronald: {
      entity: 'users',
      tenant: null,
      new: {
        id: 'ronald@serverlesstest.com',
        attributes: {
          language: 'en',
        },
        links: {},
      },
      update: {
        id: '{{ronald.id}}',
        attributes: {
          country: 'United Kingdom',
        },
        type: 'USER',
      },
      id: '',
    },
    ashPermission: {
      entity: 'permissions',
      tenant: null,
      new: {
        role: 'USER',
        links: {
          organisations: '{{tenant1.id}}',
          users: '{{ash.id}}',
        },
      },
      update: {
        id: '{{ashPermission.id}}',
        role: 'ADMIN',
      },
      id: '',
    },
    maxPermission: {
      entity: 'permissions',
      tenant: null,
      new: {
        role: 'ADMIN',
        links: {
          organisations: '{{tenant2.id}}',
          users: '{{max.id}}',
        },
      },
      update: {
        id: '{{maxPermission.id}}',
        role: 'USER',
      },
      id: '',
    },
    ronaldPermission: {
      entity: 'permissions',
      tenant: null,
      new: {
        role: 'ADMIN',
        links: {
          organisations: '{{tenant1.id}}',
          users: '{{ronald.id}}',
        },
      },
      update: {
        id: '{{ronaldPermission.id}}',
        role: 'USER',
      },
      id: '',
    },
    ronaldPermission2: {
      entity: 'permissions',
      tenant: null,
      new: {
        role: 'USER',
        links: {
          organisations: '{{tenant2.id}}',
          users: '{{ronald.id}}',
        },
      },
      update: {
        id: '{{ronaldPermission2.id}}',
        role: 'ADMIN',
      },
      id: '',
    },
    t1tag1: {
      entity: 'tags',
      tenant: 'tenant1',
      new: {
        name: 'tag1',
        config: {
          language: 'en',
        },
        links: {
          organisations: '{{tenant1.id}}',
        },
      },
      update: {
        id: '{{t1tag1.id}}',
        name: 'Accounts',
      },
      id: '',
    },
    t1tag2: {
      entity: 'tags',
      tenant: 'tenant1',
      new: {
        name: 'tag2',
        config: {
          language: 'en',
        },
        links: {
          organisations: '{{tenant1.id}}',
        },
      },
      update: {
        id: '{{t1tag2.id}}',
        name: 'Sales',
      },
      id: '',
    },
    t2tag1: {
      entity: 'tags',
      tenant: 'tenant2',
      new: {
        name: 'tag1',
        config: {
          language: 'en',
        },
        links: {
          organisations: '{{tenant2.id}}',
        },
      },
      update: {
        id: '{{t2tag1.id}}',
        name: 'Accounts',
      },
      id: '',
    },
    t2tag3: {
      entity: 'tags',
      tenant: 'tenant2',
      new: {
        name: 'tag3',
        config: {
          language: 'en',
        },
        links: {
          organisations: '{{tenant2.id}}',
        },
      },
      update: {
        id: '{{t2tag3.id}}',
        name: 'Marketing',
      },
      id: '',
    },
  };

  /**
   * ======================================================================================
   * POST
   * ======================================================================================
   */
  const entities = Object.keys(postObjects);
  for (let index = 0; index <= entities.length - 1; index += 1) {
    const key = entities[index];
    const test = postObjects[key];

    // generate test
    testGenerator.setTenant(test.tenant);
    const template = TestGenerator.Post201Template().replace('{{itemName}}', key).replace('{{plural}}', test.entity);
    const testArgs = testGenerator.POST(test.entity, test.new, template.split('\n'));
    testGenerator.addTest(testArgs);

    // prepare the request
    r.setTenant(test.tenant);
    const o = replacePlaceholders(test.new, postObjects);

    // execute the request and test
    // console.time(`PASS \t ${testArgs.method} ${testArgs.path}`);
    // eslint-disable-next-line no-await-in-loop
    const result = await r.POST(test.entity, JSON.parse(o));
    test.id = result.body[test.entity][0].id;
    assert.equal(result.status, 201);
    assert.ok(test.id);
    // console.timeEnd(`PASS \t ${testArgs.method} ${testArgs.path}`);
  }
  /**
   * ======================================================================================
   * PATCH
   * ======================================================================================
   */
  for (let index = 0; index <= entities.length - 1; index += 1) {
    const key = entities[index];
    const test = postObjects[key];

    test.update = loMerge(loCloneDeep(test.new), test.update);

    // generate test
    testGenerator.setTenant(test.tenant);
    const template = TestGenerator.Patch200Template()
      .replace('{{itemName}}', key)
      .replace('{{plural}}', test.entity)
      .replace('{{response}}', replacePlaceholdersForTest(JSON.stringify(test.update, null, 2)));
    const testArgs = testGenerator.PATCH(test.entity, test.update, `{{${key}.id}}`, template.split('\n'));
    testGenerator.addTest(testArgs);

    // prepare the request
    r.setTenant(test.tenant);
    const o = replacePlaceholders(test.update, postObjects);

    // execute the request and test
    // console.time(`PASS \t ${testArgs.method} ${testArgs.path}`);
    // eslint-disable-next-line no-await-in-loop
    const result = await r.PATCH(test.entity, JSON.parse(o), test.id);
    assert.equal(result.status, 200);
    assert.deepEqual(result.body[test.entity][0], JSON.parse(o));
    // console.timeEnd(`PASS \t ${testArgs.method} ${testArgs.path}`);
  }

  /**
   * ======================================================================================
   * GET
   * ======================================================================================
   */
  const collections = {
    organisations: {},
    users: {},
    permissions: {},
    'tenant1.tags': {},
    'tenant2.tags': {},
  };
  for (let index = 0; index <= entities.length - 1; index += 1) {
    const key = entities[index];
    const test = postObjects[key];

    const collectionName = test.tenant ? `${test.tenant}.${test.entity}` : test.entity;
    collections[collectionName][key] = test;
  }

  const collectionList = Object.keys(collections);
  for (let index = 0; index <= collectionList.length - 1; index += 1) {
    const collectionName = collectionList[index];
    const records = Object.values(collections[collectionName]).map((c) => c.update);
    const { tenant, entity } = Object.values(collections[collectionName])[0];

    // generate test
    testGenerator.setTenant(tenant);
    const template = TestGenerator.Get200Template()
      .replace('{{plural}}', entity)
      .replace('{{response}}', replacePlaceholdersForTest(JSON.stringify(records.map((e) => e.id), null, 2)));
    const testArgs = testGenerator.GET(entity, null, null, template.split('\n'));
    testGenerator.addTest(testArgs);

    // prepare the request
    r.setTenant(tenant);
    const o = replacePlaceholders(records, postObjects);

    // execute the request and test
    // console.time(`PASS \t ${testArgs.method} ${testArgs.path}`);
    // eslint-disable-next-line no-await-in-loop
    const result = await r.GET(entity);
    assert.equal(result.status, 200);
    assert.deepEqual(result.body[entity].map((e) => e.id), JSON.parse(o).map((e) => e.id));
    // console.timeEnd(`PASS \t ${testArgs.method} ${testArgs.path}`);
  }

  /**
   * ======================================================================================
   * DELETE
   * ======================================================================================
   */
  for (let index = 0; index <= entities.length - 1; index += 1) {
    const key = entities[index];
    const test = postObjects[key];

    // generate test
    testGenerator.setTenant(test.tenant);
    const template = TestGenerator.Delete204Template();
    const testArgs = testGenerator.DELETE(test.entity,`{{${key}.id}}`, template.split('\n'));
    testGenerator.addTest(testArgs);

    // prepare the request
    r.setTenant(test.tenant);

    // execute the request and test
    // console.time(`PASS \t ${testArgs.method} ${testArgs.path}`);
    // eslint-disable-next-line no-await-in-loop
    const result = await r.DELETE(test.entity, test.id);
    assert.equal(result.status, 204);
    assert.deepEqual(result.body, '');
    // console.timeEnd(`PASS \t ${testArgs.method} ${testArgs.path}`);
  }

  await validateEmptyResponses(r, testGenerator);
  console.log(JSON.stringify(testGenerator.basePostman, null, 2));
};

(async () => {
  try {
    await clean();
    await multiTenant();
    await clean();
  } catch (e) {
    console.error(e);
  }
})();
