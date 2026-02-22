import type { Metadata } from "next";
import ContactFormSection from "./ContactFormSection";
import { breadcrumbForPage } from "@/lib/seo";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Contact Us — Mera Pind Balle Balle",
  description:
    "Get in touch with Mera Pind Balle Balle for inquiries, support, partnerships, or distribution opportunities.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: "Contact Us — Mera Pind Balle Balle",
    description: "Get in touch with Mera Pind Balle Balle for inquiries, support, partnerships, or distribution opportunities.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
};

/* ── FAQ Data ── */
const faqs = [
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
];

export default function ContactPage() {
  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Contact Us", "/contact")) }}
      />

      {/* ── PAGE HERO ── */}
      <section className="text-center pt-28 pb-4 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question or want to collaborate? Fill out the form below and our
          team will get back to you shortly.
        </p>
      </section>

      {/* ── CONTACT FORM SECTION ── */}
      <div className="section-container">
        <ContactFormSection />
      </div>

      {/* ── SEPARATOR ── */}
      <div className="section-container">
        <div className="border-t border-border/60 my-4" />
      </div>

      {/* ── FAQ SECTION ── */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold italic mb-3">
            Quick Answers
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Common questions we receive from our customers
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-5">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="card-base p-6 sm:p-7"
            >
              <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
