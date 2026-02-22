import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import ContactPage from "@/lib/models/ContactPage.model";
import {
  normalizeContactPageData,
  CONTACT_PAGE_SEED_DATA,
} from "@/lib/normalizeContactPage";
import ContactPageClient from "@/components/features/contact/ContactPageClient";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Contact Us — Mera Pind Balle Balle",
  description:
    "Get in touch with Mera Pind Balle Balle for inquiries, support, partnerships, or distribution opportunities.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: "Contact Us — Mera Pind Balle Balle",
    description:
      "Get in touch with Mera Pind Balle Balle for inquiries, support, partnerships, or distribution opportunities.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function ContactPageRoute() {
  await connectDB();
  const raw = await ContactPage.findOne({ isActive: true }).lean();
  const pageData = normalizeContactPageData(raw) || CONTACT_PAGE_SEED_DATA;
  const serialized = JSON.parse(JSON.stringify(pageData));

  return (
    <main className="w-full">
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <ContactPageClient initialData={serialized} />
    </main>
  );
}
