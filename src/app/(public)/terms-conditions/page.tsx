import type { Metadata } from "next";
import TermsConditionsClient from "./TermsConditionsClient";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Terms & Conditions — Mera Pind Balle Balle",
  description:
    "Review the official Terms & Conditions for using the Mera Pind Balle Balle website, services, and digital content.",
  alternates: { canonical: `${baseUrl}/terms-conditions` },
  openGraph: {
    title: "Terms & Conditions — Mera Pind Balle Balle",
    description:
      "Review the official Terms & Conditions for using the Mera Pind Balle Balle website, services, and digital content.",
    url: `${baseUrl}/terms-conditions`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TermsConditionsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Terms & Conditions", href: "/terms-conditions" }]} />
      <TermsConditionsClient />
    </main>
  );
}
