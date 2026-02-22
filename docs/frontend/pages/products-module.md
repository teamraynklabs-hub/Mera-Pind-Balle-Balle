# Products Module

## Products Listing Page

### Page Purpose
Displays the full product catalog with category filtering, search, and grid layout.

### Route Path
`/products`

### Required Permissions
None — publicly accessible.

### Layout Used
Public layout with Navbar and Footer.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| ProductsPageClient | `src/components/features/products/ProductsPageClient.tsx` | Main product listing |
| ProductCard | `src/components/features/products/ProductCard.tsx` | Individual product card (memoized) |
| FeaturedProductsScroll | `src/components/features/products/FeaturedProductsScroll.tsx` | Featured products carousel |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | Fetch all active products |
| `/api/categories` | GET | Fetch categories for filter |

### Loading State
- Public `loading.tsx` skeleton shows while page loads
- Product cards have image placeholder via `bg-muted`

### Error Handling
- Error boundary catches render errors
- Empty state message when no products match filters

### Performance Notes
- `ProductCard` is wrapped with `React.memo` to prevent unnecessary re-renders
- Images use `next/image` with responsive `sizes` attribute
- `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"`

---

## Product Detail Page

### Page Purpose
Displays full product information with image gallery, specifications, and purchase actions.

### Route Path
`/product/[id]`

### Dynamic Parameter
`id: string` — MongoDB ObjectId of the product.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| ProductImageGallery | `src/components/features/products/ProductImageGallery.tsx` | Multi-image gallery |
| ProductActions | `src/components/features/products/ProductActions.tsx` | Add to cart / Buy now |
| ProductTabs | `src/components/features/products/ProductTabs.tsx` | Description, story, care tabs |
| RelatedProducts | `src/components/features/products/RelatedProducts.tsx` | Related products grid |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | Fetch product by ID |
| `/api/products` | GET | Fetch related products (same category) |

### State Management
- `useCart()` for add-to-cart functionality
- Local state for quantity selection and active tab

### Edge Cases
- Product not found (404)
- Out of stock (overlay + disabled purchase buttons)
- Low stock warning (badge: "Only X left")
- Product with single image vs. multiple images

---

## Product Card Component

### File
`src/components/features/products/ProductCard.tsx`

### Features
- Responsive image with `next/image fill`
- Featured badge
- Low stock badge (stock <= 5)
- Out of stock overlay
- Hover overlay with "Add to Cart" and "Buy Now" buttons
- Category label
- Price display with Indian Rupee formatting

### Props
```typescript
interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    isFeatured?: boolean;
    stock?: number;
  };
}
```

### Optimization
Wrapped with `React.memo` to prevent re-renders when sibling state changes (e.g., cart updates).
