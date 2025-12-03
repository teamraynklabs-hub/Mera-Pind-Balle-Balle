import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    summary: String,
  },
  { timestamps: true }
);

export default mongoose.models.Story ||
  mongoose.model("Story", storySchema);
