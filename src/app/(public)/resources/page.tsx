import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";

import ResourcesHero from "@/components/features/resources/ResourcesHero";
import ResourcesGrid from "@/components/features/resources/ResourcesGrid";
import ResourcesCTA from "@/components/features/resources/ResourcesCTA";
import ResourcesNewsletter from "@/components/features/resources/ResourcesNewsletter";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Resources — Mera Pind Balle Balle",
  description:
    "Download catalogs, guides, and educational materials about our products and artisan communities.",
  alternates: { canonical: `${baseUrl}/resources` },
  openGraph: {
    title: "Resources — Mera Pind Balle Balle",
    description:
      "Download catalogs, guides, and educational materials about our products and artisan communities.",
    url: `${baseUrl}/resources`,
    type: "website",
  },
};

export default function ResourcesPage() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbForPage("Resources", "/resources")
          ),
        }}
      />

      {/* 1 — Hero */}
      <ResourcesHero />

      {/* 2 — Filter + 3 — Resource Grid */}
      <ResourcesGrid />

      {/* 4 — Custom Resource CTA */}
      <ResourcesCTA />

      {/* 5 — Newsletter Subscribe */}
      <ResourcesNewsletter />
    </main>
  );
}
