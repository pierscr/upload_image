const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

exports.insertCropMap = async (mongoObject) => {
  console.log('Mongo config init');
  // Connessione al database MongoDB
  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db(MONGO_DB_NAME);
  const collection = db.collection('cropmap');

  // Inserimento dell'oggetto mongoObject nella collezione cropmap
  await collection.insertOne(mongoObject);

  // Chiusura della connessione al database
  client.close();
};
