import mongoose, { Schema } from "mongoose";

/* ── Sub-schemas ── */

const LinkItemSchema = new Schema(
  {
    label: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

/* ── Main schema ── */

const FooterPageSchema = new Schema(
  {
    brand: {
      description: { type: String, default: "" },
    },
    quickLinks: {
      columnTitle: { type: String, default: "Quick Links" },
      items: [LinkItemSchema],
    },
    supportLinks: {
      columnTitle: { type: String, default: "Get Involved" },
      items: [LinkItemSchema],
    },
    contactInfo: {
      columnTitle: { type: String, default: "Contact Us" },
      address: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    socialLinks: [SocialLinkSchema],
    legalLinks: [LinkItemSchema],
    copyrightText: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.FooterPage ||
  mongoose.model("FooterPage", FooterPageSchema);
