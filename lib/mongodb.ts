import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise() {
  if (globalForMongo.mongoClientPromise) {
    return globalForMongo.mongoClientPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const client = new MongoClient(uri);
  const clientPromise = client.connect();

  if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getDb() {
  const mongoClient = await getClientPromise();
  const dbName = process.env.MONGODB_DB ?? "u2u";
  return mongoClient.db(dbName);
}
