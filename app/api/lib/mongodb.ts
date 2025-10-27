import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/** 
 * Type definition for cached MongoDB connection object.
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

/** 
 * Global type declaration for MongoDB cached connection.
 */
declare global {
  var mongoose: MongooseCache | undefined;
}

/** 
 * Cached connection for MongoDB to avoid multiple connections in development.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Reuses existing connection if available.
 */
async function dbConnect() {
  // Check for MONGODB_URI at runtime (not build time)
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;