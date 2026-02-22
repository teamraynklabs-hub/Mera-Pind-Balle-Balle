import mongoose, { Schema, models } from "mongoose";

const StorySchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    // Person featured in the story
    name: {
      type: String,
      default: "",
      trim: true,
    },

    // Author who wrote the story
    author: {
      type: String,
      default: "Mera Pind Balle Balle",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    metaKeywords: {
      type: [String],
      default: [],
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
StorySchema.index({ isPublished: 1, createdAt: -1 });
StorySchema.index({ isPublished: 1, featured: -1 });
StorySchema.index({ tags: 1 });

export default models.Story || mongoose.model("Story", StorySchema);
