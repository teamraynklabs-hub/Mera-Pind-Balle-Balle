import { connectDB } from "@/lib/db";
import type { Metadata } from "next";
import Product from "@/lib/models/Product.model";
import Category from "@/lib/models/Category.model";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/motion/ScrollReveal";
import ProductsPageClient from "@/components/features/products/ProductsPageClient";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

export const metadata: Metadata = {
  title: "Products — Mera Pind Balle Balle | Handcrafted & Organic Rural Goods",
  description:
    "Explore our authentic rural products including handcrafted items, organic food, natural produce and sustainable village-based goods.",
  alternates: { canonical: `${baseUrl}/products` },
  openGraph: {
    title: "Products — Mera Pind Balle Balle | Handcrafted & Organic Rural Goods",
    description: "Explore our authentic rural products including handcrafted items, organic food, natural produce and sustainable village-based goods.",
    url: `${baseUrl}/products`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  const [products, dbCategories] = await Promise.all([
    Product.find({ isActive: true }).lean(),
    Category.find({ isActive: true }).select("name").sort({ name: 1 }).lean(),
  ]);
  const serialized = JSON.parse(JSON.stringify(products));

  // Merge categories from Category model + any used in products
  const categoryNames = new Set<string>(
    dbCategories.map((c: any) => c.name)
  );
  serialized.forEach((p: any) => {
    if (p.category && p.category.trim()) categoryNames.add(p.category);
  });
  const categories: string[] = [...categoryNames].sort();

  return (
    <main className="container mx-auto px-4 py-16 md:py-20">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />

      {/* PAGE HEADER */}
      <ScrollReveal>
        <section className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover handcrafted treasures from talented rural artisans
          </p>
        </section>
      </ScrollReveal>

      {/* FILTERS + PRODUCT GRID — client component for real-time updates */}
      <ProductsPageClient initialProducts={serialized} initialCategories={categories} />

      {/* CTA SECTION */}
      <ScrollReveal>
        <section className="py-14 text-center bg-accent/30 rounded-3xl border">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Bulk Orders & Distribution
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-lg">
            If you are a wholesaler, retailer, NGO or corporate organization, we
            offer custom and bulk order solutions.
          </p>
          <Button asChild size="lg">
            <Link href="/distributors">Become a Distributor</Link>
          </Button>
        </section>
      </ScrollReveal>
    </main>
  );
}
