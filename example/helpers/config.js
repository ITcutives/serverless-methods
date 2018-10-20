process.env.debug = 'true';
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
  MONGO: {
    type: 'mongo',
    url: 'mongodb://user:password@host:27017,host:27017,host:27017/Test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    db: 'sls',
  },
  AUTH0: 'YWJjZA==',
  CLASSES: [
    'users',
    'articles',
  ],
};
