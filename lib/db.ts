import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing environment variable: MONGODB_URI");
}

// Dev-এ hot reload বারবার নতুন connection না খোলার জন্য global-এ রাখা হচ্ছে
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

const client =
  globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

export default client;