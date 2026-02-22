export const TERMS_CONDITIONS_PAGE_SEED_DATA = {
  hero: {
    title: "Terms & Conditions",
    subtitle:
      "By accessing and using the Mera Pind Balle Balle website, you agree to comply with the following Terms & Conditions. Please read them carefully.",
  },
  lastUpdated: "2026-02-22",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content:
        "By using this website, you confirm that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, you must stop using the website immediately.",
    },
    {
      title: "2. Use of Website & Content",
      content:
        "- All content on this website is owned by Mera Pind Balle Balle.\n- You may not copy, reproduce, or distribute any text, images, or media without written permission.\n- Commercial use of website content is strictly prohibited unless approved.",
    },
    {
      title: "3. Product Information",
      content:
        "We make every effort to display accurate product details, pricing, and availability. However, we do not guarantee that all information is always completely up to date.",
    },
    {
      title: "4. Limitation of Liability",
      content:
        "Mera Pind Balle Balle is not responsible for:\n\n- Any errors or interruptions on the website.\n- Loss of data or system damage caused by using the website.\n- Third-party links, services, or content accessible through this website.",
    },
    {
      title: "5. User Responsibilities",
      content:
        "- You agree not to misuse the website in any unlawful manner.\n- You must not attempt to hack, disrupt, or reverse-engineer systems.\n- Providing false information in forms or requests is prohibited.",
    },
    {
      title: "6. Privacy & Data Protection",
      content:
        "We follow strict data protection policies. For full details, please read our Privacy Policy.",
    },
    {
      title: "7. Third-Party Services",
      content:
        "This website may include links to third-party websites or services. Mera Pind Balle Balle is not responsible for their content, accuracy, or security.",
    },
    {
      title: "8. Changes to Terms",
      content:
        "We may update these Terms & Conditions at any time. Continued use of the website indicates acceptance of updated terms.",
    },
    {
      title: "9. Contact Information",
      content:
        "If you have any questions about these Terms & Conditions, please contact us using the information provided below.",
    },
  ],
  contactEmail: "support@merapind.com",
  contactPhone: "+91 98765 43210",
};

export function normalizeTermsConditionsPageData(raw: any) {
  if (!raw) return null;

  const seed = TERMS_CONDITIONS_PAGE_SEED_DATA;

  return {
    hero: {
      title: raw.hero?.title || seed.hero.title,
      subtitle: raw.hero?.subtitle || seed.hero.subtitle,
    },
    lastUpdated: raw.lastUpdated || seed.lastUpdated,
    sections: Array.isArray(raw.sections)
      ? raw.sections.map((s: any) => ({
          title: s.title || "",
          content: s.content || "",
        }))
      : seed.sections,
    contactEmail: raw.contactEmail || seed.contactEmail,
    contactPhone: raw.contactPhone || seed.contactPhone,
  };
}
