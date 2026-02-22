import type { Metadata } from "next";

import CareersHero from "@/components/features/careers/CareersHero";
import CareersBenefits from "@/components/features/careers/CareersBenefits";
import CareersCulture from "@/components/features/careers/CareersCulture";
import CareersOpenPositions from "@/components/features/careers/CareersOpenPositions";
import CareersCTA from "@/components/features/careers/CareersCTA";
import CareersForm from "./CareersForm";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Careers — Mera Pind Balle Balle",
  description:
    "Join Mera Pind Balle Balle to make a meaningful impact in rural development, empowerment, and sustainable community growth.",
  alternates: { canonical: `${baseUrl}/careers` },
  openGraph: {
    title: "Careers — Mera Pind Balle Balle",
    description: "Join Mera Pind Balle Balle to make a meaningful impact in rural development, empowerment, and sustainable community growth.",
    url: `${baseUrl}/careers`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CareersPage() {
  return (
    <main className="flex flex-col">
      <Breadcrumbs items={[{ label: "Careers", href: "/careers" }]} />

      {/* 1 — HERO */}
      <CareersHero />

      {/* 2 — WHY JOIN US */}
      <CareersBenefits />

      {/* 3 — OUR CULTURE */}
      <CareersCulture />

      {/* 4 — OPEN POSITIONS */}
      <CareersOpenPositions />

      {/* 5 — CTA */}
      <CareersCTA />

      {/* 6 — APPLICATION FORM (existing — kept as last section) */}
      <CareersForm />
    </main>
  );
}
