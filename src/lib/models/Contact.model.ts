import mongoose, { Schema, models } from "mongoose";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isResolved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default models.Contact || mongoose.model("Contact", ContactSchema);
