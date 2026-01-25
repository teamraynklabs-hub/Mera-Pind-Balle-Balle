import mongoose, { Schema, models } from "mongoose";

const AboutSchema = new Schema(
  {
    hero: {
      title: String,
      description: String,
      image: String,
    },

    mission: {
      title: String,
      description: String,
    },

    vision: {
      title: String,
      description: String,
    },

    values: {
      title: String,
      description: String,
    },

    whyWeExist: {
      description: String,
    },

    focusAreas: [
      {
        title: String,
        description: String,
      },
    ],

    coreTeam: [
      {
        name: String,
        role: String,
        description: String,
        image: String,
      },
    ],

    cta: {
      title: String,
      description: String,
      buttonText: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.About || mongoose.model("About", AboutSchema);
