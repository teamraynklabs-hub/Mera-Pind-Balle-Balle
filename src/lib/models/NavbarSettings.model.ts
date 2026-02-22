import { Schema, model, models } from "mongoose";

const NavLinkSchema = new Schema(
  {
    title: { type: String, required: true },
    href: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const NavbarSettingsSchema = new Schema(
  {
    brandName: { type: String, default: "Mera Pind Balle Balle" },
    logoUrl: { type: String, default: "/logo.jpeg" },
    navLinks: [NavLinkSchema],
    showCart: { type: Boolean, default: true },
    showLogin: { type: Boolean, default: true },
    showThemeToggle: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default models.NavbarSettings ||
  model("NavbarSettings", NavbarSettingsSchema);
