/* ── Seed data (matches current hardcoded defaults in Footer.tsx) ── */

export const FOOTER_PAGE_SEED_DATA = {
  brand: {
    description:
      "Empowering rural women artisans through traditional crafts and sustainable livelihood.",
  },
  quickLinks: {
    columnTitle: "Quick Links",
    items: [
      { label: "Shop Products", link: "/products" },
      { label: "Artisan Stories", link: "/stories" },
      { label: "Blog", link: "/blog" },
      { label: "About Us", link: "/about" },
    ],
  },
  supportLinks: {
    columnTitle: "Get Involved",
    items: [
      { label: "Become a Distributor", link: "/distributors" },
      { label: "Careers", link: "/careers" },
      { label: "Resources", link: "/resources" },
      { label: "Contact", link: "/contact" },
    ],
  },
  contactInfo: {
    columnTitle: "Contact Us",
    address: "123 Heritage Lane, New Delhi, India 110001",
    phone: "+91 12345 67890",
    email: "hello@merapind.com",
  },
  socialLinks: [
    { platform: "facebook", link: "https://facebook.com/merapindballeballe" },
    {
      platform: "instagram",
      link: "https://instagram.com/merapindballeballe",
    },
    { platform: "twitter", link: "https://x.com/Merapindballe" },
    {
      platform: "linkedin",
      link: "https://linkedin.com/in/merapind-balleballe",
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Terms of Service", link: "/terms-conditions" },
  ],
  copyrightText: "Mera Pind Balle Balle. All rights reserved.",
};

/* ── Normalizer ── */

export function normalizeFooterPageData(raw: any) {
  if (!raw) return null;

  const seed = FOOTER_PAGE_SEED_DATA;

  return {
    brand: {
      description: raw.brand?.description || seed.brand.description,
    },
    quickLinks: {
      columnTitle:
        raw.quickLinks?.columnTitle || seed.quickLinks.columnTitle,
      items: Array.isArray(raw.quickLinks?.items)
        ? raw.quickLinks.items.map((item: any) => ({
            label: item.label || "",
            link: item.link || "",
          }))
        : seed.quickLinks.items,
    },
    supportLinks: {
      columnTitle:
        raw.supportLinks?.columnTitle || seed.supportLinks.columnTitle,
      items: Array.isArray(raw.supportLinks?.items)
        ? raw.supportLinks.items.map((item: any) => ({
            label: item.label || "",
            link: item.link || "",
          }))
        : seed.supportLinks.items,
    },
    contactInfo: {
      columnTitle:
        raw.contactInfo?.columnTitle || seed.contactInfo.columnTitle,
      address: raw.contactInfo?.address || seed.contactInfo.address,
      phone: raw.contactInfo?.phone || seed.contactInfo.phone,
      email: raw.contactInfo?.email || seed.contactInfo.email,
    },
    socialLinks: Array.isArray(raw.socialLinks)
      ? raw.socialLinks.map((item: any) => ({
          platform: item.platform || "",
          link: item.link || "",
        }))
      : seed.socialLinks,
    legalLinks: Array.isArray(raw.legalLinks)
      ? raw.legalLinks.map((item: any) => ({
          label: item.label || "",
          link: item.link || "",
        }))
      : seed.legalLinks,
    copyrightText: raw.copyrightText || seed.copyrightText,
  };
}
