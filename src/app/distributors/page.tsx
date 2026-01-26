import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import DistributorsForm from "./DistributorsForm";

export const metadata: Metadata = {
  title: "Distributors — Mera Pind Balle Balle",
  description:
    "Become an official distributor for Mera Pind Balle Balle and promote rural-made products backed by training, quality, and sustainability.",
};

// GET data SSR
async function getDistributorInfo() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`/api/distributors`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Distributors fetch failed: ${res.status}`);
    const data = await res.json();
    console.log("Distributor page data:", data);
    return data;
  } catch (err) {
    console.error("DISTRIBUTOR GET ERROR:", err);
    // Return default fallback data
    return {
      bannerImage: "",
      benefits: [
        "Competitive commission structure",
        "Marketing support and training",
        "Quality products with guaranteed profits",
        "Dedicated distributor support team",
      ],
      requirements: [
        "Registered business entity",
        "Minimum investment capacity",
        "Valid GST registration",
        "Willingness to maintain quality standards",
      ],
      isActive: true,
    };
  }
}

export default async function DistributorsPage() {
  const info = await getDistributorInfo();

  if (!info)
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Unable to load distributor data.
        </p>
      </main>
    );

  return (
    <main className="container mx-auto px-4 py-12">
      {/* BANNER */}
      {info.bannerImage && info.bannerImage.trim() && (
        <section className="mb-16">
          <img
            src={info.bannerImage}
            alt="Distributors"
            className="w-full h-72 object-cover rounded-xl shadow"
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
        {/* Benefits */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Why Partner With Us?</h2>
          <ul className="space-y-3 text-muted-foreground">
            {info.benefits.map((b: string, i: number) => (
              <li key={i} className="p-3 bg-card border rounded-lg shadow-sm">
                • {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Distributor Requirements</h2>
          <ul className="space-y-3 text-muted-foreground">
            {info.requirements.map((r: string, i: number) => (
              <li key={i} className="p-3 bg-card border rounded-lg shadow-sm">
                • {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FORM COMPONENT */}
      <DistributorsForm />
    </main>
  );
}
