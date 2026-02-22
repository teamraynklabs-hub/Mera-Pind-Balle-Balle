import type { Metadata } from "next";
import { breadcrumbForPage } from "@/lib/seo";
import BlogPageClient from "@/components/features/blog/BlogPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Blog — Mera Pind Balle Balle",
  description:
    "Read inspiring stories, updates, and news from rural communities.",
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: "Blog — Mera Pind Balle Balle",
    description: "Read inspiring stories, updates, and news from rural communities.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbForPage("Blog", "/blog")),
        }}
      />

      <BlogPageClient />
    </main>
  );
}
