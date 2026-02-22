import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Dashboard from "@/lib/models/Dashboard.model";
import Product from "@/lib/models/Product.model";

import HeroSection from "@/components/features/home/HeroSection";
import TrustSection from "@/components/features/home/TrustSection";
import CategoryGrid from "@/components/features/home/CategoryGrid";
import HomeProductsCarousel from "@/components/features/home/HomeProductsCarousel";
import HomeFeaturedProducts from "@/components/features/home/HomeFeaturedProducts";
import HomeTestimonials from "@/components/features/home/HomeTestimonials";
import ClosingCTA from "@/components/features/home/ClosingCTA";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

/* ── Dummy / fallback data (used when backend data is empty) ── */

const DUMMY_IMPACT = [
  { label: "Women Artisans Empowered", value: "500+" },
  { label: "Villages Reached", value: "50+" },
  { label: "Handcrafted Products", value: "10,000+" },
  { label: "Impact Created", value: "₹2 Crore+" },
];

const DUMMY_CATEGORIES = [
  { name: "Handwoven Textiles", image: "", description: "Traditional handwoven fabrics crafted by rural women artisans" },
  { name: "Handcrafted Jewelry", image: "", description: "Elegant jewelry pieces made with traditional techniques" },
  { name: "Home Decor", image: "", description: "Artisanal home decor items bringing rural charm to your space" },
  { name: "Natural Skincare", image: "", description: "Organic skincare products made from traditional recipes" },
];

const DUMMY_TESTIMONIALS = [
  {
    name: "Ananya Malhotra",
    role: "Mumbai, Maharashtra",
    quote: "The quality of the handwoven dupatta I received exceeded all expectations. You can feel the love and craftsmanship in every thread.",
    avatar: "",
  },
  {
    name: "Vikram Singh",
    role: "Delhi",
    quote: "I bought the bamboo wall hanging for my home office and it's become a conversation starter. The craftsmanship is incredible.",
    avatar: "",
  },
  {
    name: "Priya Desai",
    role: "Bangalore, Karnataka",
    quote: "The natural skincare products are amazing! My skin has never felt better. I love that they're made using traditional recipes.",
    avatar: "",
  },
];

/* ── Metadata ── */

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

  // Dashboard data
  const impact = JSON.parse(JSON.stringify(dashboard.impact || []));
  const testimonials = JSON.parse(JSON.stringify((dashboard as any).testimonials || []));

  // Fetch featured products
  const featuredProducts = await Product.find({ isActive: true, isFeatured: true }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(featuredProducts));

  // Fetch all active products
  const allProducts = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  const allProductsSerialized = JSON.parse(JSON.stringify(allProducts));

  // Build categories from products
  const categoryMap = new Map<string, { image?: string; count: number }>();
  for (const p of allProductsSerialized) {
    const cat = p.category?.trim();
    if (!cat) continue;
    const existing = categoryMap.get(cat);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(cat, { image: p.image, count: 1 });
    }
  }

  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    image: data.image,
    productCount: data.count,
  }));

  const heroImage = dashboard.hero?.image || "/photo1.png";

  // Use real data or fallback to dummy
  const finalImpact = impact.length > 0 ? impact : DUMMY_IMPACT;
  const finalCategories = categories.length > 0 ? categories : DUMMY_CATEGORIES;
  const finalTestimonials = testimonials.length > 0 ? testimonials : DUMMY_TESTIMONIALS;

  return (
    <main className="flex flex-col">

      {/* 1️⃣ HERO */}
      <HeroSection
        title={dashboard.hero?.title || "Empowering Rural Women Through Traditional Crafts"}
        subtitle={dashboard.hero?.subtitle || "Discover handcrafted treasures that tell stories of heritage, skill, and empowerment"}
        image={heroImage}
        primaryCTA={{
          label: dashboard.hero?.primaryCTA?.label || "Shop Collection",
          link: dashboard.hero?.primaryCTA?.link || "/products",
        }}
        secondaryCTA={{
          label: dashboard.hero?.secondaryCTA?.label || "Read Stories",
          link: dashboard.hero?.secondaryCTA?.link || "/stories",
        }}
      />

      {/* 2️⃣ IMPACT STATS */}
      <TrustSection impact={finalImpact} />

      {/* 3️⃣ SHOP BY CATEGORY */}
      <CategoryGrid categories={finalCategories} />

      {/* 4️⃣ OUR PRODUCTS — Horizontal Scroll */}
      {allProductsSerialized.length > 0 && (
        <HomeProductsCarousel products={allProductsSerialized} />
      )}

      {/* 5️⃣ FEATURED COLLECTION */}
      {serializedProducts.length > 0 && (
        <HomeFeaturedProducts products={serializedProducts} />
      )}

      {/* 6️⃣ CUSTOMER TESTIMONIALS */}
      <HomeTestimonials testimonials={finalTestimonials} />

      {/* 7️⃣ FINAL CTA */}
      <ClosingCTA
        title={dashboard.cta?.title}
        description={dashboard.cta?.description}
        buttonText={dashboard.cta?.buttonText}
        link={dashboard.cta?.link || "/products"}
      />
    </main>
  );
}
