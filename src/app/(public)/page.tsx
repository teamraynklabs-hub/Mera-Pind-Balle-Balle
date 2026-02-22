import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";

import HeroSection from "@/components/features/home/HeroSection";
import TrustSection from "@/components/features/home/TrustSection";
import MissionSection from "@/components/features/home/MissionSection";
import CategoryGrid from "@/components/features/home/CategoryGrid";
import FeaturedProductsGrid from "@/components/features/home/FeaturedProductsGrid";
import ViewAllProductsStrip from "@/components/features/home/ViewAllProductsStrip";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import ClosingCTA from "@/components/features/home/ClosingCTA";
import ScrollReveal from "@/components/motion/ScrollReveal";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

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

export default async function HomePage() {
  await connectDB();
  const dashboard = await Dashboard.findOne({ isActive: true }).lean();

  if (!dashboard) {
    return (
      <main className="flex flex-col">
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            Unable to load dashboard data
          </p>
        </div>
      </main>
    );
  }

  const impact = JSON.parse(JSON.stringify(dashboard.impact || []));
  const testimonials = JSON.parse(JSON.stringify((dashboard as any).testimonials || []));
  const storySection = JSON.parse(JSON.stringify((dashboard as any).storySection || null));

  // Fetch featured products
  const featuredProducts = await Product.find({ isActive: true, isFeatured: true }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(featuredProducts));

  // Build categories with images from first product in each category
  const allProducts = await Product.find({ isActive: true })
    .select("category image")
    .lean();

  const categoryMap = new Map<string, { image?: string; count: number }>();
  for (const p of allProducts) {
    const cat = (p as any).category?.trim();
    if (!cat) continue;
    const existing = categoryMap.get(cat);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(cat, { image: (p as any).image, count: 1 });
    }
  }

  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    image: data.image,
    productCount: data.count,
  }));

  const heroImage = dashboard.hero?.image || "/photo1.png";

  return (
    <main className="flex flex-col">

      {/* 1️⃣ HERO — Full Screen Story Entry */}
      <HeroSection
        title={dashboard.hero?.title || "Empowering Rural Communities"}
        subtitle={dashboard.hero?.subtitle || "Sustainable products, meaningful impact"}
        image={heroImage}
        primaryCTA={{
          label: dashboard.hero?.primaryCTA?.label || "Explore Products",
          link: dashboard.hero?.primaryCTA?.link || "/products",
        }}
        secondaryCTA={{
          label: dashboard.hero?.secondaryCTA?.label || "Our Initiatives",
          link: dashboard.hero?.secondaryCTA?.link || "/services",
        }}
      />

      {/* 2️⃣ IMPACT STATS — Trust Builder */}
      {impact.length > 0 && (
        <TrustSection impact={impact} />
      )}

      {/* 3️⃣ MISSION / STORY SPLIT */}
      {storySection && storySection.title && (
        <MissionSection
          title={storySection.title}
          description={storySection.description}
          image={storySection.image || undefined}
          link={storySection.link || "/stories"}
        />
      )}

      {/* 4️⃣ SHOP BY CATEGORY */}
      {categories.length > 0 && (
        <CategoryGrid categories={categories} />
      )}

      {/* 5️⃣ FEATURED PRODUCTS */}
      {serializedProducts.length > 0 && (
        <FeaturedProductsGrid products={serializedProducts} />
      )}

      {/* 6️⃣ VIEW ALL PRODUCTS STRIP */}
      {serializedProducts.length > 0 && (
        <ViewAllProductsStrip />
      )}

      {/* 7️⃣ TESTIMONIALS — Social Proof */}
      {testimonials.length > 0 && (
        <section className="bg-accent/30">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
                Testimonials
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What People Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from the communities and customers we serve
              </p>
            </ScrollReveal>

            <TestimonialsSection testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* 8️⃣ FINAL CTA — Conversion */}
      <ClosingCTA
        title={dashboard.cta?.title}
        description={dashboard.cta?.description}
        buttonText={dashboard.cta?.buttonText}
        link={dashboard.cta?.link || "/products"}
      />
    </main>
  );
}
