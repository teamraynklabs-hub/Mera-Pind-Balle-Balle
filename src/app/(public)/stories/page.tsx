import { connectDB } from "@/lib/db";
import { getBaseUrl } from "@/lib/getBaseUrl";
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
    description: "Real stories from rural communities, artisans, farmers, and women entrepreneurs empowered by Mera Pind Balle Balle initiatives.",
    url: `${baseUrl}/stories`,
    type: "website",
  },
};

// Backend Fetch
async function getStories() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/stories`, {
      cache: "no-store",
    });

    const json = await res.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("STORIES FETCH ERROR:", error);
    return [];
  }
}

// disable caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoriesPage() {
  await connectDB();
  const stories = await getStories();

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Success Stories", "/stories")) }}
      />

      <StoriesPageClient backendStories={stories} />
    </main>
  );
}
