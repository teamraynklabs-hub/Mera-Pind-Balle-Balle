import mongoose from "mongoose";

const initiativeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    icon: String,
  },
  { timestamps: true }
);

export default mongoose.models.Initiative ||
  mongoose.model("Initiative", initiativeSchema);
