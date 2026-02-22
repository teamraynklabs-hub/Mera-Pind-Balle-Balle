# Frontend Performance

## Overview

Performance optimizations span image delivery, rendering strategy, bundle size, and runtime behavior.

## Image Optimization

### next/image Component

All images use the `next/image` component with appropriate configuration:

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  className="object-cover"
  priority  // Only for above-the-fold images
/>
```

**Benefits**:
- Automatic WebP/AVIF conversion
- Responsive srcset generation
- Lazy loading by default (eager for `priority` images)
- Blur placeholder support

### Remote Image Domains

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
}
```

### Cloudinary CDN

Product and content images are served via Cloudinary CDN with automatic transformations. Images are uploaded to organized folders (`mpbb/products`, `mpbb/blogs`, etc.).

## Rendering Optimization

### Server Components

Default rendering mode. No client JavaScript is shipped for:
- Page shells and layouts
- Static content sections
- SEO metadata

### Static Generation

Pages with no dynamic data are statically generated at build time:
- `/blog` (listing)
- `/stories` (listing)
- `/resources`
- `/cart`
- `/login`, `/signup`

### Dynamic Rendering

Pages with user-specific or frequently changing data use SSR:
- `/products` (catalog with filters)
- `/product/[id]` (detail page)
- `/blog/[slug]`, `/stories/[slug]` (individual posts)

### Client-Side Polling

```typescript
// HomePageContent.tsx
const POLL_INTERVAL = 120_000; // 2 minutes (reduced from 30s)
```

Polling interval was increased from 30 seconds to 120 seconds to reduce unnecessary network requests while maintaining data freshness.

## Component Optimization

### React.memo

Performance-critical components are wrapped with `React.memo`:

```tsx
// ProductCard.tsx
export default memo(ProductCard);
```

Prevents unnecessary re-renders when parent component updates but product data hasn't changed (e.g., when cart state changes).

### Loading States

**Skeleton Loading** (`src/app/(public)/loading.tsx`):
- Pulse animation skeleton matching page layout
- Hero skeleton, title skeleton, grid skeleton
- Renders instantly while page data loads

**Error Boundary** (`src/app/(public)/error.tsx`):
- Catches runtime errors gracefully
- Provides retry button without full page reload
- Back to Home fallback

### Code Splitting

Next.js automatically code-splits by route. Each page loads only its required JavaScript.

## Form Performance

### react-hook-form

Forms use uncontrolled inputs via `register()` pattern:

```tsx
<input {...register("email")} />
```

**Benefits**:
- No re-render on every keystroke (unlike controlled inputs)
- Validation runs on submit (or configurable trigger)
- Minimal state updates

## CSS Performance

### Tailwind CSS v4

- Utility classes are tree-shaken — only used classes ship to production
- CSS custom properties for theme values (no JS for theme switching)
- `@layer` directive for proper cascade ordering

### Animation Performance

- CSS animations preferred for simple effects (`animate-pulse`, `animate-fadeUp`)
- Motion library used only for complex scroll-driven animations
- `will-change` applied sparingly through Tailwind utilities

## Bundle Optimization

### Dependencies Audit

| Category | Package | Size Impact |
|----------|---------|-------------|
| UI Framework | React 19 | Core (unavoidable) |
| Icons | lucide-react | Tree-shakeable (only used icons ship) |
| Animations | motion | Loaded only in animated components |
| Forms | react-hook-form + zod | Small, loaded in form pages only |
| HTTP | axios | ~14kb gzipped (client components only) |
| Toast | sonner | ~5kb gzipped |

### Removed Dependencies

- `react-icons` — Removed in favor of `lucide-react` (single icon library)
- Unused components deleted (`TiltCard.tsx`, `SafeIcon.tsx`)

## Monitoring Checklist

- [ ] Run Lighthouse audit on all public pages
- [ ] Verify Core Web Vitals (LCP, FID, CLS)
- [ ] Check image sizes with `next/image` analyzer
- [ ] Monitor bundle size with `@next/bundle-analyzer`
- [ ] Test on slow 3G network simulation
