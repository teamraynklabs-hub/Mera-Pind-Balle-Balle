import { Schema, model, models } from "mongoose";

const SectionItemSchema = new Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
  },
  { _id: false }
);

const PrivacyPolicyPageSchema = new Schema(
  {
    hero: {
      title: { type: String, default: "Privacy Policy" },
      subtitle: { type: String, default: "" },
    },
    lastUpdated: { type: String, default: "" },
    sections: [SectionItemSchema],
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default models.PrivacyPolicyPage ||
  model("PrivacyPolicyPage", PrivacyPolicyPageSchema);
