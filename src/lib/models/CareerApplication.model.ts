import mongoose from "mongoose";

const CareerApplicationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    position: String,
    resumeUrl: String, // later Cloudinary
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.CareerApplication ||
  mongoose.model("CareerApplication", CareerApplicationSchema);
