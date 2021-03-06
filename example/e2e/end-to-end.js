const assert = require('assert');
const Request = require('./Request');
const { clean } = require('./Mongo');

const user = 'ashish@itcutives.com';
const config = {
  host: 'localhost',
  port: 3000,
  path: '/v1',
  jwt: {
    key: 'abcd',
    iss: user,
  },
};

const r = new Request(config);

/**
 * Tests:
 *  1. GET /users - 404 Not found
 *  2. GET /articles - 404 Not found
 *
 *  3. PUT /users - 201 Create
 *  4. PUT /articles - 201 Create - with above user id
 *
 *  5. GET /users - 200 Success return user
 *  6. GET /articles - 200 Success return article
 *
 *  7. GET /users/:id - 200 Success return user
 *  8. GET /articles/:id - 200 Success return article
 *
 *  9. PUT /users/:id - 200 Success - update attribute
 * 10. PUT /articles/:id - 200 Success - update title
 *
 * 11. GET /users - 200 Success return user
 * 12. GET /articles - 200 Success return article
 *
 * 13. DELETE /users/:id
 * 14. DELETE /articles/:id
 *
 * 15. GET /users - 200 Success return user
 * 16. GET /articles - 200 Success return article
 *
 * 17. POST /users - 201 Create
 * 18. POST /articles - 201 Create - with above user id
 *
 * 19. GET /users - 200 Success return user
 * 20. GET /articles - 200 Success return article
 *
 * 21. GET /users/:id - 200 Success return user
 * 22. GET /articles/:id - 200 Success return article
 *
 * 23. PATCH /users/:id - 200 Success - update attribute
 * 24. PATCH /articles/:id - 200 Success - update title
 *
 * 25. GET /users - 200 Success return user
 * 26. GET /articles - 200 Success return article
 *
 * 27. DELETE /users/:id
 * 28. DELETE /articles/:id
 *
 * 29. GET /users - 404 Not Found
 * 30. GET /articles - 404 Not Found
 *
 * MULTI USERS
 *
 * PUT /users - 201 Create - u1, u2
 * PUT /articles - 201 Create - u1
 * PUT /articles - 201 Create - u2
 *
 * PUT /articles - modify u1's article thru u2
 * PUT /articles - modify u2's article thru u1
 *
 */
