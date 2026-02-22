import { Schema, model, models } from "mongoose";

const ContactInfoItemSchema = new Schema(
  {
    icon: { type: String, default: "mail" },
    title: { type: String, default: "" },
    lines: [{ type: String }],
    href: { type: String, default: "" },
  },
  { _id: false }
);

const FaqItemSchema = new Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const ContactPageSchema = new Schema(
  {
    hero: {
      title: { type: String, default: "Contact Us" },
      subtitle: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    contactInfo: {
      sectionTitle: { type: String, default: "Get in Touch With Us" },
      sectionSubtitle: { type: String, default: "" },
      items: [ContactInfoItemSchema],
    },
    formSection: {
      title: { type: String, default: "Send Us a Message" },
      subtitle: { type: String, default: "" },
    },
    faqs: {
      sectionTitle: { type: String, default: "Quick Answers" },
      sectionSubtitle: { type: String, default: "" },
      items: [FaqItemSchema],
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default models.ContactPage || model("ContactPage", ContactPageSchema);
