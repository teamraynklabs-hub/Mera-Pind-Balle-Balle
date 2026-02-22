import type { Metadata } from "next";
import BlogPageClient from "@/components/features/blog/BlogPageClient";
import Breadcrumbs from "@/components/common/Breadcrumbs";

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
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
      <BlogPageClient />
    </main>
  );
}
