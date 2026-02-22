import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";
import StoriesPageClient from "@/components/features/stories/StoriesPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Success Stories — Mera Pind Balle Balle",
  description:
    "Real stories from rural communities, artisans, farmers, and women entrepreneurs empowered by Mera Pind Balle Balle initiatives.",
  alternates: { canonical: `${baseUrl}/stories` },
  openGraph: {
    title: "Success Stories — Mera Pind Balle Balle",
    description:
      "Real stories from rural communities, artisans, farmers, and women entrepreneurs empowered by Mera Pind Balle Balle initiatives.",
    url: `${baseUrl}/stories`,
    type: "website",
  },
};

export default function StoriesPage() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbForPage("Success Stories", "/stories")
          ),
        }}
      />

      <StoriesPageClient />
    </main>
  );
}
