import { connectDB } from "@/lib/db";
import Service from "@/lib/models/Service.model";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Initiatives — Mera Pind Balle Balle",
  description:
    "Explore Mera Pind Balle Balle’s rural empowerment initiatives including skill training, women empowerment, sustainable farming and product innovation.",
};

// ✅ DIRECT DB FETCH (SERVER SAFE)
async function fetchInitiatives() {
  await connectDB();

  return Service.find({ isActive: true })
    .sort({ createdAt: 1 })
    .lean();
}

export default async function InitiativesPage() {
  const initiatives = await fetchInitiatives();

  if (!initiatives || initiatives.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">
          No initiatives available at the moment.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* PAGE HEADER */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our Initiatives
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We work with rural communities to build sustainable livelihoods through
          capacity building, innovation, and fair market access.
        </p>
      </section>

      {/* INITIATIVE GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {initiatives.map((item: any) => (
          <article
            key={item._id.toString()}
            className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4 mb-4">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 object-contain rounded-md bg-muted"
                />
              )}

              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="py-10 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">
          Want to Support Our Work?
        </h2>
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
