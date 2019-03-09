const { MongoClient } = require('mongodb');
const Config = require('../src/helpers/config');

function connect(url, database) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) {
        reject(err);
        return;
      }

      const db = client.db(database);

      resolve({ db, client });
    });
  });
}

function deleteCollection(db, collectionName) {
  return new Promise((resolve, reject) => {
    db.collection(collectionName, (err, collection) => {
      if (err) {
        reject(err);
        return;
      }
      collection.deleteMany({}, (err2, removed) => {
        if (err2) {
          reject(err);
          return;
        }
        resolve(removed);
      });
    });
  });
}

async function clean() {
  const { db, client } = await connect(Config.DB.url, Config.DB.database);
  await deleteCollection(db, 'user');
  await deleteCollection(db, 'article');
  client.close();
}

module.exports = { clean };
