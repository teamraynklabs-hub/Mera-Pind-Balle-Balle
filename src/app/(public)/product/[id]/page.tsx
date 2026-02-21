import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product.model";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Truck, RotateCcw } from "lucide-react";
import ProductActions from "@/components/features/products/ProductActions";
import RelatedProducts from "@/components/features/products/RelatedProducts";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product || !product.isActive) {
      return { title: "Product Not Found" };
    }

    const productUrl = `${baseUrl}/product/${product._id}`;

    const metaDescription = product.description.length > 150
      ? product.description.slice(0, 150) + "..."
      : product.description;

    return {
      title: `${product.name} | Mera Pind Balle Balle`,
      description: metaDescription,
      alternates: { canonical: productUrl },
      openGraph: {
        title: `${product.name} | Mera Pind Balle Balle`,
        description: metaDescription,
        url: productUrl,
        type: "website",
        images: [{ url: product.image, alt: product.name }],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  await connectDB();

  let product;
  try {
    product = await Product.findById(id).lean();
  } catch {
    notFound();
  }

  if (!product || !product.isActive) {
    notFound();
  }

  const serialized = JSON.parse(JSON.stringify(product));

  const relatedRaw = await Product.find({
    isActive: true,
    _id: { $ne: product._id },
  })
    .select("name description price image")
    .limit(8)
    .lean();
  const relatedProducts = JSON.parse(JSON.stringify(relatedRaw));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: baseUrl },
    { name: "Products", url: `${baseUrl}/products` },
    { name: serialized.name, url: `${baseUrl}/product/${serialized._id}` },
  ]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: serialized.name,
    description: serialized.description,
    image: serialized.image,
    url: `${baseUrl}/product/${serialized._id}`,
    offers: {
      "@type": "Offer",
      price: serialized.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Mera Pind Balle Balle",
      },
    },
    brand: {
      "@type": "Brand",
      name: "Mera Pind Balle Balle",
    },
  };

  const inStock = serialized.stock !== 0;

  return (
    <main className="container mx-auto px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Products
      </Link>

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden border bg-muted shadow-(--shadow-medium)">
          <Image
            src={serialized.image}
            alt={serialized.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <ScrollReveal delay={0.15} y={16}>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {serialized.name}
            </h1>

            <div className="inline-flex items-baseline gap-2 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                ₹{serialized.price}
              </span>
            </div>

            {/* Stock Indicator */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  inStock ? "bg-green-500" : "bg-destructive"
                }`}
              />
              <span className={`text-sm font-medium ${
                inStock ? "text-green-600 dark:text-green-400" : "text-destructive"
              }`}>
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8 text-[15px]">
              {serialized.description}
            </p>

            <ProductActions
              product={{
                _id: serialized._id,
                name: serialized.name,
                price: serialized.price,
                image: serialized.image,
              }}
            />

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
