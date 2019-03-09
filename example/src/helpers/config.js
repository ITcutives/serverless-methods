process.env.debug = 'true';
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTIONLIMIT,
    url: process.env.DB_URL,
    db: process.env.DB_DB,
  },
  CLASSES: [
    'users',
    'articles',
  ],
};
