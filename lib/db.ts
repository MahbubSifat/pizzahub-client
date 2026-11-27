import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing environment variable: MONGODB_URI");
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    appName: "pizzahub",
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 5000, // function ঘুমানোর আগেই অলস সংযোগ বন্ধ হয়
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  });

// Vercel-এ function freeze হওয়ার আগে সংযোগ গুছিয়ে নেয়
if (process.env.VERCEL) {
  attachDatabasePool(client);
}

globalForMongo._mongoClient = client;

export default client;