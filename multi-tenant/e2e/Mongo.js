const Config = require('../src/helpers/config');
const DB = require('../src/helpers/db.provider').Mongo;

async function truncateTables(connection) {
  await connection.collection('user').deleteMany();
  await connection.collection('organisation').deleteMany();
  await connection.collection('permission').deleteMany();
  await connection.collection('tag').deleteMany();
  await connection.collection('membership').deleteMany();
  await connection.collection('subscription').deleteMany();
  await connection.collection('message').deleteMany();
}

async function clean() {
  try {
    await DB.CONNECT(Config.DB);
    let connection = await DB.CONN.openConnection();
    await truncateTables(connection);
    connection = await DB.CONN.openConnection('tenant-tenant1');
    await truncateTables(connection);
    connection = await DB.CONN.openConnection('tenant-tenant2');
    await truncateTables(connection);
    await DB.CONN.closeConnection();
  } catch (e) {
    console.error('ERRORRRR: ', e);
  }
}

module.exports = { clean };
