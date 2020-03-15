const Config = require('../src/helpers/config');
const DB = require('../src/helpers/db.provider').Mongo;

async function clean() {
  try {
    await DB.CONNECT(Config.DB);
    const connection = await DB.CONN.openConnection();
    await connection.collection('user').deleteMany();
    await connection.collection('organisation').deleteMany();
    await connection.collection('permission').deleteMany();
    await connection.collection('tag').deleteMany();
    await connection.collection('membership').deleteMany();
    await connection.collection('subscription').deleteMany();
    await connection.collection('message').deleteMany();
    await DB.CONN.closeConnection();
  } catch (e) {
    console.error('ERRORRRR: ', e);
  }
}

module.exports = { clean };
