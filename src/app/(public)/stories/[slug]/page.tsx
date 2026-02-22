import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchStoryBySlug(slug: string) {
  await connectDB();

  const story = await Story.findOne({
    slug: slug.toLowerCase().trim(),
    isPublished: true,
  }).lean();

  return story ? JSON.parse(JSON.stringify(story)) : null;
}

// METADATA
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const story = await fetchStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found — Mera Pind Balle Balle",
      description: "The story you are looking for does not exist.",
    };
  }

  const url = `${BASE_URL}/stories/${story.slug}`;
  const title = story.metaTitle || story.title;
  const description = story.metaDescription || story.excerpt;

  return {
    title: `${title} — Mera Pind Balle Balle`,
    description,
    keywords: story.tags || story.metaKeywords || [],
    authors: [{ name: story.author || "Mera Pind Balle Balle" }],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: story.image
        ? [{ url: story.image, width: 1200, height: 630, alt: story.title }]
        : [],
      publishedTime: story.createdAt
        ? new Date(story.createdAt).toISOString()
        : undefined,
      modifiedTime: story.updatedAt
        ? new Date(story.updatedAt).toISOString()
        : undefined,
      authors: [story.author || "Mera Pind Balle Balle"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: story.image ? [story.image] : [],
    },
    alternates: { canonical: url },
  };
}

// PAGE
export default async function StoryDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const story = await fetchStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const url = `${BASE_URL}/stories/${story.slug}`;
  const createdDate = story.createdAt ? new Date(story.createdAt) : new Date();
  const createdISO = !isNaN(createdDate.getTime())
    ? createdDate.toISOString()
    : new Date().toISOString();
  const updatedISO = story.updatedAt
    ? new Date(story.updatedAt).toISOString()
    : createdISO;

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "Stories", href: "/stories" },
          { label: story.title },
        ]}
      />

      {/* Cover Image */}
      {story.image && (
        <header className="mb-10">
          <Image
            src={story.image}
            alt={story.title}
            width={1200}
            height={630}
            priority
            className="w-full h-auto rounded-xl"
          />
        </header>
      )}

      {/* Title & Meta */}
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {story.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {story.name && <span className="font-medium">{story.name}</span>}
          {story.name && story.location && <span>&middot;</span>}
          {story.location && <span>{story.location}</span>}
          {(story.name || story.location) && <span>&middot;</span>}
          <span>{story.author || "Mera Pind Balle Balle"}</span>
          <span>&middot;</span>
          <time dateTime={createdISO}>
            {createdDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Tags */}
        {story.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {story.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/stories?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-10 leading-relaxed">
        {story.content ? (
          <div dangerouslySetInnerHTML={{ __html: story.content }} />
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* Back Link */}
      <nav className="mt-10 border-t pt-6">
        <Link href="/stories" className="text-primary hover:underline">
          &larr; Back to All Stories
        </Link>
      </nav>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: story.excerpt,
            image: story.image,
            datePublished: createdISO,
            dateModified: updatedISO,
            author: {
              "@type": "Person",
              name: story.author || "Mera Pind Balle Balle",
            },
            publisher: {
              "@type": "Organization",
              name: "Mera Pind Balle Balle",
              url: BASE_URL,
            },
            url,
          }),
        }}
      />
    </article>
  );
}
