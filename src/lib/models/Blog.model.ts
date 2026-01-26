import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
BlogSchema.index({ isPublished: 1, date: -1 });
BlogSchema.index({ isPublished: 1, createdAt: -1 });

export default models.Blog || model("Blog", BlogSchema);

