import mongoose, { Schema, models } from "mongoose";

const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "Guide",
      trim: true,
    },

    fileType: {
      type: String,
      default: "pdf",
      trim: true,
    },

    size: {
      type: String,
      default: "",
      trim: true,
    },

    fileUrl: {
      type: String,
      default: "",
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

ResourceSchema.index({ isPublished: 1, createdAt: -1 });
ResourceSchema.index({ category: 1 });

export default models.Resource || mongoose.model("Resource", ResourceSchema);
