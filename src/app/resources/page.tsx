import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources — Mera Pind Balle Balle",
  description:
    "Access downloadable brochures, reports, policies, and important documentation from Mera Pind Balle Balle.",
};

// SSR Fetch
async function getResources() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`/api/resources`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Resources fetch failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("RESOURCES FETCH ERROR:", error);
    return null;
  }
}

export default async function ResourcesPage() {
  const data = await getResources();

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Unable to load resources.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">

      {/* BANNER */}
      <section className="mb-16">
        <img
          src={data.bannerImage}
          alt="Resources Banner"
          className="w-full h-72 object-cover rounded-xl shadow"
        />
      </section>

      {/* TITLE */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download official documents, brochures, product catalogues, and annual
          impact reports.
        </p>
      </section>

      {/* DOCUMENT GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {data.documents.map((doc: any, index: number) => (
          <article
            key={index}
            className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">{doc.title}</span>
              <span className="px-3 py-1 text-xs bg-primary text-white rounded-md">
                {doc.type}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {doc.description}
            </p>

            <a
              href={doc.link}
              target="_blank"
              className="text-primary text-sm font-medium hover:underline"
            >
              Download →
            </a>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="py-12 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-3">Need Additional Material?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Contact our team if you need custom documentation, partnership papers,
          or village impact reports.
        </p>

        <a
          href="/contact"
          className="px-8 py-3 bg-primary text-white rounded-md text-sm hover:opacity-90 transition"
        >
          Contact Us
        </a>
      </section>

    </main>
  );
}
