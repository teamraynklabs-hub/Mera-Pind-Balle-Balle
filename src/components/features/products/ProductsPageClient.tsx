"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Search } from "lucide-react";
import ProductCard from "./ProductCard";
import StaggerContainer from "@/components/motion/StaggerContainer";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isFeatured?: boolean;
  stock?: number;
}

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialCategories: string[];
}

export default function ProductsPageClient({
  initialProducts,
  initialCategories,
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  /* ── Fetch fresh data on mount for real-time updates ── */
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        // Merge category names from Category model + product data
        const categoryNames = new Set<string>();

        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson?.success && Array.isArray(catJson.data)) {
            catJson.data.forEach((c: { name: string }) => categoryNames.add(c.name));
          }
        }

        if (prodRes.ok) {
          const prodJson = await prodRes.json();
          if (prodJson?.success && Array.isArray(prodJson.data)) {
            setProducts(prodJson.data);
            prodJson.data.forEach((p: Product) => {
              if (p.category && p.category.trim()) categoryNames.add(p.category);
            });
          }
        }

        setCategories([...categoryNames].sort());
      } catch {
        /* keep initial data on error */
      }
    }

    fetchData();
  }, []);

  /* ── Filter + Sort ── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const selectArrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 12px center",
    paddingRight: "40px",
  };

  /* ── If no initial data and still loading, show spinner briefly ── */
  if (products.length === 0 && initialProducts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all duration-200 text-sm"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-11 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all duration-200 cursor-pointer appearance-none text-sm"
          style={selectArrowStyle}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-11 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all duration-200 cursor-pointer appearance-none text-sm md:col-span-2 lg:col-span-1"
          style={selectArrowStyle}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20"
          staggerDelay={0.06}
        >
          {filteredProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-20 mb-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">
            No products found
          </p>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortBy("featured");
            }}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
