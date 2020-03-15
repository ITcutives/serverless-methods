const assert = require('assert');
const Request = require('./Request');
const { clean } = require('./Mongo');

async function validateEmptyResponses(r, tenantId) {
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
  /**
   * ======================================================================================
   * GET /users - 404 Not found
   * GET /organisations - 404 Not found
   * GET /permissions - 404 Not found
   * GET /tags - 404 Not found
   * GET /memberships - 404 Not found
   */
  console.time(`PASS \t GET /account-${tenantId}/users`);
  const users = await r.GET('users');
  assert.deepEqual(users, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/users`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/organisations`);
  const organisations = await r.GET('organisations');
  assert.deepEqual(organisations, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/organisations`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/permissions`);
  const permissions = await r.GET('permissions');
  assert.deepEqual(permissions, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/permissions`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/tags`);
  const tags = await r.GET('tags');
  assert.deepEqual(tags, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/tags`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/memberships`);
  const memberships = await r.GET('memberships');
  assert.deepEqual(memberships, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/memberships`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/subscriptions`);
  const subscriptions = await r.GET('subscriptions');
  assert.deepEqual(subscriptions, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/subscriptions`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/messages`);
  const messages = await r.GET('messages');
  assert.deepEqual(messages, error404);
  console.timeEnd(`PASS \t GET /account-${tenantId}/messages`);
}

