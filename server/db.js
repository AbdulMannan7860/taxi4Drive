const { MongoClient, ObjectId } = require("mongodb");

let client;
let db;

async function connectDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB || "data4drive");

  await bookingsCollection().createIndex({ reference: 1 }, { unique: true });
  await bookingsCollection().createIndex({ createdAt: -1 });
  await bookingsCollection().createIndex({ email: 1 });

  return db;
}

function bookingsCollection() {
  if (!db) {
    throw new Error("Database is not connected yet.");
  }
  return db.collection(process.env.MONGODB_COLLECTION || "bookings");
}

module.exports = {
  ObjectId,
  connectDb,
  bookingsCollection
};
