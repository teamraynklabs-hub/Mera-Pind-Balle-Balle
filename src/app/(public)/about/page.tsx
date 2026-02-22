import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";
import AboutPageClient from "@/components/features/about/AboutPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "About — Mera Pind Balle Balle | Empowering Rural Communities",
  description:
    "Learn about Mera Pind Balle Balle's mission, vision, values, and rural empowerment approach.",
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: "About — Mera Pind Balle Balle | Empowering Rural Communities",
    description: "Learn about Mera Pind Balle Balle's mission, vision, values, and rural empowerment approach.",
    url: `${baseUrl}/about`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

async function getAboutData() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/about`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.success) return json.data;
    return null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const initialData = await getAboutData();

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("About", "/about")) }}
      />
      <AboutPageClient initialData={initialData} />
    </main>
  );
}
