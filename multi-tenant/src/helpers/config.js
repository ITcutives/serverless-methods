process.env.debug = 'true';
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB: {
    url: process.env.DB_URL,
    db: process.env.DB_DB,
  },
  CLASSES: [
    'memberships',
    'messages',
    'organisations',
    'permissions',
    'subscriptions',
    'tags',
    'users',
  ],
};
