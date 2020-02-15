
function resetDatabase() {
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');

  // Connection URL
  const url = process.env.DATABASE_TEST_URI;

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    const db = client.db("game-of-drones-api-test");

    db.collection('moves').deleteMany({})
      .then(function (result) {
        console.log('Documents deleted: ' + result)
      })

    db.collection('players').deleteMany({})
      .then(function (result) {

      })
    client.close();
  });
}

resetDatabase();