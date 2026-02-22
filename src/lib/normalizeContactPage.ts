export const CONTACT_PAGE_SEED_DATA = {
  hero: {
    title: "Contact Us",
    subtitle:
      "Have a question or want to collaborate? Fill out the form below and our team will get back to you shortly.",
    image: "",
  },
  contactInfo: {
    sectionTitle: "Get in Touch With Us",
    sectionSubtitle:
      "We would love to hear from you. Whether you have questions, partnership ideas, or feedback — our team is here to help.",
    items: [
      {
        icon: "map-pin",
        title: "Address",
        lines: ["123 Heritage Lane", "New Delhi, India 110001"],
        href: "",
      },
      {
        icon: "phone",
        title: "Phone",
        lines: ["+91 12345 67890"],
        href: "tel:+911234567890",
      },
      {
        icon: "mail",
        title: "Email",
        lines: ["hello@merapind.com"],
        href: "mailto:hello@merapind.com",
      },
    ],
  },
  formSection: {
    title: "Send Us a Message",
    subtitle: "Fill out the form and our team will respond within 24 hours.",
  },
  faqs: {
    sectionTitle: "Quick Answers",
    sectionSubtitle: "Common questions we receive from our customers",
    items: [
      {
        question: "What are your shipping times?",
        answer:
          "We typically ship within 2-3 business days. Delivery times vary by location but usually take 5-7 business days within India.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship only within India. International shipping will be available soon.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 7-day return policy for unused items in original condition. Custom or personalized items cannot be returned.",
      },
      {
        question: "How can I become an artisan partner?",
        answer:
          "Visit our Distributors page to learn more about joining our artisan network. We welcome skilled craftswomen from rural communities.",
      },
    ],
  },
};

export function normalizeContactPageData(raw: any) {
  if (!raw) return null;

  const seed = CONTACT_PAGE_SEED_DATA;

  return {
    hero: {
      title: raw.hero?.title || seed.hero.title,
      subtitle: raw.hero?.subtitle || seed.hero.subtitle,
      image: raw.hero?.image || "",
    },
    contactInfo: {
      sectionTitle:
        raw.contactInfo?.sectionTitle || seed.contactInfo.sectionTitle,
      sectionSubtitle:
        raw.contactInfo?.sectionSubtitle || seed.contactInfo.sectionSubtitle,
      items: Array.isArray(raw.contactInfo?.items)
        ? raw.contactInfo.items.map((item: any) => ({
            icon: item.icon || "mail",
            title: item.title || "",
            lines: Array.isArray(item.lines) ? item.lines : [],
            href: item.href || "",
          }))
        : seed.contactInfo.items,
    },
    formSection: {
      title: raw.formSection?.title || seed.formSection.title,
      subtitle: raw.formSection?.subtitle || seed.formSection.subtitle,
    },
    faqs: {
      sectionTitle: raw.faqs?.sectionTitle || seed.faqs.sectionTitle,
      sectionSubtitle:
        raw.faqs?.sectionSubtitle || seed.faqs.sectionSubtitle,
      items: Array.isArray(raw.faqs?.items)
        ? raw.faqs.items.map((item: any) => ({
            question: item.question || "",
            answer: item.answer || "",
          }))
        : seed.faqs.items,
    },
  };
}
