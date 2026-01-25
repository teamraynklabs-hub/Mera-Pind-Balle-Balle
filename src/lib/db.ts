// lib/dbConnect.ts (suggested rename)
import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}