const multiTenant = async (tenantId) => {
  const data = {
    new: {
      superUsers: {
        id: 'ashish@itcutives.com',
        attributes: {
          language: 'en',
        },
      },
      adminUsers: {
        id: 'manish@itcutives.com',
        attributes: {
          language: 'en',
        },
      },
      supervisorUsers: {
        id: 'riddhi@itcutives.com',
        attributes: {
          language: 'en',
        },
      },
      organisations: {
        name: 'HooliCo',
        config: {
          address: 'newLane st.',
        },
      },
      permissions: {
        role: 'USER',
        links: {
          organisations: null,
          users: null,
        },
      },
      tags: {
        name: 'Accounts',
        config: {
          language: 'en',
        },
        links: {
          organisations: null,
        },
      },
      memberships: {
        role: 'MEMBER',
        links: {
          tags: null,
          users: null,
        },
      },
      subscriptions: {
        type: 'ANDROID',
        address: 'ADDRESS1',
        links: {
          users: null,
          devices: 'DEVICE01',
        },
      },
      messages: {
        config: {},
        broadcastId: 'broadcast001',
        links: {
          users: null,
          senders: 'sender',
        },
      },
    },
    updated: {
      superUsers: {
        id: 'ashish@itcutives.com',
        type: 'USER',
        attributes: {
          language: 'en',
          country: 'AUSTRALIA',
        },
        links: {
          // permissions: [],
          // memberships: [],
        },
      },
      adminUsers: {
        id: 'manish@itcutives.com',
        type: 'USER',
        attributes: {
          language: 'en',
          country: 'INDIA',
        },
        links: {
          // permissions: [],
          // memberships: [],
        },
      },
      supervisorUsers: {
        id: 'riddhi@itcutives.com',
        type: 'USER',
        attributes: {
          language: 'en',
          country: 'FRANCE',
        },
        links: {
          // permissions: [],
          // memberships: [],
        },
      },
      organisations: {
        name: 'HooliCo',
        config: {
          address: 'newLane st.',
          country: 'AUSTRALIA',
        },
        links: {
          // users: [],
          // tags: [],
        },
      },
      permissions: {
        role: 'ADMIN',
        links: {
          organisations: null,
          users: null,
        },
      },
      tags: {
        name: 'Accounts',
        config: {
          language: 'en',
          icon: 'money',
        },
        links: {
          organisations: null,
        },
      },
      memberships: {
        role: 'SUPERVISOR',
        links: {
          tags: null,
          users: null,
        },
      },
      subscriptions: {
        type: 'ANDROID',
        address: 'ADDRESS2',
        links: {
          users: null,
          devices: 'DEVICE01',
        },
      },
      messages: {
        config: {},
        status: 'READ',
        broadcastId: 'broadcast001',
        links: {
          users: null,
          senders: 'sender',
        },
        type: 'info',
      },
    },
  };
  let users;
  let organisations;
  let permissions;
  let tags;
  let memberships;
  let subscriptions;
  let messages;

  const config = {
    host: 'localhost',
    port: 3000,
    path: `/v1/account-${tenantId}`,
    // host: 'sgdd2m8ysc.execute-api.ap-southeast-2.amazonaws.com',
    // port: 443,
    // path: '/dev/v1',
    jwt: {
      key: 'abcd',
      iss: 'ashish@itcutives.com',
    },
  };

  const r = new Request(config);

  await validateEmptyResponses(r, tenantId);

  /**
   * ======================================================================================
   * POST /users - 201 Create
   * PUT /organisations - 201 Create
   * PUT /tags - 201 Create - with organisationId
   * PUT /permissions - 201 Create - with userId and organisationId
   * PUT /memberships - 201 Create - with userId and tagId
   * PUT /subscriptions - 201 Create - with userId and tagId
   */
  console.time(`PASS \t POST /account-${tenantId}/users (SUPER)`);
  data.superUsers = await r.POST('users', data.new.superUsers);
  data.new.superUsers.id = data.superUsers.body.users[0].id;
  assert.equal(data.superUsers.status, 201);
  assert.ok(data.new.superUsers.id);
  console.timeEnd(`PASS \t POST /account-${tenantId}/users (SUPER)`);

  console.time(`PASS \t POST /account-${tenantId}/users (ADMIN)`);
  data.adminUsers = await r.POST('users', data.new.adminUsers);
  data.new.adminUsers.id = data.adminUsers.body.users[0].id;
  assert.equal(data.adminUsers.status, 201);
  assert.ok(data.new.adminUsers.id);
  console.timeEnd(`PASS \t POST /account-${tenantId}/users (ADMIN)`);

  console.time(`PASS \t POST /account-${tenantId}/users (SUPERVISOR)`);
  data.supervisorUsers = await r.POST('users', data.new.supervisorUsers);
  data.new.supervisorUsers.id = data.supervisorUsers.body.users[0].id;
  assert.equal(data.supervisorUsers.status, 201);
  assert.ok(data.new.supervisorUsers.id);
  console.timeEnd(`PASS \t POST /account-${tenantId}/users (SUPERVISOR)`);
  // -----------------------------------------------
  console.time(`PASS \t PUT /account-${tenantId}/organisations`);
  organisations = await r.PUT('organisations', data.new.organisations);
  data.new.organisations.id = organisations.body.organisations[0].id;
  assert.equal(organisations.status, 201);
  assert.ok(data.new.organisations.id);
  console.timeEnd(`PASS \t PUT /account-${tenantId}/organisations`);
  // -----------------------------------------------
  data.new.permissions.links.organisations = data.new.organisations.id;
  data.new.permissions.links.users = data.new.adminUsers.id;

  console.time(`PASS \t PUT /account-${tenantId}/permissions`);
  permissions = await r.PUT('permissions', data.new.permissions);
  data.new.permissions.id = permissions.body.permissions[0].id;
  assert.equal(permissions.status, 201);
  console.timeEnd(`PASS \t PUT /account-${tenantId}/permissions`);
  // -----------------------------------------------
  data.new.tags.links.organisations = data.new.organisations.id;

  console.time(`PASS \t PUT /account-${tenantId}/tags`);
  tags = await r.PUT('tags', data.new.tags);
  data.new.tags.id = tags.body.tags[0].id;
  assert.equal(tags.status, 201);
  assert.ok(data.new.tags.id);
  console.timeEnd(`PASS \t PUT /account-${tenantId}/tags`);
  // -----------------------------------------------
  data.new.memberships.links.tags = data.new.tags.id;
  data.new.memberships.links.users = data.new.supervisorUsers.id;

  console.time(`PASS \t PUT /account-${tenantId}/memberships`);
  memberships = await r.PUT('memberships', data.new.memberships);
  data.new.memberships.id = memberships.body.memberships[0].id;
  assert.equal(memberships.status, 201);
  console.timeEnd(`PASS \t PUT /account-${tenantId}/memberships`);
  // -----------------------------------------------
  data.new.subscriptions.links.users = data.new.supervisorUsers.id;

  console.time(`PASS \t PUT /account-${tenantId}/subscriptions`);
  subscriptions = await r.PUT('subscriptions', data.new.subscriptions);
  data.new.subscriptions.id = subscriptions.body.subscriptions[0].id;
  assert.equal(subscriptions.status, 201);
  console.timeEnd(`PASS \t PUT /account-${tenantId}/subscriptions`);
  // -----------------------------------------------
  data.new.messages.links.users = data.new.supervisorUsers.id;

  console.time(`PASS \t PUT /account-${tenantId}/messages`);
  messages = await r.PUT('messages', data.new.messages);
  data.new.messages.id = messages.body.messages[0].id;
  assert.equal(messages.status, 201);
  console.timeEnd(`PASS \t PUT /account-${tenantId}/messages`);

  /**
   * ================================================
   */
  Object.keys(data.updated).forEach((e) => {
    data.updated[e].id = data.new[e].id;
  });

  data.updated.permissions.links.organisations = data.new.organisations.id;
  data.updated.permissions.links.users = data.new.adminUsers.id;

  data.updated.tags.links.organisations = data.new.organisations.id;

  data.updated.memberships.links.tags = data.new.tags.id;
  data.updated.memberships.links.users = data.new.supervisorUsers.id;
  data.updated.subscriptions.links.users = data.new.supervisorUsers.id;
  data.updated.messages.links.users = data.new.supervisorUsers.id;

  /**
   * ======================================================================================
   * PATCH /users/:id - 200 Success - update attribute
   * PATCH /organisations/:id - 200 Success - update config
   * PATCH /permissions/:id - 200 Success - update role
   * PATCH /tags/:id - 200 Success - update config
   * PATCH /memberships/:id - 200 Success - update role
   */
  console.time(`PASS \t PATCH /account-${tenantId}/users/${data.new.superUsers.id}`);
  data.new.superUsers.attributes.country = 'AUSTRALIA';
  users = await r.PATCH('users', data.new.superUsers, data.new.superUsers.id);
  assert.equal(users.status, 200);
  assert.deepEqual(users.body.users[0], data.updated.superUsers);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/users/${data.new.superUsers.id}`);

  console.time(`PASS \t PATCH /account-${tenantId}/users/${data.new.adminUsers.id}`);
  data.new.adminUsers.attributes.country = 'INDIA';
  users = await r.PATCH('users', data.new.adminUsers, data.new.adminUsers.id);
  assert.equal(users.status, 200);
  assert.deepEqual(users.body.users[0], data.updated.adminUsers);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/users/${data.new.adminUsers.id}`);

  console.time(`PASS \t PATCH /account-${tenantId}/users/${data.new.supervisorUsers.id}`);
  data.new.supervisorUsers.attributes.country = 'FRANCE';
  users = await r.PATCH('users', data.new.supervisorUsers, data.new.supervisorUsers.id);
  assert.equal(users.status, 200);
  assert.deepEqual(users.body.users[0], data.updated.supervisorUsers);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/users/${data.new.supervisorUsers.id}`);
  // -----------------------------------------------
  console.time(`PASS \t PATCH /account-${tenantId}/organisations/${data.new.organisations.id}`);
  data.new.organisations.config.country = 'AUSTRALIA';
  organisations = await r.PATCH('organisations', data.new.organisations, data.new.organisations.id);
  assert.equal(organisations.status, 200);
  assert.deepEqual(organisations.body.organisations[0], data.updated.organisations);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/organisations/${data.new.organisations.id}`);
  // -----------------------------------------------
  console.time(`PASS \t PATCH /account-${tenantId}/permissions/${data.new.permissions.id}`);
  data.new.permissions.role = 'ADMIN';
  permissions = await r.PATCH('permissions', data.new.permissions, data.new.permissions.id);
  assert.equal(permissions.status, 200);
  assert.deepEqual(permissions.body.permissions[0], data.updated.permissions);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/permissions/${data.new.permissions.id}`);
  // -----------------------------------------------
  console.time(`PASS \t PATCH /account-${tenantId}/tags/${data.new.tags.id}`);
  data.new.tags.config.icon = 'money';
  tags = await r.PATCH('tags', data.new.tags, data.new.tags.id);
  assert.equal(tags.status, 200);
  assert.deepEqual(tags.body.tags[0], data.updated.tags);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/tags/${data.new.tags.id}`);
  // -----------------------------------------------
  console.time(`PASS \t PATCH /account-${tenantId}/memberships/${data.new.memberships.id}`);
  data.new.memberships.role = 'SUPERVISOR';
  memberships = await r.PATCH('memberships', data.new.memberships, data.new.memberships.id);
  assert.equal(memberships.status, 200);
  assert.deepEqual(memberships.body.memberships[0], data.updated.memberships);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/memberships/${data.new.memberships.id}`);
  // -----------------------------------------------
  console.time(`PASS \t PATCH /account-${tenantId}/subscriptions/${data.new.subscriptions.id}`);
  data.new.subscriptions.address = 'ADDRESS2';
  subscriptions = await r.PATCH('subscriptions', data.new.subscriptions, data.new.subscriptions.id);
  assert.equal(subscriptions.status, 200);
  assert.deepEqual(subscriptions.body.subscriptions[0], data.updated.subscriptions);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/subscriptions/${data.new.subscriptions.id}`);
  // -----------------------------------------------
  console.time(`PASS \t PATCH /account-${tenantId}/messages/${data.new.messages.id}`);
  data.new.messages.status = 'READ';
  messages = await r.PATCH('messages', data.new.messages, data.new.messages.id);
  assert.equal(messages.status, 200);
  assert.deepEqual(messages.body.messages[0], data.updated.messages);
  console.timeEnd(`PASS \t PATCH /account-${tenantId}/messages/${data.new.messages.id}`);
  // console.timeEnd(JSON.stringify(messages.body.messages[0], null, 4));
  // console.timeEnd(JSON.stringify(data.updated.messages, null, 4));
  /**
   * ======================================================================================
   * GET /users - 200 Success return 3 users
   * GET /organisations - 200 Success return organisation
   * GET /permissions - 200 Success
   * GET /tags - 200 Success
   * GET /memberships - 200 Success
   */
  ['superUsers', 'adminUsers', 'supervisorUsers'].forEach((v) => {
    data.updated[v].links.permissions = [];
    data.updated[v].links.memberships = [];
    data.updated[v].links.subscriptions = [];
    data.updated[v].links.messages = [];
  });
  data.updated.adminUsers.links.permissions.push(data.updated.permissions.id);
  data.updated.supervisorUsers.links.memberships.push(data.updated.memberships.id);
  data.updated.supervisorUsers.links.subscriptions.push(data.updated.subscriptions.id);
  data.updated.supervisorUsers.links.messages.push(data.updated.messages.id);
  console.time(`PASS \t GET /account-${tenantId}/users`);
  users = await r.GET('users');
  assert.deepEqual(users.body.users, [data.updated.superUsers, data.updated.adminUsers, data.updated.supervisorUsers]);
  console.timeEnd(`PASS \t GET /account-${tenantId}/users`);
  // -----------------------------------------------
  data.updated.organisations.links.users = [data.updated.adminUsers.id];
  data.updated.organisations.links.tags = [data.updated.tags.id];

  console.time(`PASS \t GET /account-${tenantId}/organisations`);
  organisations = await r.GET('organisations');
  assert.deepEqual(organisations.body.organisations[0], data.updated.organisations);
  console.timeEnd(`PASS \t GET /account-${tenantId}/organisations`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/permissions`);
  permissions = await r.GET('permissions');
  assert.deepEqual(permissions.body.permissions[0], data.updated.permissions);
  console.timeEnd(`PASS \t GET /account-${tenantId}/permissions`);
  // -----------------------------------------------
  data.updated.tags.links.users = [data.updated.supervisorUsers.id];
  data.updated.tags.links.organisations = data.updated.organisations.id;

  console.time(`PASS \t GET /account-${tenantId}/tags`);
  tags = await r.GET('tags');
  assert.deepEqual(tags.body.tags[0], data.updated.tags);
  console.timeEnd(`PASS \t GET /account-${tenantId}/tags`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/memberships`);
  memberships = await r.GET('memberships');
  assert.deepEqual(memberships.body.memberships[0], data.updated.memberships);
  console.timeEnd(`PASS \t GET /account-${tenantId}/memberships`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/subscriptions`);
  subscriptions = await r.GET('subscriptions');
  assert.deepEqual(subscriptions.body.subscriptions[0], data.updated.subscriptions);
  console.timeEnd(`PASS \t GET /account-${tenantId}/subscriptions`);
  // -----------------------------------------------
  console.time(`PASS \t GET /account-${tenantId}/messages`);
  messages = await r.GET('messages');
  assert.deepEqual(messages.body.messages[0], data.updated.messages);
  console.timeEnd(`PASS \t GET /account-${tenantId}/messages`);

  /**
   * ======================================================================================
   * DELETE /messages/:id
   * DELETE /subscriptions/:id
   * DELETE /memberships/:id
   * DELETE /tags/:id
   * DELETE /permissions/:id
   * DELETE /organisations/:id
   * DELETE /users/:id
   */
  const status204 = {
    status: '204',
    body: '',
  };
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/messages/${data.new.messages.id}`);
  messages = await r.DELETE('messages', data.new.messages.id);
  assert.deepEqual(messages, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/messages/${data.new.messages.id}`);
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/subscriptions/${data.new.subscriptions.id}`);
  subscriptions = await r.DELETE('subscriptions', data.new.subscriptions.id);
  assert.deepEqual(subscriptions, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/subscriptions/${data.new.subscriptions.id}`);
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/memberships/${data.new.memberships.id}`);
  memberships = await r.DELETE('memberships', data.new.memberships.id);
  assert.deepEqual(memberships, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/memberships/${data.new.memberships.id}`);
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/tags/${data.new.tags.id}`);
  tags = await r.DELETE('tags', data.new.tags.id);
  assert.deepEqual(tags, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/tags/${data.new.tags.id}`);
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/permissions/${data.new.permissions.id}`);
  permissions = await r.DELETE('permissions', data.new.permissions.id);
  assert.deepEqual(permissions, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/permissions/${data.new.permissions.id}`);
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/organisations/${data.new.organisations.id}`);
  organisations = await r.DELETE('organisations', data.new.organisations.id);
  assert.deepEqual(organisations, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/organisations/${data.new.organisations.id}`);
  // -----------------------------------------------
  console.time(`PASS \t DELETE /account-${tenantId}/users/${data.new.superUsers.id}`);
  users = await r.DELETE('users', data.new.superUsers.id);
  assert.deepEqual(users, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/users/${data.new.superUsers.id}`);

  console.time(`PASS \t DELETE /account-${tenantId}/users/${data.new.adminUsers.id}`);
  users = await r.DELETE('users', data.new.adminUsers.id);
  assert.deepEqual(users, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/users/${data.new.adminUsers.id}`);

  console.time(`PASS \t DELETE /account-${tenantId}/users/${data.new.supervisorUsers.id}`);
  users = await r.DELETE('users', data.new.supervisorUsers.id);
  assert.deepEqual(users, status204);
  console.timeEnd(`PASS \t DELETE /account-${tenantId}/users/${data.new.supervisorUsers.id}`);

  /**
   * ======================================================================================
   */
  await validateEmptyResponses(r, tenantId);
};

(async () => {
  await clean();
  // multiTenant('tenant1')
  //   .then(() => console.log('>> finish'))
  //   .catch((e) => console.error(e));
  multiTenant('tenant2')
    .then(() => console.log('>> finish'))
    .catch((e) => console.error(e));
})();
