"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductImage {
  url: string;
  imageId?: string;
}

interface ProductImageGalleryProps {
  mainImage: string;
  images?: ProductImage[];
  name: string;
  discountPercent?: number;
}

export default function ProductImageGallery({
  mainImage,
  images,
  name,
  discountPercent,
}: ProductImageGalleryProps) {
  const allImages = [
    { url: mainImage },
    ...(images || []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border bg-muted">
        <Image
          src={allImages[selectedIndex].url}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 50vw"
          priority
        />
        {discountPercent && discountPercent > 0 && (
          <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-500 text-white border-0 text-sm px-3 py-1 shadow-lg">
            {discountPercent}% OFF
          </Badge>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <Image
                src={img.url}
                alt={`${name} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
