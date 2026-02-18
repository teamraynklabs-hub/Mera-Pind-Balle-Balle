import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import ClientImage from "@/components/ClientImage";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";
import FeaturedProductsScroll from "@/components/products/FeaturedProductsScroll";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { ArrowRight, BookOpen } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Mera Pind Balle Balle — Rural Women Empowerment & Sustainable Products",
  description:
    "Mera Pind Balle Balle empowers rural women entrepreneurs through skill training, sustainable product development, and community-driven growth across Indian villages.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Mera Pind Balle Balle — Rural Women Empowerment & Sustainable Products",
    description:
      "Empowering rural women entrepreneurs through skill training, sustainable product development, and community-driven growth across Indian villages.",
    url: baseUrl,
    type: "website",
  },
};

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

  const initiatives = dashboard.initiatives || [];
  const impact = dashboard.impact || [];
  const testimonials = (dashboard as any).testimonials || [];
  const storySection = (dashboard as any).storySection || null;

  const featuredProducts = await Product.find({ isActive: true, isFeatured: true }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(featuredProducts));

  // Extract unique categories from all active products
  const allProducts = await Product.find({ isActive: true }).select("category").lean();
  const categories = [
    ...new Set(
      allProducts
        .map((p: any) => p.category)
        .filter((c: string) => c && c.trim() !== "")
    ),
  ];

  // Hero image: backend-driven with fallback
  const heroImage = dashboard.hero?.image || "/hero.png";

  return (
    <main className="flex flex-col">

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_forwards]">
              <h1>
                {dashboard.hero?.title}
              </h1>

              <p className="mt-5 text-lg text-muted-foreground max-w-lg">
                {dashboard.hero?.subtitle}
              </p>

              <div className="mt-8 flex gap-4 flex-wrap">
                <Button asChild size="lg">
                  <Link href={dashboard.hero?.primaryCTA?.link || "/products"}>
                    {dashboard.hero?.primaryCTA?.label || "Explore Products"}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={dashboard.hero?.secondaryCTA?.link || "/services"}>
                    {dashboard.hero?.secondaryCTA?.label || "Our Initiatives"}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="opacity-0 animate-[fadeIn_1s_ease-out_0.2s_forwards] rounded-2xl overflow-hidden shadow-lg border">
              <ClientImage
                src={heroImage}
                alt="Mera Pind Balle Balle Rural Development"
                width={700}
                height={500}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── INITIATIVES ── */}
      {initiatives.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2>Our Key Initiatives</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Driving meaningful change through community-focused programs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((item: any, i: number) => (
              <div
                key={i}
                className="p-6 border rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow duration-300 opacity-0 animate-[fadeUp_0.9s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <h3 className="mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.desc || item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="bg-accent/50">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
            <div className="text-center mb-10">
              <h2>Shop by Category</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Browse our product categories
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat: any, i: number) => (
                <Link
                  key={i}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="group flex items-center justify-center p-6 border rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:border-primary/30 transition-all duration-300"
                >
                  <span className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      {serializedProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2>Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/products">
                View All
                <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>

          <FeaturedProductsScroll products={serializedProducts} />
        </section>
      )}

      {/* ── IMPACT ── */}
      {impact.length > 0 && (
        <section className="bg-primary/5">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
            <div className="text-center mb-10">
              <h2>Our Community Impact</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Real numbers that represent real change in rural communities
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {impact.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="text-center p-8 border rounded-xl bg-card shadow-[var(--shadow-soft)] opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <h3 className="text-4xl font-bold text-primary">
                    {stat.number || stat.value}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STORY / MISSION ── */}
      {storySection && storySection.title && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {storySection.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg border opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
                <ClientImage
                  src={storySection.image}
                  alt={storySection.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_0.2s_forwards]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <BookOpen size={14} />
                Our Story
              </div>
              <h2>{storySection.title}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {storySection.description}
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href={storySection.link || "/stories"}>
                  Read Our Story
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="bg-accent/50">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
            <div className="text-center mb-10">
              <h2>What People Say</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Hear from the communities we work with
              </p>
            </div>

            <TestimonialsSection
              testimonials={JSON.parse(JSON.stringify(testimonials))}
            />
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {dashboard.cta && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="text-center py-14 px-6 bg-primary/5 border border-primary/10 rounded-2xl opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
            <h2 className="mb-4">
              {dashboard.cta.title}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              {dashboard.cta.description}
            </p>
            <Button asChild size="lg">
              <Link href={dashboard.cta.link || "/contact"}>
                {dashboard.cta.buttonText}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
