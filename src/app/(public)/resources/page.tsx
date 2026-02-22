import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";
import ResourcesPageClient from "@/components/features/resources/ResourcesPageClient";

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

      <ResourcesPageClient />
    </main>
  );
}
