import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

// Serverless-এ প্রতি অনুরোধে নতুন সংযোগ না বানিয়ে একই client ব্যবহার হয়
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 8000, // ৩০ সেকেন্ড ঝুলে না থেকে দ্রুত ব্যর্থ বা আবার চেষ্টা
    connectTimeoutMS: 8000,
    socketTimeoutMS: 30000,
    family: 4, // IPv4 বাধ্য করে, IPv6 সংক্রান্ত দেরি এড়াতে
  });

globalForMongo._mongoClient = client;

export default client;