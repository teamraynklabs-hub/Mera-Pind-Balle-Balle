import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";
import HomePageContent from "@/components/features/home/HomePageContent";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ── Metadata ── */
export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const dashboard = await Dashboard.findOne({ isActive: true }).select("hero").lean();
    const title = dashboard?.hero?.title
      ? `${dashboard.hero.title} | Mera Pind Balle Balle`
      : "Mera Pind Balle Balle — Rural Women Empowerment & Sustainable Products";
    const description = dashboard?.hero?.subtitle
      ? dashboard.hero.subtitle.slice(0, 160)
      : "Empowering rural women through sustainable growth.";
    const heroImage = dashboard?.hero?.image || "/hero.png";

    return {
      title,
      description,
      alternates: { canonical: baseUrl },
      openGraph: {
        title,
        description,
        url: baseUrl,
        images: [{ url: heroImage.startsWith("http") ? heroImage : `${baseUrl}${heroImage}` }],
      },
    };
  } catch {
    return { title: "Mera Pind Balle Balle", description: "Empowering rural women." };
  }
}

/* ── Page ── */
export default async function HomePage() {
  await connectDB();
  const [dashboard, allProducts] = await Promise.all([
    Dashboard.findOne({ isActive: true }).lean(),
    Product.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
  ]);

  const featuredProducts = (allProducts as any[]).filter((p) => p.isFeatured);

  const initialData = dashboard ? {
    hero: dashboard.hero,
    initiatives: (dashboard as any).initiatives || [],
    feedback: (dashboard as any).feedback || [],
    impact: dashboard.impact || [],
    cta: dashboard.cta,
    featuredProducts,
    allProducts,
  } : undefined;

  return (
    <main className="flex flex-col">
      <HomePageContent initialData={JSON.parse(JSON.stringify(initialData))} />
    </main>
  );
}
