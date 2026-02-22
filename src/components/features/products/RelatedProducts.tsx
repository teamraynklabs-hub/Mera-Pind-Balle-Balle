"use client";

import ProductCard from "@/components/features/products/ProductCard";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            You May Also Like
          </h2>
          <p className="text-muted-foreground">
            More handcrafted treasures from our collection
          </p>
        </div>
      </ScrollReveal>

      <StaggerContainer
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        staggerDelay={0.08}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </StaggerContainer>
    </section>
  );
}
