import mongoose, { Schema, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String, // icon name or image URL
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.Service || mongoose.model("Service", ServiceSchema);
