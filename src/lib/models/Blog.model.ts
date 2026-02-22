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
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Mera Pind Balle Balle",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
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

BlogSchema.index({ isPublished: 1, date: -1 });
BlogSchema.index({ isPublished: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });

export default models.Blog || model("Blog", BlogSchema);
