import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";

import DistributorHero from "@/components/features/distributors/DistributorHero";
import DistributorBenefits from "@/components/features/distributors/DistributorBenefits";
import DistributorRequirements from "@/components/features/distributors/DistributorRequirements";
import DistributorSteps from "@/components/features/distributors/DistributorSteps";
import DistributorApplyForm from "@/components/features/distributors/DistributorApplyForm";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Distributors — Mera Pind Balle Balle",
  description:
    "Become an official distributor for Mera Pind Balle Balle and promote rural-made products backed by training, quality, and sustainability.",
  alternates: { canonical: `${baseUrl}/distributors` },
  openGraph: {
    title: "Distributors — Mera Pind Balle Balle",
    description: "Become an official distributor for Mera Pind Balle Balle and promote rural-made products backed by training, quality, and sustainability.",
    url: `${baseUrl}/distributors`,
    type: "website",
  },
};

async function getDistributorInfo() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/distributors`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function DistributorsPage() {
  const info = await getDistributorInfo();

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Distributors", "/distributors")) }}
      />

      {/* 1 — HERO */}
      <DistributorHero bannerImage={info?.bannerImage} />

      {/* 2 — PARTNERSHIP BENEFITS */}
      <DistributorBenefits benefits={info?.benefits} />

      {/* 3 — PARTNERSHIP REQUIREMENTS */}
      <DistributorRequirements requirements={info?.requirements} />

      {/* 4 — HOW IT WORKS */}
      <DistributorSteps />

      {/* 5 — APPLY NOW FORM */}
      <DistributorApplyForm />
    </main>
  );
}
