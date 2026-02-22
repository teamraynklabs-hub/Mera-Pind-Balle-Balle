/**
 * Temporary frontend mock/fallback data for the Distributors page.
 * Replace with backend data when the admin panel populates real content.
 */

export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

/** Fallback benefits if backend returns empty array */
export const FALLBACK_BENEFITS: BenefitItem[] = [
  {
    icon: "fair-pricing",
    title: "Fair Pricing",
    description:
      "Competitive wholesale rates with transparent pricing structure",
  },
  {
    icon: "quality",
    title: "Quality Products",
    description:
      "Authentic handcrafted products directly from artisan communities",
  },
  {
    icon: "marketing",
    title: "Marketing Support",
    description:
      "Access to marketing materials, product catalogs, and digital assets",
  },
  {
    icon: "training",
    title: "Training Programs",
    description:
      "Regular training on product knowledge and sales techniques",
  },
  {
    icon: "exclusive",
    title: "Exclusive Collections",
    description:
      "First access to new product launches and limited editions",
  },
  {
    icon: "support",
    title: "Dedicated Support",
    description:
      "Personal account manager to assist with orders and queries",
  },
];

/** Fallback requirements if backend returns empty array */
export const FALLBACK_REQUIREMENTS: string[] = [
  "Passion for handcrafted products and rural artisan empowerment",
  "Valid business registration or GST certificate",
  "Retail space or online selling platform",
  "Minimum order commitment of \u20B950,000 per quarter",
  "Commitment to ethical business practices",
  "Strong network in your local market",
];

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Apply",
    description: "Submit your application through our form",
  },
  {
    number: "02",
    title: "Review",
    description: "Our team reviews your application",
  },
  {
    number: "03",
    title: "Interview",
    description: "Meet with our partnership team",
  },
  {
    number: "04",
    title: "Onboard",
    description: "Complete training and start selling",
  },
];

/** Fallback banner image */
export const FALLBACK_BANNER = "/photo1.png";
