# Frontend Routing

## Overview

Routing uses the **Next.js App Router** with file-based conventions. Routes are organized into two route groups: `(public)` for customer-facing pages and `(admin)` for the dashboard.

## Route Map

### Public Routes — `src/app/(public)/`

| Route | Page File | Rendering | Description |
|-------|-----------|-----------|-------------|
| `/` | `page.tsx` | Static + Client polling | Homepage with hero, products, testimonials |
| `/about` | `about/page.tsx` | Dynamic (SSR) | About page — mission, vision, team |
| `/blog` | `blog/page.tsx` | Static | Blog listing with featured post |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Dynamic (SSR) | Individual blog post |
| `/careers` | `careers/page.tsx` | Dynamic (SSR) | Career listings + application form |
| `/cart` | `cart/page.tsx` | Static (client state) | Shopping cart + checkout drawer |
| `/contact` | `contact/page.tsx` | Dynamic (SSR) | Contact form + info |
| `/distributors` | `distributors/page.tsx` | Dynamic (SSR) | Distributor info + application |
| `/login` | `login/page.tsx` | Static | User login form |
| `/signup` | `signup/page.tsx` | Static | User registration form |
| `/order-success/[orderId]` | `order-success/[orderId]/page.tsx` | Dynamic (SSR) | Order confirmation |
| `/privacy-policy` | `privacy-policy/page.tsx` | Dynamic (SSR) | Privacy policy content |
| `/product/[id]` | `product/[id]/page.tsx` | Dynamic (SSR) | Product detail with gallery |
| `/products` | `products/page.tsx` | Dynamic (SSR) | Product catalog with filters |
| `/resources` | `resources/page.tsx` | Static | Downloadable resources |
| `/stories` | `stories/page.tsx` | Static | Community stories listing |
| `/stories/[slug]` | `stories/[slug]/page.tsx` | Dynamic (SSR) | Individual story |
| `/terms-conditions` | `terms-conditions/page.tsx` | Dynamic (SSR) | Terms & conditions |

### Admin Routes — `src/app/(admin)/`

| Route | Page File | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/admin-login` | `admin-login/page.tsx` | No | Admin login page |
| `/admin` | `admin/page.tsx` | Admin role | Admin redirect/landing |
| `/admin/dashboard` | `admin/dashboard/page.tsx` | Admin role | Dashboard overview |
| `/admin/dashboard/about` | `admin/dashboard/about/page.tsx` | Admin role | Manage About page |
| `/admin/dashboard/blogs` | `admin/dashboard/blogs/page.tsx` | Admin role | Manage blog posts |
| `/admin/dashboard/careers` | `admin/dashboard/careers/page.tsx` | Admin role | Manage career listings |
| `/admin/dashboard/contact` | `admin/dashboard/contact/page.tsx` | Admin role | View contact submissions |
| `/admin/dashboard/distributors` | `admin/dashboard/distributors/page.tsx` | Admin role | Manage distributors |
| `/admin/dashboard/footer` | `admin/dashboard/footer/page.tsx` | Admin role | Manage footer content |
| `/admin/dashboard/home` | `admin/dashboard/home/page.tsx` | Admin role | Manage homepage |
| `/admin/dashboard/navbar` | `admin/dashboard/navbar/page.tsx` | Admin role | Manage navigation |
| `/admin/dashboard/orders` | `admin/dashboard/orders/page.tsx` | Admin role | Manage orders |
| `/admin/dashboard/privacy-policy` | `admin/dashboard/privacy-policy/page.tsx` | Admin role | Manage privacy policy |
| `/admin/dashboard/products` | `admin/dashboard/products/page.tsx` | Admin role | Manage products |
| `/admin/dashboard/resources` | `admin/dashboard/resources/page.tsx` | Admin role | Manage resources |
| `/admin/dashboard/services` | `admin/dashboard/services/page.tsx` | Admin role | Manage services |
| `/admin/dashboard/stories` | `admin/dashboard/stories/page.tsx` | Admin role | Manage stories |
| `/admin/dashboard/terms-conditions` | `admin/dashboard/terms-conditions/page.tsx` | Admin role | Manage T&C |

### API Routes — `src/app/api/`

See [Backend API Versioning](../backend/api-versioning.md) for complete API documentation.

### SEO Routes

| Route | File | Purpose |
|-------|------|---------|
| `/robots.txt` | `src/app/robots.ts` | Search engine crawl directives |
| `/sitemap.xml` | `src/app/sitemap.ts` | Dynamic sitemap for all pages |

## Layout Hierarchy

```
src/app/layout.tsx                    → Root (providers, metadata, fonts)
├── src/app/(public)/layout.tsx       → Public (Navbar + Footer + LayoutWrapper)
│   ├── loading.tsx                   → Skeleton loader
│   └── error.tsx                     → Error boundary with retry
├── src/app/(admin)/admin/layout.tsx  → Admin (session guard + header)
│   └── admin/dashboard/layout.tsx    → Dashboard (sidebar, toaster)
└── src/app/not-found.tsx             → Global 404 page
```

## Middleware

**File**: `src/middleware.ts`

- Protects all `/admin/*` routes — requires authenticated session with `admin` role
- Redirects unauthenticated users to `/admin-login?callbackUrl=<original-url>`
- Protects mutating operations on `/api/distributors/*` (POST, PATCH, DELETE)
- Edge-compatible — no database queries in middleware

## Dynamic Route Parameters

| Pattern | Parameter | Usage |
|---------|-----------|-------|
| `/blog/[slug]` | `slug: string` | Blog post URL slug |
| `/stories/[slug]` | `slug: string` | Story URL slug |
| `/product/[id]` | `id: string` | MongoDB ObjectId |
| `/order-success/[orderId]` | `orderId: string` | Order number (MPBB-YYYYMMDD-XXXX) |

## Navigation

Navigation links are configurable through the admin dashboard (`NavbarSettings` model). Default links:

```
Home | About | Products | Blog | Stories | Resources | Careers | Contact | Distributors
```

Cart icon, login button, and theme toggle visibility are also admin-configurable.
