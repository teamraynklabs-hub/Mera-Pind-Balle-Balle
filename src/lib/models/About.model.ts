import mongoose, { Schema, models } from "mongoose";

const AboutSchema = new Schema(
  {
    hero: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      image: { type: String, default: "" },
    },

    mission: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
    },

    vision: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
    },

    values: {
      sectionTitle: { type: String, default: "" },
      sectionSubtitle: { type: String, default: "" },
      items: [
        {
          icon: { type: String, default: "" },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },

    impact: {
      sectionTitle: { type: String, default: "" },
      sectionSubtitle: { type: String, default: "" },
      stats: [
        {
          number: { type: String, default: "" },
          label: { type: String, default: "" },
          icon: { type: String, default: "" },
        },
      ],
    },

    team: {
      sectionTitle: { type: String, default: "" },
      sectionSubtitle: { type: String, default: "" },
      members: [
        {
          name: { type: String, default: "" },
          role: { type: String, default: "" },
          description: { type: String, default: "" },
          image: { type: String, default: "" },
        },
      ],
    },

    cta: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      primaryButtonText: { type: String, default: "" },
      primaryButtonLink: { type: String, default: "" },
      secondaryButtonText: { type: String, default: "" },
      secondaryButtonLink: { type: String, default: "" },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.About || mongoose.model("About", AboutSchema);
