import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import PrivacyPolicyPage from "@/lib/models/PrivacyPolicyPage.model";
import {
  normalizePrivacyPolicyPageData,
  PRIVACY_POLICY_PAGE_SEED_DATA,
} from "@/lib/normalizePrivacyPolicyPage";
import { breadcrumbForPage } from "@/lib/seo";
import PrivacyPolicyPageClient from "@/components/features/privacy-policy/PrivacyPolicyPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Privacy Policy — Mera Pind Balle Balle",
  description:
    "Read the Privacy Policy of Mera Pind Balle Balle to understand how we collect, use, and protect your personal information.",
  alternates: { canonical: `${baseUrl}/privacy-policy` },
  openGraph: {
    title: "Privacy Policy — Mera Pind Balle Balle",
    description:
      "Read the Privacy Policy of Mera Pind Balle Balle to understand how we collect, use, and protect your personal information.",
    url: `${baseUrl}/privacy-policy`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPageRoute() {
  await connectDB();
  const raw = await PrivacyPolicyPage.findOne({ isActive: true }).lean();
  const pageData =
    normalizePrivacyPolicyPageData(raw) || PRIVACY_POLICY_PAGE_SEED_DATA;
  const serialized = JSON.parse(JSON.stringify(pageData));

  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbForPage("Privacy Policy", "/privacy-policy")
          ),
        }}
      />

      <PrivacyPolicyPageClient initialData={serialized} />
    </main>
  );
}
