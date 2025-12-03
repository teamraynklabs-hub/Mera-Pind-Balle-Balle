import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Initiatives — Mera Pind",
  description:
    "Explore Mera Pind’s rural empowerment initiatives including skill training, women empowerment, sustainable farming and product innovation.",
};

// Fetch backend data (SSR-safe)
async function getInitiatives() {
  try {
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/initiatives`);
    return res.data;
  } catch (error) {
    console.error("INITIATIVES API ERROR:", error);
    return null;
  }
}

export default async function InitiativesPage() {
  const initiatives = await getInitiatives();

  if (!initiatives)
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">
          Unable to load initiatives from backend.
        </p>
      </main>
    );

  return (
    <main className="container mx-auto px-4 py-12">
      {/* PAGE HEADER */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Initiatives</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We work with rural communities to build sustainable livelihoods through
          capacity building, innovation, and fair market access.
        </p>
      </section>

      {/* INITIATIVE GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {initiatives.map((item: any) => (
          <article
            key={item.title}
            className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={item.icon}
                alt={item.title}
                className="w-16 h-16 object-contain rounded-md bg-muted"
              />

              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="py-10 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Want to Support Our Work?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          You can make a meaningful difference as a sponsor, distributor,
          volunteer, or partner organization.
        </p>

        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-primary text-white rounded-md text-sm shadow-md hover:opacity-90 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}
