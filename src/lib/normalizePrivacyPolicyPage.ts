export const PRIVACY_POLICY_PAGE_SEED_DATA = {
  hero: {
    title: "Privacy Policy",
    subtitle:
      "This Privacy Policy describes how Mera Pind Balle Balle collects, uses, and protects your personal information when you visit or interact with our website. By using this website, you agree to the terms described here.",
  },
  lastUpdated: "2026-02-22",
  sections: [
    {
      title: "1. Information We Collect",
      content:
        "We may collect the following types of information:\n\n- Personal details provided through forms (name, email, phone).\n- Messages sent through our contact or inquiry forms.\n- Automatically collected data such as IP address, browser type.\n- Usage analytics for improving website performance.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use your information for the following purposes:\n\n- To respond to your inquiries or service requests.\n- To provide updates, newsletters, or relevant communication.\n- To improve website performance, user experience, and services.\n- To comply with legal or regulatory requirements.",
    },
    {
      title: "3. Cookies & Tracking Technologies",
      content:
        "We may use cookies, tracking pixels, and analytics tools to understand user behavior, website usage, and traffic patterns. You can disable cookies in your browser settings, but some features may not function properly.",
    },
    {
      title: "4. Sharing of Personal Information",
      content:
        "We do not sell or trade your personal information. We may share data only in these cases:\n\n- With trusted service providers for website hosting and analytics.\n- With legal authorities when required by law.\n- With trusted partners for processing specific user requests.",
    },
    {
      title: "5. Data Security",
      content:
        "We implement strong technical and organizational measures to protect your data from unauthorized access, loss, or misuse. However, no online platform can guarantee 100% security.",
    },
    {
      title: "6. Third-Party Links",
      content:
        "Our website may contain external links. We are not responsible for the privacy practices or content of third-party websites. We recommend reviewing their privacy policies separately.",
    },
    {
      title: "7. Children's Privacy",
      content:
        "Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children.",
    },
    {
      title: "8. Changes to This Privacy Policy",
      content:
        "We may update this Privacy Policy from time to time. Your continued use of the website indicates acceptance of the updated policy.",
    },
    {
      title: "9. Contact Us",
      content:
        "If you have any questions or concerns regarding this Privacy Policy, you can contact us using the information provided below.",
    },
  ],
  contactEmail: "support@merapind.com",
  contactPhone: "+91 98765 43210",
};

export function normalizePrivacyPolicyPageData(raw: any) {
  if (!raw) return null;

  const seed = PRIVACY_POLICY_PAGE_SEED_DATA;

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
