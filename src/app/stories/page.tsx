import { connectDB } from "@/lib/db";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success Stories — Mera Pind Balle Balle",
  description:
    "Real stories from rural communities, artisans, farmers, and women entrepreneurs empowered by Mera Pind Balle Balle initiatives.",
};

// Backend Fetch
async function getStories() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/stories`, {
      cache: "no-store",
    });

    const json = await res.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("STORIES FETCH ERROR:", error);
    return [];
  }
}

// disable caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoriesPage() {
  await connectDB();
  const stories = await getStories();

  if (!stories) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">
          Unable to load stories from backend.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">

      {/* HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Heartfelt journeys of empowerment, growth, and transformation from villages
          across the region.
        </p>
      </section>

      {/* STORIES GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {stories.map((story: any, index: number) => (
          <article
            key={index}
            className="bg-card border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{story.title}</h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {story.summary}
              </p>

              <a
                href={`/stories/${story.slug}`}
                className="text-primary text-sm font-medium mt-4 inline-block hover:underline"
              >
                Read Full Story →
              </a>
            </div>
          </article>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="py-12 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-3">Share Your Story</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Have you been a part of a Mera Pind Balle Balle initiative? Your story can inspire
          many others in the community.
        </p>

        <a
          href="/contact"
          className="px-8 py-3 bg-primary text-white rounded-md text-sm shadow-md hover:opacity-90 transition"
        >
          Contact Us
        </a>
      </section>

    </main>
  );
}
