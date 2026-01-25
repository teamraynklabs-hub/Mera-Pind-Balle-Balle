// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";

const DEFAULT_DASHBOARD = {
  hero: {
    title: "Empowering Villages Through Innovation & Sustainable Products",
    subtitle:
      "Mera Pind Balle Balle works with rural communities to create quality products, generate employment, and encourage sustainable growth.",
    image: "/hero.png",
    primaryCTA: {
      label: "Explore Products",
      link: "/products",
    },
    secondaryCTA: {
      label: "Our Initiatives",
      link: "/services",
    },
  },
  initiatives: [
    {
      title: "Skill Development",
      description: "Training villagers in craft, digital literacy, and entrepreneurship.",
    },
    {
      title: "Women Empowerment",
      description: "Helping rural women build independent and sustainable businesses.",
    },
    {
      title: "Sustainable Products",
      description: "Organic, handmade, eco-friendly items crafted by communities.",
    },
  ],
  popularProducts: [
    {
      title: "Organic Jaggery",
      description: "Pure village-made jaggery with no chemicals.",
      image: "/products/jaggery.jpg", // ← use real paths later
    },
    {
      title: "Handcrafted Baskets",
      description: "Made by artisans using natural materials.",
      image: "/products/baskets.jpg",
    },
    {
      title: "Organic Honey",
      description: "Naturally sourced honey from rural beekeepers.",
      image: "/products/honey.jpg",
    },
  ],
  impact: [
    { label: "Villagers Empowered", value: "2500+" },
    { label: "Women-Owned Units", value: "120+" },
    { label: "Product Lines", value: "65+" },
  ],
  cta: {
    title: "Want to Work With Us?",
    description: "Join us as a distributor, volunteer, or partner NGO.",
    buttonText: "Get in Touch",
    link: "/contact",
  },
  footer: {
    supportLinks: [
      { label: "Resources", link: "/resources" },
      { label: "Distributors", link: "/distributors" },
      { label: "Careers", link: "/careers" },
      { label: "Contact", link: "/contact" },
    ],
    quickLinks: [
      { label: "About Us", link: "/about" },
      { label: "Services", link: "/services" },
      { label: "Products", link: "/products" },
      { label: "Blog", link: "/blog" },
    ],
    legalLinks: [
      { label: "Privacy Policy", link: "/privacy-policy" },
      { label: "Terms & Conditions", link: "/terms-conditions" },
    ],
    socialLinks: [
      { platform: "facebook", link: "https://www.facebook.com/profile.php?id=61583956350717" },
      { platform: "instagram", link: "https://www.instagram.com/merapindballeballe/" },
      { platform: "twitter", link: "https://x.com/Merapindballe" },
      { platform: "youtube", link: "https://youtube.com" },
      { platform: "linkedin", link: "https://www.linkedin.com/in/merapind-balleballe-7242aa392/" },
    ],
  },
  isActive: true,
};

export async function GET() {
  try {
    await connectDB();

    let dashboard = await Dashboard.findOne({ isActive: true }).lean();

    if (!dashboard) {
      console.log("No active dashboard found → creating default");
      dashboard = await Dashboard.create(DEFAULT_DASHBOARD);
      console.log("Default dashboard created");
    }

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);

    // Never fail the frontend — always return something usable
    return NextResponse.json({
      success: true,
      data: DEFAULT_DASHBOARD,
      warning: "Using fallback data due to server error",
    });
  }
}