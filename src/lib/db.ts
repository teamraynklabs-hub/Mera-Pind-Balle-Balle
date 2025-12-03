import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected ✔");
  } catch (error: any) {
    console.error("MongoDB Error ❌", error.message);
  }
};
