import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";

import AboutHero from "@/components/features/about/AboutHero";
import AboutMission from "@/components/features/about/AboutMission";
import AboutVision from "@/components/features/about/AboutVision";
import AboutValues from "@/components/features/about/AboutValues";
import AboutImpact from "@/components/features/about/AboutImpact";
import AboutTeam from "@/components/features/about/AboutTeam";
import AboutCTA from "@/components/features/about/AboutCTA";

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

/* ------------------------
   BACKEND FETCH
------------------------ */
async function getAboutData() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/about`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Fetch failed");
    const json = await res.json();

    if (json?.success) return json.data;
    if (json?._id) return json;

    return null;
  } catch (err) {
    console.error("ABOUT PAGE ERROR:", err);
    return null;
  }
}

/* ------------------------
      ABOUT PAGE
------------------------ */
export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("About", "/about")) }}
      />

      {/* 1 — HERO */}
      <AboutHero
        title={data?.hero?.title}
        subtitle={data?.hero?.description}
      />

      {/* 2 — MISSION */}
      <AboutMission
        title={data?.mission?.title}
        description={data?.mission?.description}
        image={data?.hero?.image}
      />

      {/* 3 — VISION */}
      <AboutVision
        title={data?.vision?.title}
        description={data?.vision?.description}
        image={data?.hero?.image}
      />

      {/* 4 — CORE VALUES */}
      <AboutValues
        values={
          data?.focusAreas?.length > 0
            ? data.focusAreas.map((area: { title: string; description: string }) => ({
                title: area.title,
                description: area.description,
              }))
            : undefined
        }
      />

      {/* 5 — IMPACT */}
      <AboutImpact />

      {/* 6 — TEAM */}
      <AboutTeam
        team={
          data?.coreTeam?.length > 0
            ? data.coreTeam
            : undefined
        }
      />

      {/* 7 — CTA */}
      <AboutCTA
        title={data?.cta?.title || "Join Our Mission"}
        subtitle={data?.cta?.description || "Every purchase supports rural women artisans and preserves traditional crafts"}
      />
    </main>
  );
}
