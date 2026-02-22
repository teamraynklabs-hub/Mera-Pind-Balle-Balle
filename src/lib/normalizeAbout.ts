/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Real seed data — used as defaults when DB fields are empty.
 */
export const ABOUT_SEED_DATA = {
  hero: {
    title: "Empowering Rural India, One Village at a Time",
    subtitle:
      "Mera Pind Balle Balle is a social enterprise dedicated to uplifting rural communities — especially women — by reviving traditional crafts, creating sustainable livelihoods, and connecting artisans with conscious consumers worldwide.",
    image: "",
  },
  mission: {
    title: "Our Mission",
    description:
      "To empower rural women and artisan communities across India by providing them with the tools, training, and market access they need to build sustainable livelihoods. We bridge the gap between traditional craftsmanship and modern markets, ensuring every handcrafted product carries dignity, fair wages, and the promise of a better tomorrow.",
    image: "",
  },
  vision: {
    title: "Our Vision",
    description:
      "To build self-reliant and economically vibrant villages by empowering women and local communities through skill-based entrepreneurship, fostering sustainable livelihoods, and transforming rural India into a hub of micro-enterprises.",
    image: "",
  },
  values: {
    sectionTitle: "Our Core Values",
    sectionSubtitle: "The principles that guide everything we do",
    items: [
      {
        icon: "heart",
        title: "Women Empowerment",
        description:
          "Placing women at the center of change — providing skills, markets, and confidence to lead their families towards a brighter future.",
      },
      {
        icon: "leaf",
        title: "Sustainability",
        description:
          "Every product is crafted with respect for the environment, using natural materials and eco-friendly practices passed down through generations.",
      },
      {
        icon: "shield",
        title: "Fair Trade & Trust",
        description:
          "We ensure transparent pricing, fair wages, and trust-based partnerships with every artisan and customer in our community.",
      },
      {
        icon: "users",
        title: "Community First",
        description:
          "We believe in the strength of collective action — our work nurtures entire villages, not just individuals, building lasting impact.",
      },
    ],
  },
  impact: {
    sectionTitle: "Our Impact",
    sectionSubtitle: "Numbers that tell our story of rural transformation",
    stats: [
      { number: "500+", label: "Women Artisans Empowered", icon: "women" },
      { number: "50+", label: "Villages Reached", icon: "villages" },
      { number: "2000+", label: "Handcrafted Products", icon: "products" },
      { number: "10000+", label: "Happy Customers", icon: "customers" },
    ],
  },
  team: {
    sectionTitle: "Meet Our Team",
    sectionSubtitle:
      "Passionate individuals working to create meaningful change in rural India",
    members: [
      {
        name: "Priya Sharma",
        role: "Founder & CEO",
        description:
          "Passionate about rural empowerment and bridging the gap between traditional artisans and modern markets.",
        image: "",
      },
      {
        name: "Amit Verma",
        role: "Head of Operations",
        description:
          "Ensures smooth supply chain management and quality control, connecting villages with customers nationwide.",
        image: "",
      },
      {
        name: "Neha Kaur",
        role: "Community Manager",
        description:
          "Works closely with artisan communities to understand their needs and drive impactful skill-building programs.",
        image: "",
      },
      {
        name: "Rajesh Patel",
        role: "Technology Lead",
        description:
          "Building the digital platform that empowers artisans with visibility and direct access to global customers.",
        image: "",
      },
    ],
  },
  cta: {
    title: "Join Our Mission",
    description:
      "Support rural women artisans and help preserve India's rich craft heritage. Every purchase creates a ripple of positive change across villages.",
    primaryButtonText: "Shop Collection",
    primaryButtonLink: "/products",
    secondaryButtonText: "Read Stories",
    secondaryButtonLink: "/stories",
  },
};

/**
 * Normalizes About data from MongoDB — handles both old and new schema shapes.
 * Falls back to ABOUT_SEED_DATA when fields are empty.
 */
export function normalizeAboutData(raw: any) {
  if (!raw) return { ...ABOUT_SEED_DATA };

  const seed = ABOUT_SEED_DATA;

  return {
    hero: {
      title: raw.hero?.title || seed.hero.title,
      subtitle: raw.hero?.subtitle || raw.hero?.description || seed.hero.subtitle,
      image: raw.hero?.image || "",
    },
    mission: {
      title: raw.mission?.title || seed.mission.title,
      description: raw.mission?.description || seed.mission.description,
      image: raw.mission?.image || "",
    },
    vision: {
      title: raw.vision?.title || seed.vision.title,
      description: raw.vision?.description || seed.vision.description,
      image: raw.vision?.image || "",
    },
    values: {
      sectionTitle: raw.values?.sectionTitle || seed.values.sectionTitle,
      sectionSubtitle: raw.values?.sectionSubtitle || seed.values.sectionSubtitle,
      items: Array.isArray(raw.values?.items) && raw.values.items.length > 0
        ? raw.values.items.map((v: any) => ({
            icon: v.icon || "",
            title: v.title || "",
            description: v.description || "",
          }))
        : Array.isArray(raw.focusAreas) && raw.focusAreas.length > 0
          ? raw.focusAreas.map((fa: any) => ({
              icon: fa.icon || "",
              title: fa.title || "",
              description: fa.description || "",
            }))
          : seed.values.items,
    },
    impact: {
      sectionTitle: raw.impact?.sectionTitle || seed.impact.sectionTitle,
      sectionSubtitle: raw.impact?.sectionSubtitle || seed.impact.sectionSubtitle,
      stats: Array.isArray(raw.impact?.stats) && raw.impact.stats.length > 0
        ? raw.impact.stats.map((s: any) => ({
            number: s.number || "",
            label: s.label || "",
            icon: s.icon || "",
          }))
        : seed.impact.stats,
    },
    team: {
      sectionTitle: raw.team?.sectionTitle || seed.team.sectionTitle,
      sectionSubtitle: raw.team?.sectionSubtitle || seed.team.sectionSubtitle,
      members: Array.isArray(raw.team?.members) && raw.team.members.length > 0
        ? raw.team.members.map((m: any) => ({
            name: m.name || "",
            role: m.role || m.position || "",
            description: m.description || m.bio || "",
            image: m.image || "",
          }))
        : Array.isArray(raw.coreTeam) && raw.coreTeam.length > 0
          ? raw.coreTeam.map((m: any) => ({
              name: m.name || "",
              role: m.role || m.position || "",
              description: m.description || m.bio || "",
              image: m.image || "",
            }))
          : seed.team.members,
    },
    cta: {
      title: raw.cta?.title || seed.cta.title,
      description: raw.cta?.description || seed.cta.description,
      primaryButtonText: raw.cta?.primaryButtonText || raw.cta?.buttonText || seed.cta.primaryButtonText,
      primaryButtonLink: raw.cta?.primaryButtonLink || raw.cta?.buttonLink || seed.cta.primaryButtonLink,
      secondaryButtonText: raw.cta?.secondaryButtonText || seed.cta.secondaryButtonText,
      secondaryButtonLink: raw.cta?.secondaryButtonLink || seed.cta.secondaryButtonLink,
    },
  };
}
