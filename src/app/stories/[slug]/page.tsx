import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";
import type { Metadata } from "next";

// DB QUERY
async function fetchStoryBySlug(slug: string) {
  await connectDB();

  return Story.findOne({
    slug: slug.toLowerCase().trim(),
    isPublished: true,
  }).lean();
}

// METADATA (CORRECTLY TYPED)
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const story = await fetchStoryBySlug(params.slug);

  if (!story) return {};

  return {
    title: story.metaTitle || story.title,
    description: story.metaDescription || story.excerpt,
    openGraph: {
      title: story.metaTitle || story.title,
      description: story.metaDescription || story.excerpt,
      images: [story.image],
    },
  };
}

// PAGE
export default async function StoryDetailPage(
  { params }: { params: { slug: string } }
) {
  const story = await fetchStoryBySlug(params.slug);

  if (!story) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* IMAGE */}
      {story.image && (
        <section className="mb-10">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-80 object-cover rounded-xl"
          />
        </section>
      )}

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-4">{story.title}</h1>

      {/* CONTENT */}
      <article className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {story.content}
      </article>

      {/* BACK */}
      <div className="mt-10">
        <a href="/stories" className="text-primary underline">
          ← Back to Stories
        </a>
      </div>
    </main>
  );
}
