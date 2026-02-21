import { connectDB } from "@/lib/db";
import type { Metadata } from "next";
import Product from "@/lib/models/Product.model";
import ProductCard from "@/components/features/products/ProductCard";
import Link from "next/link";
import { breadcrumbForPage } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";

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
export const revalidate = 0;

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({ isActive: true }).lean();
  const serialized = JSON.parse(JSON.stringify(products));

  return (
    <main className="container mx-auto px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Products", "/products")) }}
      />

      {/* PAGE TITLE */}
      <ScrollReveal>
        <section className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic, handmade, natural and eco-friendly products crafted
            by rural artisans and farmers.
          </p>
        </section>
      </ScrollReveal>

      {/* PRODUCT GRID */}
      <StaggerContainer
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20"
        staggerDelay={0.06}
      >
        {serialized.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No products available at the moment.
          </p>
        ) : (
          serialized.map((item: any) => (
            <ProductCard key={item._id} product={item} />
          ))
        )}
      </StaggerContainer>

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
