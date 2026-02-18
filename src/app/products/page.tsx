import { connectDB } from "@/lib/db";
import type { Metadata } from "next";
import Product from "@/lib/models/Product.model";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { breadcrumbForPage } from "@/lib/seo";
import { Button } from "@/components/ui/button";

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
    <main className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbForPage("Products", "/products")) }}
      />

      {/* PAGE TITLE */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover authentic, handmade, natural and eco-friendly products crafted
          by rural artisans and farmers.
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {serialized.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No products available at the moment.
          </p>
        ) : (
          serialized.map((item: any) => (
            <ProductCard key={item._id} product={item} />
          ))
        )}
      </section>

      {/* CTA SECTION */}
      <section className="py-12 text-center bg-accent rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-3">Bulk Orders & Distribution</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          If you are a wholesaler, retailer, NGO or corporate organization, we
          offer custom and bulk order solutions.
        </p>
        <Button asChild>
          <Link href="/distributors">Become a Distributor</Link>
        </Button>
      </section>
    </main>
  );
}
