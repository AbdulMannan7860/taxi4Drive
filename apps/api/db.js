const dns = require("dns");
const { MongoClient, ObjectId } = require("mongodb");

let client;
let db;

function configureDnsForAtlas(uri) {
  if (!uri?.startsWith("mongodb+srv://")) return;

  const servers = (process.env.MONGODB_DNS_SERVERS || "8.8.8.8,8.8.4.4,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length) {
    dns.setServers(servers);
  }
}

async function connectDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  configureDnsForAtlas(uri);

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB || "data4drive");

  await bookingsCollection().createIndex({ reference: 1 }, { unique: true });
  await bookingsCollection().createIndex({ createdAt: -1 });
  await bookingsCollection().createIndex({ email: 1 });
  await auditLogsCollection().createIndex({ createdAt: -1 });
  await auditLogsCollection().createIndex({ entityId: 1, createdAt: -1 });
  await notificationsCollection().createIndex({ createdAt: -1 });
  await notificationsCollection().createIndex({ status: 1, createdAt: -1 });
  await pushTokensCollection().createIndex({ token: 1 }, { unique: true });

  return db;
}

function bookingsCollection() {
  if (!db) {
    throw new Error("Database is not connected yet.");
  }
  return db.collection(process.env.MONGODB_COLLECTION || "bookings");
}

function vehiclesCollection() {
  if (!db) {
    throw new Error("Database is not connected yet.");
  }
  return db.collection("vehicles");
}

function auditLogsCollection() {
  if (!db) {
    throw new Error("Database is not connected yet.");
  }
  return db.collection("audit_logs");
}

function notificationsCollection() {
  if (!db) {
    throw new Error("Database is not connected yet.");
  }
  return db.collection("notifications");
}

function pushTokensCollection() {
  if (!db) {
    throw new Error("Database is not connected yet.");
  }
  return db.collection("push_tokens");
}

module.exports = {
  auditLogsCollection,
  ObjectId,
  notificationsCollection,
  pushTokensCollection,
  connectDb,
  bookingsCollection,
  vehiclesCollection
};
