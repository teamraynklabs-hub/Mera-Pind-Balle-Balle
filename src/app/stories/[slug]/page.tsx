import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Story from "@/lib/models/Story.model";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

// DB QUERY
async function fetchStoryBySlug(slug: string) {
  await connectDB();

  return Story.findOne({
    slug: slug.toLowerCase().trim(),
    isPublished: true,
  }).lean();
}

// GENERATE STATIC PARAMS FOR PERFORMANCE
export async function generateStaticParams() {
  await connectDB();
  const stories = await Story.find({ isPublished: true }, { slug: 1 }).lean();
  return stories.map((story: any) => ({ slug: story.slug }));
}

// disable caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;

// METADATA (FULLY OPTIMIZED FOR SEO)
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
    title,
    description,
    keywords: story.metaKeywords || [],
    authors: [{ name: "Mera Pind Balle Balle" }],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [
        {
          url: story.image,
          width: 1200,
          height: 630,
          alt: story.title,
          type: "image/jpeg",
        },
      ],
      publishedTime: story.createdAt ? new Date(story.createdAt).toISOString() : undefined,
      modifiedTime: story.updatedAt ? new Date(story.updatedAt).toISOString() : undefined,
      authors: ["Mera Pind Balle Balle"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [story.image],
      creator: "@MeraPindBalleBalle",
    },
    alternates: {
      canonical: url,
    },
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
  const updatedDate = story.updatedAt ? new Date(story.updatedAt) : new Date();

  // Validate dates are valid
  const createdISO = !isNaN(createdDate.getTime()) ? createdDate.toISOString() : new Date().toISOString();
  const updatedISO = !isNaN(updatedDate.getTime()) ? updatedDate.toISOString() : new Date().toISOString();

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {/* IMAGE */}
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

      {/* TITLE & META */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">{story.title}</h1>
        <time
          dateTime={createdISO}
          className="text-muted-foreground text-sm"
        >
          {createdDate.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      {/* CONTENT */}
      <div className="prose prose-lg max-w-none mb-10 leading-relaxed whitespace-pre-wrap">
        {story.content}
      </div>

      {/* BACK LINK */}
      <nav className="mt-10 border-t pt-6">
        <a href="/stories" className="text-primary hover:underline">
          ← Back to All Stories
        </a>
      </nav>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: story.metaDescription || story.excerpt,
            image: story.image,
            datePublished: createdISO,
            dateModified: updatedISO,
            author: {
              "@type": "Organization",
              name: "Mera Pind Balle Balle",
              url: BASE_URL,
            },
            articleBody: story.content,
            url,
          }),
        }}
      />
    </article>
  );
}
