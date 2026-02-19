import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import ClientImage from "@/components/ClientImage";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";
import FeaturedProductsScroll from "@/components/products/FeaturedProductsScroll";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HeroSection from "@/components/home/HeroSection";
import ScrollStorySection from "@/components/home/ScrollStorySection";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import TrustSection from "@/components/home/TrustSection";
import ClosingCTA from "@/components/home/ClosingCTA";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { ArrowRight, BookOpen } from "lucide-react";

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

  const initiatives = JSON.parse(JSON.stringify(dashboard.initiatives || []));
  const impact = JSON.parse(JSON.stringify(dashboard.impact || []));
  const testimonials = JSON.parse(JSON.stringify((dashboard as any).testimonials || []));
  const storySection = JSON.parse(JSON.stringify((dashboard as any).storySection || null));

  const featuredProducts = await Product.find({ isActive: true, isFeatured: true }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(featuredProducts));

  const allProducts = await Product.find({ isActive: true }).select("category").lean();
  const categories = [
    ...new Set(
      allProducts
        .map((p: any) => p.category)
        .filter((c: string) => c && c.trim() !== "")
    ),
  ];

  const heroImage = dashboard.hero?.image || "/hero.png";

  return (
    <main className="flex flex-col">

      {/* ── CINEMATIC HERO ── */}
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

      {/* ── SCROLL STORY — INITIATIVES ── */}
      {initiatives.length > 0 && (
        <ScrollStorySection items={initiatives} />
      )}

      {/* ── INTERACTIVE CATEGORIES ── */}
      {categories.length > 0 && (
        <CategoryGrid categories={categories as string[]} />
      )}

      {/* ── PRODUCT SPOTLIGHT ── */}
      {serializedProducts.length > 0 && (
        <ProductSpotlight product={serializedProducts[0]} />
      )}

      {/* ── FEATURED PRODUCTS GALLERY ── */}
      {serializedProducts.length > 1 && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Featured Products
              </h2>
              <Button variant="outline" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <FeaturedProductsScroll products={serializedProducts} />
        </section>
      )}

      {/* ── TRUST / IMPACT ── */}
      {impact.length > 0 && (
        <TrustSection impact={impact} />
      )}

      {/* ── STORY / MISSION ── */}
      {storySection && storySection.title && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {storySection.image && (
              <ScrollReveal>
                <div className="rounded-3xl overflow-hidden shadow-(--shadow-deep) border">
                  <ClientImage
                    src={storySection.image}
                    alt={storySection.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </ScrollReveal>
            )}
            <ScrollReveal delay={0.2}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <BookOpen size={14} />
                Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {storySection.title}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
                {storySection.description}
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href={storySection.link || "/stories"}>
                  Read Our Story
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="bg-accent/30">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                What People Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from the communities we work with
              </p>
            </ScrollReveal>

            <TestimonialsSection
              testimonials={JSON.parse(JSON.stringify(testimonials))}
            />
          </div>
        </section>
      )}

      {/* ── CLOSING CTA ── */}
      {dashboard.cta && (
        <ClosingCTA
          title={dashboard.cta.title}
          description={dashboard.cta.description}
          buttonText={dashboard.cta.buttonText}
          link={dashboard.cta.link || "/contact"}
        />
      )}
    </main>
  );
}
