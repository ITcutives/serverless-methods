// process.env.debug = 'true';
module.exports = {
  DATABASE: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'serverless',
    connectionLimit: 2,
  },
  AUTH0: 'YWJjZA==',
  CLASSES: [
    'users',
    'articles',
  ],
};
