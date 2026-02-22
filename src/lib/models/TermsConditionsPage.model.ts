import { Schema, model, models } from "mongoose";

const SectionItemSchema = new Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
  },
  { _id: false }
);

const TermsConditionsPageSchema = new Schema(
  {
    hero: {
      title: { type: String, default: "Terms & Conditions" },
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

export default models.TermsConditionsPage ||
  model("TermsConditionsPage", TermsConditionsPageSchema);
