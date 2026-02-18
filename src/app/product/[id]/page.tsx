import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product.model";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductActions from "@/components/products/ProductActions";
import RelatedProducts from "@/components/products/RelatedProducts";
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

    return {
      title: `${product.name} — Mera Pind Balle Balle`,
      description: product.description,
      alternates: { canonical: productUrl },
      openGraph: {
        title: product.name,
        description: product.description,
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

  return (
    <main className="container mx-auto px-4 py-10 sm:py-14 max-w-5xl">
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
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Products
      </Link>

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border bg-muted shadow-sm">
          <Image
            src={serialized.image}
            alt={serialized.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {serialized.name}
          </h1>

          <div className="inline-flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-primary tabular-nums">
              ₹{serialized.price}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
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
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
