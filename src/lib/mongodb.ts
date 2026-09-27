import { MongoClient, Db } from "mongodb";

const options = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  tls: true,
  tlsAllowInvalidCertificates: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> | null {
  const uri = (process.env.MONGODB_URI || "").trim();
  if (!uri || uri.includes("localhost:27017")) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    return client.connect();
  }
}

export async function getMongoDb(dbName: string = "devtech_db"): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) {
    return null;
  }
  try {
    const mongoClient = await promise;
    return mongoClient.db(dbName);
  } catch (err) {
    console.error("❌ [MongoDB Error] Failed to connect to MongoDB cluster:", err);
    return null;
  }
}

export function isMongoDbConfigured(): boolean {
  const uri = (process.env.MONGODB_URI || "").trim();
  return Boolean(uri && uri.length > 0 && !uri.includes("localhost:27017"));
}
