import { Schema, model, models } from "mongoose";

const BenefitItemSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const StepItemSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const DistributorsPageSchema = new Schema(
  {
    hero: {
      title: { type: String, default: "Become a Distributor" },
      subtitle: { type: String, default: "" },
      bannerImage: { type: String, default: "" },
    },
    benefits: {
      sectionTitle: { type: String, default: "Partnership Benefits" },
      sectionSubtitle: { type: String, default: "" },
      items: [BenefitItemSchema],
    },
    requirements: {
      sectionTitle: { type: String, default: "Requirements" },
      sectionSubtitle: { type: String, default: "" },
      image: { type: String, default: "" },
      items: [{ type: String }],
    },
    steps: {
      sectionTitle: { type: String, default: "How It Works" },
      sectionSubtitle: { type: String, default: "" },
      items: [StepItemSchema],
    },
    formSection: {
      title: { type: String, default: "Apply Now" },
      subtitle: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default models.DistributorsPage ||
  model("DistributorsPage", DistributorsPageSchema);
