import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import DistributorsPage from "@/lib/models/DistributorsPage.model";
import {
  normalizeDistributorsPageData,
  DISTRIBUTORS_PAGE_SEED_DATA,
} from "@/lib/normalizeDistributorsPage";
import { breadcrumbForPage } from "@/lib/seo";
import DistributorsPageClient from "@/components/features/distributors/DistributorsPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Distributors — Mera Pind Balle Balle",
  description:
    "Become an official distributor for Mera Pind Balle Balle and promote rural-made products backed by training, quality, and sustainability.",
  alternates: { canonical: `${baseUrl}/distributors` },
  openGraph: {
    title: "Distributors — Mera Pind Balle Balle",
    description:
      "Become an official distributor for Mera Pind Balle Balle and promote rural-made products backed by training, quality, and sustainability.",
    url: `${baseUrl}/distributors`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function DistributorsPageRoute() {
  await connectDB();
  const raw = await DistributorsPage.findOne({ isActive: true }).lean();
  const pageData =
    normalizeDistributorsPageData(raw) || DISTRIBUTORS_PAGE_SEED_DATA;
  const serialized = JSON.parse(JSON.stringify(pageData));

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbForPage("Distributors", "/distributors")
          ),
        }}
      />

      <DistributorsPageClient initialData={serialized} />
    </main>
  );
}
