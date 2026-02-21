import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import Image from "next/image";
import DistributorsForm from "./DistributorsForm";
import { breadcrumbForPage } from "@/lib/seo";

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

  if (!info || info.success === false) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Distributor information is not available at the moment. Please check back later.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Distributors", "/distributors")) }}
      />

      {/* BANNER */}
      {info.bannerImage && info.bannerImage.trim() && (
        <section className="mb-16 relative w-full h-72 rounded-xl overflow-hidden shadow">
          <Image
            src={info.bannerImage}
            alt="Distributors"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </section>
      )}

      {/* INTRO */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Become a Distributor</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join us in bringing high-quality rural products to more cities while
          creating meaningful economic impact.
        </p>
      </section>

      {/* BENEFITS & REQUIREMENTS */}
      <section className="grid md:grid-cols-2 gap-10 mb-20">
        {info.benefits?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Partner With Us?</h2>
            <ul className="space-y-3 text-muted-foreground">
              {info.benefits.map((b: string, i: number) => (
                <li key={i} className="p-3 bg-card border rounded-lg shadow-sm">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {info.requirements?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Distributor Requirements</h2>
            <ul className="space-y-3 text-muted-foreground">
              {info.requirements.map((r: string, i: number) => (
                <li key={i} className="p-3 bg-card border rounded-lg shadow-sm">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* FORM */}
      <DistributorsForm />
    </main>
  );
}
