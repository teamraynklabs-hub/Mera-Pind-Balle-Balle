import mongoose from "mongoose";

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: CachedConnection = {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Check if already connected via mongoose
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  // Create new connection promise if not in progress
  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    cached.promise = mongoose
      .connect(mongoUri, {
        // Connection pooling for scalability
        maxPoolSize: 10,
        minPoolSize: 5,
        // Timeouts for serverless
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 30000,
        // Reliability
        retryWrites: true,
        retryReads: true,
        // Serverless optimization
        bufferCommands: false,
        // Auto-indexing (disable in production)
        autoIndex: process.env.NODE_ENV !== "production",
        // IPv4 for better cloud compatibility
        family: 4,
      })
      .then((mongoose) => {
        console.log("✓ MongoDB connected with connection pooling");
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("✗ MongoDB connection failed:", error);
        throw error;
      });
  }

  // Wait for the promise and cache the result
  cached.conn = await cached.promise;
  return cached.conn;
}