(async () => {
  let users;
  let articles;
  let newUser;
  let userId;
  let newArticle;
  let articleId;
  let updatedUser;
  let updatedArticle;

  await clean();

  /**
   * ======================================================================================
   *  1. GET /users - 404 Not found
   *  2. GET /articles - 404 Not found
   */
  users = await r.GET('users');
  assert.deepEqual(users, {
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
  });
  console.log('PASS \t GET /users');
  // -----------------------------------------------
  articles = await r.GET('articles');
  assert.deepEqual(articles, {
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
  });
  console.log('PASS \t GET /articles');

  /**
   * ======================================================================================
   *  3. PUT /users - 201 Create
   *  4. PUT /articles - 201 Create - with above user id
   */
  newUser = {
    email: user,
    attributes: {
      name: 'ashish',
    },
  };
  users = await r.PUT('users', newUser);
  userId = users.body.users[0].id;
  assert.equal(users.status, 201);
  assert.ok(userId);
  console.log('PASS \t PUT /users');
  // -----------------------------------------------
  newArticle = {
    post: {
      title: 'my new article',
      body: 'this is a test article',
    },
    links: {
      users: users.body.users[0].id,
    },
  };
  articles = await r.PUT('articles', newArticle);
  articleId = articles.body.articles[0].id;
  assert.equal(users.status, 201);
  assert.ok(articleId);
  console.log('PASS \t PUT /articles');

  /**
   * ======================================================================================
   *  5. GET /users - 200 Success return user
   *  6. GET /articles - 200 Success return article
   */
  users = await r.GET('users', articleId, 'articles');
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
    },
    type: 'USER',
    id: userId,
    links: {
      articles: [
        articleId,
      ],
    },
  });
  console.log('PASS \t GET /articles/:article-id/user');
  // -----------------------------------------------
  articles = await r.GET('articles', userId, 'users');
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article',
      body: 'this is a test article',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t GET /users/:user-id/articles');

  /**
   * ======================================================================================
   *  7. GET /users/:id - 200 Success return user
   *  8. GET /articles/:id - 200 Success return article
   */

  users = await r.GET('users', userId);
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
    },
    type: 'USER',
    id: userId,
    links: {
      articles: [
        articleId,
      ],
    },
  });
  console.log('PASS \t GET /users');
  // -----------------------------------------------
  articles = await r.GET('articles', articleId);
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article',
      body: 'this is a test article',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t GET /articles');

  /**
   * ======================================================================================
   *  9. PUT /users/:id - 200 Success - update attribute
   * 10. PUT /articles/:id - 200 Success - update title
   */

  updatedUser = {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
      language: 'en-au',
    },
    type: 'USER',
    id: userId,
  };
  users = await r.PUT('users', updatedUser, userId);
  assert.equal(users.status, 200);
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
      language: 'en-au',
    },
    type: 'USER',
    id: userId,
    links: {
      // articles: [
      //   articleId,
      // ],
    },
  });
  console.log('PASS \t PUT /users/:id');
  // -----------------------------------------------
  updatedArticle = {
    post: {
      title: 'my new article - updated',
      body: 'this is a test article - updated',
    },
    id: articleId,
    links: {
      users: userId,
    },
  };
  articles = await r.PUT('articles', updatedArticle, articleId);
  assert.equal(users.status, 200);
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article - updated',
      body: 'this is a test article - updated',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t PUT /articles/:id');

  /**
   * ======================================================================================
   * 11. GET /users - 200 Success return user
   * 12. GET /articles - 200 Success return article
   */

  users = await r.GET('users', userId);
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
      language: 'en-au',
    },
    type: 'USER',
    id: userId,
    links: {
      articles: [
        articleId,
      ],
    },
  });
  console.log('PASS \t GET /articles/:id');
  // -----------------------------------------------
  articles = await r.GET('articles', articleId);
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article - updated',
      body: 'this is a test article - updated',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t GET /articles/:id');

  /**
   * ======================================================================================
   * 13. DELETE /users/:id
   * 14. DELETE /articles/:id
   */

  users = await r.DELETE('users', userId);
  assert.deepEqual(users, {
    status: '204',
    body: '',
  });
  console.log('PASS \t DELETE /articles/:id');
  // -----------------------------------------------
  articles = await r.DELETE('articles', articleId);
  assert.deepEqual(articles, {
    status: '204',
    body: '',
  });
  console.log('PASS \t DELETE /articles/:id');

  /**
   * ======================================================================================
   * 15. GET /users - 404 Not Found
   * 16. GET /articles - 404 Not Found
   */

  users = await r.GET('users');
  assert.deepEqual(users, {
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
  });
  console.log('PASS \t GET /users');
  // -----------------------------------------------
  articles = await r.GET('articles');
  assert.deepEqual(articles, {
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
  });
  console.log('PASS \t GET /articles');

  /**
   * ======================================================================================
   *  17. POST /users - 201 Create
   *  18. POST /articles - 201 Create - with above user id
   */
  newUser = {
    email: user,
    attributes: {
      name: 'ashish1',
    },
  };
  users = await r.POST('users', newUser);
  userId = users.body.users[0].id;
  assert.equal(users.status, 201);
  assert.ok(userId);
  console.log('PASS \t POST /users');
  // -----------------------------------------------
  newArticle = {
    post: {
      title: 'my new article1',
      body: 'this is a test article1',
    },
    links: {
      users: users.body.users[0].id,
    },
  };
  articles = await r.POST('articles', newArticle);
  articleId = articles.body.articles[0].id;
  assert.equal(users.status, 201);
  assert.ok(articleId);
  console.log('PASS \t POST /articles');

  /**
   * ======================================================================================
   *  19. GET /users - 200 Success return user
   *  20. GET /articles - 200 Success return article
   */
  users = await r.GET('users', articleId, 'articles');
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish1',
    },
    type: 'USER',
    id: userId,
    links: {
      articles: [
        articleId,
      ],
    },
  });
  console.log('PASS \t GET /articles/:article-id/user');
  // -----------------------------------------------
  articles = await r.GET('articles', userId, 'users');
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article1',
      body: 'this is a test article1',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t GET /users/:user-id/articles');

  /**
   * ======================================================================================
   *  21. GET /users/:id - 200 Success return user
   *  22. GET /articles/:id - 200 Success return article
   */

  users = await r.GET('users', userId);
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish1',
    },
    type: 'USER',
    id: userId,
    links: {
      articles: [
        articleId,
      ],
    },
  });
  console.log('PASS \t GET /users');
  // -----------------------------------------------
  articles = await r.GET('articles', articleId);
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article1',
      body: 'this is a test article1',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t GET /articles');

  /**
   * ======================================================================================
   *  23. PATCH /users/:id - 200 Success - update attribute
   *  24. PATCH /articles/:id - 200 Success - update title
   */

  updatedUser = {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
      language: 'en-au',
    },
    type: 'USER',
    id: userId,
  };
  users = await r.PATCH('users', updatedUser, userId);
  assert.equal(users.status, 200);
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
      language: 'en-au',
    },
    type: 'USER',
    id: userId,
    links: {
      // articles: [
      //   articleId,
      // ],
    },
  });
  console.log('PASS \t PATCH /users/:id');
  // -----------------------------------------------
  updatedArticle = {
    post: {
      title: 'my new article - updated2',
      body: 'this is a test article - updated2',
    },
    id: articleId,
    links: {
      users: userId,
    },
  };
  articles = await r.PATCH('articles', updatedArticle, articleId);
  assert.equal(users.status, 200);
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article - updated2',
      body: 'this is a test article - updated2',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t PATCH /articles/:id');

  /**
   * ======================================================================================
   * 25. GET /users - 200 Success return user
   * 26. GET /articles - 200 Success return article
   */

  users = await r.GET('users', userId);
  assert.deepEqual(users.body.users[0], {
    email: 'ashish@itcutives.com',
    attributes: {
      name: 'ashish',
      language: 'en-au',
    },
    type: 'USER',
    id: userId,
    links: {
      articles: [
        articleId,
      ],
    },
  });
  console.log('PASS \t GET /articles/:id');
  // -----------------------------------------------
  articles = await r.GET('articles', articleId);
  assert.deepEqual(articles.body.articles[0], {
    post: {
      title: 'my new article - updated2',
      body: 'this is a test article - updated2',
    },
    id: articleId,
    links: {
      users: userId,
    },
  });
  console.log('PASS \t GET /articles/:id');

  /**
   * ======================================================================================
   * 27. DELETE /users/:id
   * 28. DELETE /articles/:id
   */

  users = await r.DELETE('users', userId);
  assert.deepEqual(users, {
    status: '204',
    body: '',
  });
  console.log('PASS \t DELETE /articles/:id');
  // -----------------------------------------------
  articles = await r.DELETE('articles', articleId);
  assert.deepEqual(articles, {
    status: '204',
    body: '',
  });
  console.log('PASS \t DELETE /articles/:id');

  /**
   * ======================================================================================
   * 29. GET /users - 404 Not Found
   * 30. GET /articles - 404 Not Found
   */

  users = await r.GET('users');
  assert.deepEqual(users, {
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
  });
  console.log('PASS \t GET /users');
  // -----------------------------------------------
  articles = await r.GET('articles');
  assert.deepEqual(articles, {
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
  });
  console.log('PASS \t GET /articles');

  // ======================================================

  // console.log(JSON.stringify(users, null, 4));
  // console.log(JSON.stringify(articles, null, 4));
})();
