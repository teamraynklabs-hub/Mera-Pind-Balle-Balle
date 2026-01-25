import { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: String,
    type: String,
    link: String,
    description: String,
  }
);

const ResourcesPageSchema = new Schema(
  {
    bannerImage: { type: String, required: true },

    documents: {
      type: [DocumentSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.ResourcesPage ||
  model("ResourcesPage", ResourcesPageSchema);
