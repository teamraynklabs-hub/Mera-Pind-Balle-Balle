import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product.model";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Check,
} from "lucide-react";
import ProductActions from "@/components/features/products/ProductActions";
import ProductImageGallery from "@/components/features/products/ProductImageGallery";
import ProductTabs from "@/components/features/products/ProductTabs";
import RelatedProducts from "@/components/features/products/RelatedProducts";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://merapindballeballe.com";

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

    const metaDescription =
      product.description.length > 150
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
    ...(product.category ? { category: product.category } : {}),
  })
    .select("name description price image category stock isFeatured")
    .limit(8)
    .lean();
  const relatedProducts = JSON.parse(JSON.stringify(relatedRaw));

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
  const hasOriginalPrice =
    serialized.originalPrice && serialized.originalPrice > serialized.price;
  const discountPercent = hasOriginalPrice
    ? Math.round(
        ((serialized.originalPrice - serialized.price) /
          serialized.originalPrice) *
          100
      )
    : 0;

  // Product details for the spec table
  const details: { label: string; value: string }[] = [];
  if (serialized.material)
    details.push({ label: "Material", value: serialized.material });
  if (serialized.color)
    details.push({ label: "Color", value: serialized.color });
  if (serialized.weight)
    details.push({ label: "Weight", value: serialized.weight });
  if (serialized.sku) details.push({ label: "SKU", value: serialized.sku });

  return (
    <main className="container mx-auto px-4 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          ...(serialized.category
            ? [{ label: serialized.category, href: "/products" }]
            : []),
          { label: serialized.name },
        ]}
      />

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Image Gallery */}
        <ProductImageGallery
          mainImage={serialized.image}
          images={serialized.images}
          name={serialized.name}
          discountPercent={discountPercent}
        />

        {/* Info */}
        <ScrollReveal delay={0.15} y={16}>
          <div className="flex flex-col">
            {/* Category Badge */}
            {serialized.category && (
              <Badge
                variant="outline"
                className="w-fit mb-3 text-xs font-medium"
              >
                {serialized.category}
              </Badge>
            )}

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              {serialized.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(48 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                ₹{serialized.price}
              </span>
              {hasOriginalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through tabular-nums">
                    ₹{serialized.originalPrice}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
              {serialized.description}
            </p>

            {/* Product Details Table */}
            {(details.length > 0 || inStock) && (
              <div className="border-t pt-5 mb-6 space-y-3">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {detail.label}:
                    </span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Availability:</span>
                  <span
                    className={`font-medium flex items-center gap-1.5 ${
                      inStock
                        ? "text-green-600 dark:text-green-400"
                        : "text-destructive"
                    }`}
                  >
                    {inStock && <Check size={14} />}
                    {inStock
                      ? `${serialized.stock} in stock`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            {inStock && (
              <ProductActions
                product={{
                  _id: serialized._id,
                  name: serialized.name,
                  price: serialized.price,
                  image: serialized.image,
                  stock: serialized.stock,
                }}
              />
            )}

            {!inStock && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
                <p className="text-destructive font-medium">
                  This product is currently out of stock
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check back later or browse our other products
                </p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t">
              <div className="grid grid-cols-3 gap-4 bg-card border rounded-xl p-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Free Shipping</p>
                    <p className="text-[10px] text-muted-foreground">
                      On orders over ₹999
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <RotateCcw size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Easy Returns</p>
                    <p className="text-[10px] text-muted-foreground">
                      7-day return policy
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Secure Payment</p>
                    <p className="text-[10px] text-muted-foreground">
                      100% protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Product Tabs - Story, Care Instructions, Social Impact */}
      <ProductTabs
        story={serialized.story}
        careInstructions={serialized.careInstructions}
        socialImpact={serialized.socialImpact}
        productName={serialized.name}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
