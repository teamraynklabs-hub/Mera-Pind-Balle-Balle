export const DISTRIBUTORS_PAGE_SEED_DATA = {
  hero: {
    title: "Become a Distributor",
    subtitle:
      "Join our growing network of distributors and bring authentic rural products to your community. Partner with Mera Pind Balle Balle for quality, sustainability, and social impact.",
    bannerImage: "",
  },
  benefits: {
    sectionTitle: "Partnership Benefits",
    sectionSubtitle:
      "Discover the advantages of becoming a Mera Pind Balle Balle distributor",
    items: [
      {
        title: "Fair Pricing",
        description:
          "Competitive wholesale rates with transparent pricing structure",
      },
      {
        title: "Quality Products",
        description:
          "Authentic handcrafted products directly from artisan communities",
      },
      {
        title: "Marketing Support",
        description:
          "Access to marketing materials, product catalogs, and digital assets",
      },
      {
        title: "Training Programs",
        description:
          "Regular training on product knowledge and sales techniques",
      },
      {
        title: "Exclusive Collections",
        description:
          "First access to new product launches and limited editions",
      },
      {
        title: "Dedicated Support",
        description:
          "Personal account manager to assist with orders and queries",
      },
    ],
  },
  requirements: {
    sectionTitle: "Partnership Requirements",
    sectionSubtitle:
      "What we look for in our distribution partners",
    image: "",
    items: [
      "Passion for handcrafted products and rural artisan empowerment",
      "Valid business registration or GST certificate",
      "Retail space or online selling platform",
      "Minimum order commitment of \u20B950,000 per quarter",
      "Commitment to ethical business practices",
      "Strong network in your local market",
    ],
  },
  steps: {
    sectionTitle: "How It Works",
    sectionSubtitle:
      "Simple steps to become our distribution partner",
    items: [
      { title: "Apply", description: "Submit your application through our form" },
      { title: "Review", description: "Our team reviews your application" },
      { title: "Interview", description: "Meet with our partnership team" },
      { title: "Onboard", description: "Complete training and start selling" },
    ],
  },
  formSection: {
    title: "Apply Now",
    subtitle:
      "Ready to join our network? Fill out the form below and our partnership team will get back to you within 48 hours.",
  },
};

export function normalizeDistributorsPageData(raw: any) {
  if (!raw) return null;

  const seed = DISTRIBUTORS_PAGE_SEED_DATA;

  return {
    hero: {
      title: raw.hero?.title || raw.bannerImage ? raw.hero?.title || seed.hero.title : seed.hero.title,
      subtitle: raw.hero?.subtitle || seed.hero.subtitle,
      bannerImage: raw.hero?.bannerImage || raw.bannerImage || "",
    },
    benefits: {
      sectionTitle: raw.benefits?.sectionTitle || seed.benefits.sectionTitle,
      sectionSubtitle: raw.benefits?.sectionSubtitle || seed.benefits.sectionSubtitle,
      items: Array.isArray(raw.benefits?.items)
        ? raw.benefits.items.map((item: any) => ({
            title: item.title || "",
            description: item.description || "",
          }))
        : Array.isArray(raw.benefits)
        ? raw.benefits.map((b: string) => ({ title: b, description: "" }))
        : seed.benefits.items,
    },
    requirements: {
      sectionTitle: raw.requirements?.sectionTitle || seed.requirements.sectionTitle,
      sectionSubtitle: raw.requirements?.sectionSubtitle || seed.requirements.sectionSubtitle,
      image: raw.requirements?.image || "",
      items: Array.isArray(raw.requirements?.items)
        ? raw.requirements.items
        : Array.isArray(raw.requirements)
        ? raw.requirements
        : seed.requirements.items,
    },
    steps: {
      sectionTitle: raw.steps?.sectionTitle || seed.steps.sectionTitle,
      sectionSubtitle: raw.steps?.sectionSubtitle || seed.steps.sectionSubtitle,
      items: Array.isArray(raw.steps?.items)
        ? raw.steps.items.map((item: any) => ({
            title: item.title || "",
            description: item.description || "",
          }))
        : seed.steps.items,
    },
    formSection: {
      title: raw.formSection?.title || seed.formSection.title,
      subtitle: raw.formSection?.subtitle || seed.formSection.subtitle,
    },
  };
}
