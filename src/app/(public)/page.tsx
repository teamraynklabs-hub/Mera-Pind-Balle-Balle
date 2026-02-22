import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import HomePageContent from "@/components/features/home/HomePageContent";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

/* ── Metadata (server-side for SEO) ── */

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const dashboard = await Dashboard.findOne({ isActive: true })
      .select("hero")
      .lean();

    const title = dashboard?.hero?.title
      ? `${dashboard.hero.title} | Mera Pind Balle Balle`
      : "Mera Pind Balle Balle — Rural Women Empowerment & Sustainable Products";
    const description = dashboard?.hero?.subtitle
      ? dashboard.hero.subtitle.slice(0, 160)
      : "Mera Pind Balle Balle empowers rural women entrepreneurs through skill training, sustainable product development, and community-driven growth across Indian villages.";
    const heroImage = dashboard?.hero?.image || "/hero.png";

    return {
      title,
      description,
      alternates: { canonical: baseUrl },
      openGraph: {
        title,
        description,
        url: baseUrl,
        type: "website",
        images: [{ url: heroImage.startsWith("http") ? heroImage : `${baseUrl}${heroImage}`, alt: "Mera Pind Balle Balle" }],
      },
    };
  } catch {
    return {
      title: "Mera Pind Balle Balle — Rural Women Empowerment & Sustainable Products",
      description: "Empowering rural women entrepreneurs through skill training, sustainable product development, and community-driven growth across Indian villages.",
    };
  }
}

/* ── Page ── */

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HomePageContent />
    </main>
  );
}
