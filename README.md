# Mera Pind Balle Balle — Complete UI & Project Documentation

> A full-stack rural women empowerment e-commerce & content platform built with Next.js 15 App Router, MongoDB, and Framer Motion.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Design System](#4-design-system)
5. [Public Pages — Detailed UI Breakdown](#5-public-pages--detailed-ui-breakdown)
   - [Home Page (`/`)](#51-home-page-)
   - [Products Page (`/products`)](#52-products-page-products)
   - [Product Detail Page (`/product/[id]`)](#53-product-detail-page-productid)
   - [Cart Page (`/cart`)](#54-cart-page-cart)
   - [Blog Page (`/blog`)](#55-blog-page-blog)
   - [Blog Detail Page (`/blog/[slug]`)](#56-blog-detail-page-blogslug)
   - [About Page (`/about`)](#57-about-page-about)
   - [Stories Page (`/stories`)](#58-stories-page-stories)
   - [Story Detail Page (`/stories/[slug]`)](#59-story-detail-page-storiesslug)
   - [Services Page (`/services`)](#510-services-page-services)
   - [Contact Page (`/contact`)](#511-contact-page-contact)
   - [Distributors Page (`/distributors`)](#512-distributors-page-distributors)
   - [Careers Page (`/careers`)](#513-careers-page-careers)
   - [Resources Page (`/resources`)](#514-resources-page-resources)
   - [Login Page (`/login`)](#515-login-page-login)
   - [Signup Page (`/signup`)](#516-signup-page-signup)
   - [Order Success Page (`/order-success/[orderId]`)](#517-order-success-page-order-successorderid)
   - [Privacy Policy & Terms Pages](#518-privacy-policy--terms-pages)
6. [Admin Pages — Detailed UI Breakdown](#6-admin-pages--detailed-ui-breakdown)
   - [Admin Login (`/admin-login`)](#61-admin-login-admin-login)
   - [Admin Dashboard Home (`/admin/dashboard`)](#62-admin-dashboard-home-admindashboard)
   - [Home Section Manager](#63-home-section-manager)
   - [Products Manager](#64-products-manager)
   - [Blogs Manager](#65-blogs-manager)
   - [Stories Manager](#66-stories-manager)
   - [Services Manager](#67-services-manager)
   - [Resources Manager](#68-resources-manager)
   - [About Manager](#69-about-manager)
   - [Contact Leads Manager](#610-contact-leads-manager)
   - [Careers Manager](#611-careers-manager)
   - [Distributors Manager](#612-distributors-manager)
   - [Orders Manager](#613-orders-manager)
7. [Components Reference](#7-components-reference)
   - [Common Components](#71-common-components)
   - [Home Feature Components](#72-home-feature-components)
   - [Product Components](#73-product-components)
   - [Cart Components](#74-cart-components)
   - [Motion & Animation Components](#75-motion--animation-components)
   - [Layout Components](#76-layout-components)
   - [UI Primitives (Shadcn)](#77-ui-primitives-shadcn)
8. [API Routes Reference](#8-api-routes-reference)
9. [Database Models (MongoDB Schemas)](#9-database-models-mongodb-schemas)
10. [Authentication System](#10-authentication-system)
11. [Context / State Management](#11-context--state-management)
12. [Key Features Summary](#12-key-features-summary)
13. [Environment Variables](#13-environment-variables)

---

## 1. Project Overview

**Mera Pind Balle Balle** is a bilingual-friendly rural e-commerce and storytelling platform. It empowers village women by providing them:

- An online storefront to sell hand-crafted and farm-produced products
- A blogging & storytelling platform to share their journeys
- A career board and distributor network
- A full-featured admin CMS panel to manage all content without code

**Target audience:** Women producers from rural Punjab, their buyers, distributors, NGOs, and social impact investors.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn/ui (new-york style), Radix UI |
| Animations | Framer Motion (motion v12) |
| Database | MongoDB via Mongoose 9 |
| Authentication | NextAuth v5 (admin) + Custom JWT (users) |
| Image Hosting | Cloudinary |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + React Icons |
| Toast Notifications | Sonner |
| Dark Mode | next-themes |
| HTTP Client | Axios |
| Rich Text Editor | React Quill New |
| Export | xlsx (orders to Excel) |
| Deployment | Vercel (recommended) |

---

## 3. Folder Structure

```
src/
├── app/
│   ├── (public)/                   # All public-facing pages
│   │   ├── layout.tsx              # Public layout: fetches footer, renders Navbar+Footer
│   │   ├── page.tsx                # Home page
│   │   ├── about/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── products/page.tsx
│   │   ├── product/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── services/page.tsx
│   │   ├── stories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── careers/
│   │   │   ├── page.tsx
│   │   │   └── CareersForm.tsx
│   │   ├── distributors/
│   │   │   ├── page.tsx
│   │   │   └── DistributorsForm.tsx
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── signup/
│   │   │   ├── page.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── order-success/[orderId]/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms-conditions/page.tsx
│   │
│   ├── (admin)/                    # Admin panel pages
│   │   ├── admin/
│   │   │   ├── page.tsx            # Admin root (redirects to dashboard)
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx      # Sidebar + header layout
│   │   │       ├── page.tsx        # Dashboard home (stats)
│   │   │       ├── home/page.tsx
│   │   │       ├── products/page.tsx
│   │   │       ├── blogs/page.tsx
│   │   │       ├── stories/page.tsx
│   │   │       ├── services/page.tsx
│   │   │       ├── resources/page.tsx
│   │   │       ├── about/page.tsx
│   │   │       ├── contact/page.tsx
│   │   │       ├── careers/page.tsx
│   │   │       ├── distributors/page.tsx
│   │   │       ├── distributors/page-manager.tsx
│   │   │       └── orders/page.tsx
│   │   └── admin-login/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   │
│   ├── api/
│   │   ├── (public)/               # Public API routes
│   │   └── admin/                  # Admin API routes (protected)
│   │
│   ├── layout.tsx                  # Root layout (providers only)
│   ├── robots.ts                   # SEO robots.txt
│   └── sitemap.ts                  # Auto-generated sitemap
│
├── components/
│   ├── ui/                         # Shadcn/ui primitives
│   ├── common/                     # Navbar, Footer, LayoutWrapper, ClientImage, SafeIcon
│   ├── admin/                      # AdminLogoutButton, AdminSessionProvider
│   ├── providers/                  # AuthSessionProvider, ThemeProvider
│   ├── features/
│   │   ├── home/                   # HeroSection, CategoryGrid, ProductSpotlight, etc.
│   │   ├── products/               # ProductCard, ProductActions, FeaturedProductsScroll, RelatedProducts
│   │   └── cart/                   # CartPageClient, CheckoutDrawer
│   ├── layout/                     # PageContainer, PageTransition
│   └── motion/                     # ParallaxImage, ScrollReveal, StaggerContainer, TextReveal, TiltCard
│
├── context/
│   ├── CartContext.tsx             # Cart state (localStorage persistence)
│   └── UserAuthContext.tsx         # User auth state
│
├── hooks/
│   └── useActivityTimeout.ts       # Auto-logout on inactivity
│
├── lib/
│   ├── db/index.ts                 # MongoDB connection
│   ├── models/                     # 16 Mongoose models
│   ├── auth/                       # Auth utilities (hash, JWT, options)
│   ├── validations/                # Zod schemas
│   ├── api/                        # API client utilities
│   ├── cloudinary.ts               # Upload helper
│   ├── cloudinaryDelete.ts         # Delete helper
│   ├── exportOrders.ts             # Orders to Excel
│   ├── requireAdmin.ts             # Admin auth guard
│   └── utils.ts                    # clsx/cn utility
│
├── types/
│   └── next-auth.d.ts              # NextAuth type extensions
│
├── auth.ts                         # NextAuth config
├── auth.config.ts                  # NextAuth base config
└── middleware.ts                   # Route protection middleware
```

---

## 4. Design System

### Colors

The app uses a **warm earthy palette** reflecting Punjab's agricultural roots:

| Token | Usage | Approximate Color |
|---|---|---|
| `primary` | Buttons, links, highlights | Deep golden-amber |
| `secondary` | Accents, badges | Warm terracotta/orange |
| `background` | Page backgrounds | Light cream / dark slate |
| `foreground` | Body text | Near black / near white |
| `muted` | Subdued text, borders | Gray tones |
| `card` | Card backgrounds | White / dark-gray |
| `destructive` | Error states | Red |

Dark mode is fully supported via `next-themes` with CSS variables.

### Typography

- **Heading font:** Display/serif-like — large weights
- **Body font:** System font stack, readable for long content
- **Sizes:** Tailwind responsive scale (text-sm → text-6xl)

### Spacing & Layout

- **Max content width:** `max-w-7xl` centered with horizontal padding
- **Section padding:** `py-16` to `py-24` for major sections
- **Grid breakpoints:** `grid-cols-1` (mobile) → `sm:grid-cols-2` → `lg:grid-cols-3` / `lg:grid-cols-4`
- **Card border radius:** `rounded-xl` to `rounded-2xl`
- **Shadows:** `shadow-md` on cards, `shadow-xl` on hover/modals

### Animation Style

- Smooth fade-in + slide-up on scroll (ScrollReveal)
- Character-by-character text reveal (TextReveal)
- Parallax image scrolling (ParallaxImage)
- Staggered card entrances (StaggerContainer)
- 3D hover tilt on cards (TiltCard)
- Spring physics (Framer Motion default spring)

---

## 5. Public Pages — Detailed UI Breakdown

### 5.1 Home Page (`/`)

**Route:** `/` | **File:** `src/app/(public)/page.tsx`

The home page is assembled from 8 distinct sections, all fetched server-side from the Dashboard model.

---

#### Section 1: HeroSection

**Component:** `src/components/features/home/HeroSection.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  [FULL-VIEWPORT PARALLAX IMAGE BACKGROUND]              │
│                                                         │
│  ████  gradient overlay top-right                       │
│                                                         │
│         ┌────────────────────────────┐                  │
│         │  [TextReveal Animation]    │                  │
│         │  H1: Hero Title (large)    │                  │
│         │                            │                  │
│         │  [ScrollReveal Animation]  │                  │
│         │  Subtitle paragraph text   │                  │
│         │                            │                  │
│         │  [Primary CTA Button]      │                  │
│         │  [Secondary CTA Button]    │                  │
│         └────────────────────────────┘                  │
│                                                         │
│  ████  gradient overlay bottom                          │
│                          ↓ scroll indicator              │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `hero.title` — Main heading (animated letter by letter)
- `hero.subtitle` — Supporting text below heading
- `hero.image` — Full-bleed background image (Cloudinary)
- `hero.primaryCTA.label` + `hero.primaryCTA.link` — Main button
- `hero.secondaryCTA.label` + `hero.secondaryCTA.link` — Ghost/outline button

**Design notes:**
- Height: `100vh` minimum
- Text is left or center-aligned
- Buttons side by side on desktop, stacked on mobile
- Scroll indicator is an animated down-arrow or bouncing dot

---

#### Section 2: ScrollStorySection

**Component:** `src/components/features/home/ScrollStorySection.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Section Label / Badge: "Our Initiatives"               │
│  Section Title (h2)                                     │
│                                                         │
│  ← [Card 1]  [Card 2]  [Card 3]  [Card 4]  [Card 5] → │
│     (Horizontal scroll or staggered fade-in)            │
│                                                         │
│  Each card:                                             │
│  ┌──────────────┐                                       │
│  │  Icon/Image  │                                       │
│  │  Title       │                                       │
│  │  Description │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `initiatives[]` — Array of { title, description } from Dashboard

**Design notes:**
- Cards scroll horizontally on mobile
- Stagger animation on desktop (each card fades up with delay)

---

#### Section 3: CategoryGrid

**Component:** `src/components/features/home/CategoryGrid.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Section Title: "Shop by Category"                      │
│                                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │               │
│  │      │  │      │  │      │  │      │               │
│  │ Cat  │  │ Cat  │  │ Cat  │  │ Cat  │               │
│  │ Name │  │ Name │  │ Name │  │ Name │               │
│  └──────┘  └──────┘  └──────┘  └──────┘               │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- Product categories fetched from products API (unique categories)
- Or from `popularProducts[]` in Dashboard model

**Design notes:**
- Grid: 2 cols mobile, 4 cols desktop
- Each cell is a clickable link to `/products?category=X`
- Hover: scale + shadow lift effect

---

#### Section 4: ProductSpotlight

**Component:** `src/components/features/home/ProductSpotlight.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Badge: "Featured Product"                              │
│                                                         │
│  ┌────────────────────┐  ┌──────────────────────────┐  │
│  │                    │  │  Product Title (h2)        │  │
│  │  [Large Product    │  │                            │  │
│  │   Image with       │  │  Description paragraph     │  │
│  │   parallax]        │  │                            │  │
│  │                    │  │  ₹ Price (large, bold)     │  │
│  │                    │  │                            │  │
│  │                    │  │  [Add to Cart]  [Buy Now]  │  │
│  └────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `popularProducts[0]` — { title, description, image }

---

#### Section 5: FeaturedProductsScroll

**Component:** `src/components/features/products/FeaturedProductsScroll.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Section Title: "Our Products"     [View All →]         │
│                                                         │
│  ←  [ProductCard] [ProductCard] [ProductCard] [...]  →  │
│     (Horizontally scrollable row)                       │
└─────────────────────────────────────────────────────────┘
```

**Design notes:**
- Horizontal scroll with hidden scrollbar on mobile
- Each card is a ProductCard (see component reference)
- "View All →" links to `/products`

---

#### Section 6: TrustSection

**Component:** `src/components/features/home/TrustSection.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Section Title: "Our Impact"                            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  1000+   │  │   50+    │  │   200+   │  │  ...   │ │
│  │  Women   │  │ Villages │  │ Products │  │        │ │
│  │Empowered │  │ Covered  │  │ Listed   │  │        │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `impact[]` — Array of { label, value } from Dashboard

**Design notes:**
- Large number typography with animated count-up
- Grid: 2 cols mobile, 4 cols desktop
- Background: colored or gradient section

---

#### Section 7: Story/Mission Section (inline in home page)

```
┌─────────────────────────────────────────────────────────┐
│  Badge: "Our Story"                                     │
│                                                         │
│  ┌──────────────────────┐  ┌────────────────────────┐  │
│  │                      │  │  Story Title (h2)       │  │
│  │  [Story Image]       │  │                         │  │
│  │                      │  │  Story Description      │  │
│  │                      │  │  (multiple paragraphs)  │  │
│  │                      │  │                         │  │
│  │                      │  │  [Read Our Story →]     │  │
│  └──────────────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `storySection.title`, `storySection.description`, `storySection.image`, `storySection.link`

---

#### Section 8: TestimonialsSection

**Component:** `src/components/features/home/TestimonialsSection.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Section Title: "What People Say"                       │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  " Quote text "  │  │  " Quote text "  │            │
│  │                  │  │                  │            │
│  │  [Avatar] Name   │  │  [Avatar] Name   │            │
│  │  Role/Location   │  │  Role/Location   │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `testimonials[]` — Array of { name, role, quote, avatar }

**Design notes:**
- Card grid: 1 col mobile, 2-3 cols desktop
- Each card has a large opening quote mark
- Optional avatar image, defaults to initials

---

#### Section 9: ClosingCTA

**Component:** `src/components/features/home/ClosingCTA.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  [Full-width background — gradient or image]            │
│                                                         │
│           CTA Title (large h2)                          │
│           Description paragraph                         │
│                                                         │
│           [Primary CTA Button]                          │
└─────────────────────────────────────────────────────────┘
```

**Data fields used:**
- `cta.title`, `cta.description`, `cta.buttonText`, `cta.link`

---

### 5.2 Products Page (`/products`)

**Route:** `/products` | **File:** `src/app/(public)/products/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  PAGE HEADER                                            │
│  Title: "Our Products"                                  │
│  Subtitle: short description                            │
├─────────────────────────────────────────────────────────┤
│  PRODUCTS GRID                                          │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Product  │  │ Product  │  │ Product  │  │Product │ │
│  │  Card    │  │  Card    │  │  Card    │  │  Card  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Product  │  │ Product  │  │ Product  │  │Product │ │
│  │  Card    │  │  Card    │  │  Card    │  │  Card  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
├─────────────────────────────────────────────────────────┤
│  DISTRIBUTOR CTA                                        │
│  "Become a Distributor" — link to /distributors         │
└─────────────────────────────────────────────────────────┘
```

**Layout:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`

**ProductCard layout (each card):**

```
┌─────────────────────┐
│  [Product Image]    │  ← aspect-4/3, hover: scale-105
│  4:3 ratio          │
├─────────────────────┤
│  Product Name       │  ← 1 line clamp, font-semibold
│  Description...     │  ← 2 line clamp, text-muted
│                     │
│  ₹ 299              │  ← Price, large, bold, primary color
│                     │
│  [Add to Cart]      │  ← outline button, full width
│  [Buy Now]          │  ← primary button, full width
└─────────────────────┘
```

---

### 5.3 Product Detail Page (`/product/[id]`)

**Route:** `/product/[id]` | **File:** `src/app/(public)/product/[id]/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Products                                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │                      │  │  Product Name (h1)        │ │
│  │  [Product Image]     │  │                           │ │
│  │  (aspect-square,     │  │  ₹ Price (large, bold)    │ │
│  │   rounded-2xl)       │  │                           │ │
│  │                      │  │  ● In Stock  /  ✗ Out     │ │
│  │                      │  │                           │ │
│  │                      │  │  Description text         │ │
│  │                      │  │  (multiple paragraphs)    │ │
│  │                      │  │                           │ │
│  │                      │  │  [ProductActions]         │ │
│  │                      │  │    Qty: [−] 1 [+]         │ │
│  │                      │  │    [Add to Cart]          │ │
│  │                      │  │    [Buy Now]              │ │
│  │                      │  │                           │ │
│  │                      │  │  Trust Badges:            │ │
│  │                      │  │  🔒 Secure  🚚 Free Ship  │ │
│  │                      │  │  ↩ Easy Returns           │ │
│  └──────────────────────┘  └──────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  RELATED PRODUCTS                                        │
│  "You Might Also Like"                                  │
│  [ProductCard] [ProductCard] [ProductCard]              │
└─────────────────────────────────────────────────────────┘
```

---

### 5.4 Cart Page (`/cart`)

**Route:** `/cart` | **File:** `src/app/(public)/cart/page.tsx` + `CartPageClient.tsx`

#### Empty State

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              🛍  (large shopping bag icon)              │
│                                                         │
│           Your cart is empty                           │
│                                                         │
│           [Continue Shopping]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Filled State (2-column desktop layout)

```
┌──────────────────────────────────┬──────────────────────┐
│  CART ITEMS (2/3 width)          │  ORDER SUMMARY (1/3) │
│                                  │  (sticky position)   │
│  ┌──────────────────────────┐    │  Subtotal:  ₹ 1,297  │
│  │[img] Product Name   ₹299│    │  Delivery:  Free     │
│  │      Color/variant       │    │  ─────────────────── │
│  │      [−] 2 [+]   ₹598  │    │  Total:     ₹ 1,297  │
│  │      [🗑 Remove]         │    │                      │
│  └──────────────────────────┘    │  [Proceed to         │
│                                  │   Checkout]          │
│  ┌──────────────────────────┐    │                      │
│  │[img] Product Name   ₹699│    │  🔒 Secure Checkout  │
│  │      [−] 1 [+]   ₹699  │    │  🚚 Free Shipping    │
│  │      [🗑 Remove]         │    │  📦 Est. 5-8 days   │
│  └──────────────────────────┘    │                      │
└──────────────────────────────────┴──────────────────────┘
```

#### CheckoutDrawer (modal/slide-over)

```
┌─────────────────────────────────────────────────────────┐
│  ✕  Checkout                                            │
├─────────────────────────────────────────────────────────┤
│  CUSTOMER INFORMATION                                   │
│  Full Name: [________________]                          │
│  Email:     [________________]                          │
│  Phone:     [________________]                          │
│                                                         │
│  DELIVERY ADDRESS                                       │
│  Address Line 1: [________________]                     │
│  Address Line 2: [________________]  (optional)         │
│  City:  [__________]  State: [__________]               │
│  Pincode: [______]                                      │
│                                                         │
│  PAYMENT METHOD                                         │
│  ○ Cash on Delivery (COD)                               │
│  ○ Online Payment                                       │
│                                                         │
│  ORDER TOTAL: ₹ 1,297                                   │
│                                                         │
│  [Place Order]                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 5.5 Blog Page (`/blog`)

**Route:** `/blog` | **File:** `src/app/(public)/blog/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  PAGE HEADER                                            │
│  Title: "Our Blog"                                      │
│  Description text                                       │
│                                                         │
│  [🔍 Search blogs...]  [Search]                         │
├─────────────────────────────────────────────────────────┤
│  BLOG GRID (3 cols desktop)                             │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ [Blog Image] │  │ [Blog Image] │  │ [Blog Image] │  │
│  │              │  │              │  │              │  │
│  │ Blog Title   │  │ Blog Title   │  │ Blog Title   │  │
│  │ Excerpt text │  │ Excerpt text │  │ Excerpt text │  │
│  │ (3 lines)    │  │ (3 lines)    │  │ (3 lines)    │  │
│  │ 📅 Jan 2026  │  │ 📅 Jan 2026  │  │ 📅 Jan 2026  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  PAGINATION                                             │
│  [← Previous]  Page 1 / 3  [Next →]                    │
└─────────────────────────────────────────────────────────┘
```

---

### 5.6 Blog Detail Page (`/blog/[slug]`)

**Route:** `/blog/[slug]`

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Blog                                         │
├─────────────────────────────────────────────────────────┤
│  [Full-width Blog Feature Image]                        │
│                                                         │
│  Blog Title (h1, large)                                 │
│  📅 Published: January 15, 2026                         │
│                                                         │
│  ─────────────────────────────────────────────          │
│                                                         │
│  [Rich HTML Content rendered as blog body]              │
│  (paragraphs, headings, images, lists, etc.)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 5.7 About Page (`/about`)

**Route:** `/about` | **File:** `src/app/(public)/about/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                           │
│  ┌─────────────────────┐  ┌───────────────────────┐    │
│  │  [Hero Image]       │  │  About Title (h1)     │    │
│  │                     │  │  Description text     │    │
│  └─────────────────────┘  └───────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  MISSION / VISION / VALUES (3-column grid)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 🎯 Mission   │  │ 👁 Vision    │  │ ⭐ Values    │  │
│  │ Title        │  │ Title        │  │ Title        │  │
│  │ Description  │  │ Description  │  │ Description  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  WHY WE EXIST (centered, max-w-3xl)                     │
│  Section Heading                                        │
│  Long description paragraph                             │
├─────────────────────────────────────────────────────────┤
│  FOCUS AREAS (3-column grid)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Area Title   │  │ Area Title   │  │ Area Title   │  │
│  │ Description  │  │ Description  │  │ Description  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  CORE TEAM (3-column grid)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  [Avatar]    │  │  [Avatar]    │  │  [Avatar]    │  │
│  │  Name        │  │  Name        │  │  Name        │  │
│  │  Role        │  │  Role        │  │  Role        │  │
│  │  Description │  │  Description │  │  Description │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  CTA SECTION                                            │
│  CTA Title                                              │
│  CTA Description                                        │
│  [CTA Button]                                           │
└─────────────────────────────────────────────────────────┘
```

**Data from About model:** hero, mission, vision, values, whyWeExist, focusAreas[], coreTeam[], cta

---

### 5.8 Stories Page (`/stories`)

**Route:** `/stories` | **File:** `src/app/(public)/stories/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  PAGE HEADER                                            │
│  Title: "Stories of Change"                             │
│  Description                                            │
├─────────────────────────────────────────────────────────┤
│  STORIES GRID (3 cols desktop, 2 tablet)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ [Story Img]  │  │ [Story Img]  │  │ [Story Img]  │  │
│  │ Story Title  │  │ Story Title  │  │ Story Title  │  │
│  │ Excerpt...   │  │ Excerpt...   │  │ Excerpt...   │  │
│  │ Read Full →  │  │ Read Full →  │  │ Read Full →  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  CTA: "Share Your Story"                                │
│  [Submit Your Story]                                    │
└─────────────────────────────────────────────────────────┘
```

---

### 5.9 Story Detail Page (`/stories/[slug]`)

Similar layout to Blog Detail — full-width image, title, rich HTML content.

Also includes SEO meta fields: metaTitle, metaDescription, metaKeywords.

---

### 5.10 Services Page (`/services`)

**Route:** `/services` | **File:** `src/app/(public)/services/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  PAGE HEADER                                            │
│  Title: "Our Services & Initiatives"                    │
│  Description                                            │
├─────────────────────────────────────────────────────────┤
│  SERVICES GRID (3 cols)                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  [Icon/Img]  │  │  [Icon/Img]  │  │  [Icon/Img]  │  │
│  │  Title       │  │  Title       │  │  Title       │  │
│  │  Description │  │  Description │  │  Description │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  CTA: "Want to Support Our Work?"                       │
│  [Get in Touch]                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 5.11 Contact Page (`/contact`)

**Route:** `/contact` | **File:** `src/app/(public)/contact/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  PAGE HEADER                                            │
│  Title: "Get in Touch"                                  │
│  Description                                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │  CONTACT INFO           │  │  CONTACT FORM       │  │
│  │                         │  │                     │  │
│  │  📍 Address (3 offices) │  │  Name: [________]   │  │
│  │  📧 Email               │  │  Email:[________]   │  │
│  │  📞 Phone               │  │  Phone:[________]   │  │
│  │  🕐 Working Hours       │  │  Message:           │  │
│  │                         │  │  [______________]   │  │
│  │                         │  │  [______________]   │  │
│  │                         │  │                     │  │
│  │                         │  │  [Send Message]     │  │
│  └─────────────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### 5.12 Distributors Page (`/distributors`)

**Route:** `/distributors` | **File:** `src/app/(public)/distributors/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  BANNER IMAGE (full width, from DistributorsPage model) │
├─────────────────────────────────────────────────────────┤
│  BENEFITS SECTION                                        │
│  Title: "Why Become a Distributor?"                     │
│  ✓ Benefit 1                                            │
│  ✓ Benefit 2                                            │
│  ✓ Benefit 3  ...                                       │
├─────────────────────────────────────────────────────────┤
│  REQUIREMENTS SECTION                                   │
│  Title: "Requirements"                                  │
│  • Requirement 1                                        │
│  • Requirement 2  ...                                   │
├─────────────────────────────────────────────────────────┤
│  APPLICATION FORM (DistributorsForm)                    │
│  Name:    [________________]                            │
│  Email:   [________________]                            │
│  Phone:   [________________]                            │
│  Website: [________________]  (optional)                │
│  Logo/Image: [Upload Image]                             │
│  [Submit Application]                                   │
└─────────────────────────────────────────────────────────┘
```

---

### 5.13 Careers Page (`/careers`)

**Route:** `/careers` | **File:** `src/app/(public)/careers/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  BANNER IMAGE (from CareersPage model)                  │
├─────────────────────────────────────────────────────────┤
│  JOB LISTINGS                                           │
│  ┌────────────────────────────────────────┐             │
│  │  Job Title         📍 Location         │             │
│  │  Type: Full-time   💰 Salary           │             │
│  │  Description text                      │             │
│  │  [Apply for this Position]             │             │
│  └────────────────────────────────────────┘             │
│  ┌────────────────────────────────────────┐             │
│  │  Job Title ...                         │             │
│  └────────────────────────────────────────┘             │
├─────────────────────────────────────────────────────────┤
│  APPLICATION FORM (CareersForm)                         │
│  Name:      [________________]                          │
│  Email:     [________________]                          │
│  Phone:     [________________]                          │
│  Position:  [________________]                          │
│  Resume:    [Upload PDF/Doc]                            │
│  Message:   [________________]                          │
│             [Submit Application]                        │
└─────────────────────────────────────────────────────────┘
```

---

### 5.14 Resources Page (`/resources`)

**Route:** `/resources` | **File:** `src/app/(public)/resources/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  BANNER IMAGE                                           │
├─────────────────────────────────────────────────────────┤
│  DOCUMENTS LIST                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  📄 Document Title                               │  │
│  │     Type: PDF    Description text                │  │
│  │     [Download] / [View]                          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  📄 Document Title ...                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### 5.15 Login Page (`/login`)

**Route:** `/login` | **File:** `src/app/(public)/login/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  [Centered card, max-w-md]                              │
│                                                         │
│  [Logo]                                                 │
│  Welcome Back                                           │
│  Sign in to your account                               │
│                                                         │
│  Email:    [____________________________]               │
│  Password: [____________________________]               │
│                                                         │
│  [Sign In]                                              │
│                                                         │
│  Don't have an account? [Sign Up]                       │
└─────────────────────────────────────────────────────────┘
```

---

### 5.16 Signup Page (`/signup`)

**Route:** `/signup`

```
┌─────────────────────────────────────────────────────────┐
│  [Centered card, max-w-md]                              │
│                                                         │
│  Create Account                                         │
│                                                         │
│  Full Name: [________________________]                  │
│  Email:     [________________________]                  │
│  Phone:     [________________________]                  │
│  Password:  [________________________]                  │
│                                                         │
│  [Create Account]                                       │
│                                                         │
│  Already have an account? [Login]                       │
└─────────────────────────────────────────────────────────┘
```

---

### 5.17 Order Success Page (`/order-success/[orderId]`)

```
┌─────────────────────────────────────────────────────────┐
│                  ✅  (large check icon)                  │
│                                                         │
│           Order Placed Successfully!                    │
│           Order #: MPBB-20260115-0042                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Order Summary                                   │  │
│  │  Item 1 × 2          ₹598                        │  │
│  │  Item 2 × 1          ₹399                        │  │
│  │  ──────────────────────────                      │  │
│  │  Total               ₹997                        │  │
│  │  Payment:            Cash on Delivery            │  │
│  │  Estimated Delivery: 23 Jan 2026                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Continue Shopping]  [View Order Details]              │
└─────────────────────────────────────────────────────────┘
```

---

### 5.18 Privacy Policy & Terms Pages

Simple text-heavy pages:

```
┌─────────────────────────────────────────────────────────┐
│  Page Title (h1)                                        │
│  Last Updated: [date]                                   │
│  ─────────────────────────────────────────────────────  │
│  Section 1 Heading                                      │
│  Paragraph text...                                      │
│                                                         │
│  Section 2 Heading                                      │
│  Paragraph text...                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Admin Pages — Detailed UI Breakdown

### 6.1 Admin Login (`/admin-login`)

```
┌─────────────────────────────────────────────────────────┐
│  [Dark themed, centered card]                           │
│                                                         │
│  🔐 Admin Panel                                         │
│  Mera Pind Balle Balle                                  │
│                                                         │
│  Email:    [____________________________]               │
│  Password: [____________________________]               │
│                                                         │
│  [Sign In to Admin Panel]                               │
└─────────────────────────────────────────────────────────┘
```

---

### 6.2 Admin Dashboard Layout

**File:** `src/app/(admin)/admin/dashboard/layout.tsx`

```
┌──────────────────┬──────────────────────────────────────┐
│  SIDEBAR         │  MAIN CONTENT AREA                   │
│  (fixed, w-64)   │                                      │
│                  │  TOP BAR                             │
│  [Logo]          │  Admin Panel | [AdminLogoutButton]   │
│  Mera Pind       │  ─────────────────────────────────── │
│                  │                                      │
│  Navigation:     │  [Page content renders here]         │
│  ▸ Dashboard     │                                      │
│  ▸ Home          │                                      │
│  ▸ Products      │                                      │
│  ▸ Blogs         │                                      │
│  ▸ Stories       │                                      │
│  ▸ Services      │                                      │
│  ▸ Resources     │                                      │
│  ▸ About         │                                      │
│  ▸ Contact       │                                      │
│  ▸ Careers       │                                      │
│  ▸ Distributors  │                                      │
│  ▸ Orders        │                                      │
│                  │                                      │
│  [Logout]        │                                      │
└──────────────────┴──────────────────────────────────────┘
```

---

### 6.2 Admin Dashboard Home (`/admin/dashboard`)

```
┌─────────────────────────────────────────────────────────┐
│  STATS CARDS (grid)                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Total   │  │  Total   │  │  Total   │  │ Total  │  │
│  │ Products │  │  Orders  │  │  Blogs   │  │Stories │  │
│  │   42     │  │   127    │  │   18     │  │   9    │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
├─────────────────────────────────────────────────────────┤
│  RECENT ORDERS (table)                                  │
│  Order #  |  Customer  |  Total  |  Status  |  Date    │
│  ─────────────────────────────────────────────────────  │
│  MPBB-... │  Gurpreet  │ ₹ 599  │ PLACED   │ Today    │
│  ...                                                    │
└─────────────────────────────────────────────────────────┘
```

---

### 6.3 Home Section Manager (`/admin/dashboard/home`)

Form for editing the homepage Dashboard content:

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                           │
│  Title:         [____________________________]          │
│  Subtitle:      [____________________________]          │
│  Hero Image:    [Upload/Cloudinary]                     │
│  Primary CTA:   Label [______] Link [______]            │
│  Secondary CTA: Label [______] Link [______]            │
├─────────────────────────────────────────────────────────┤
│  INITIATIVES (add/remove items)                         │
│  [+ Add Initiative]                                     │
│  Item: Title [_______] Desc [_____________]  [✗]       │
├─────────────────────────────────────────────────────────┤
│  IMPACT NUMBERS                                         │
│  [+ Add Impact Item]                                    │
│  Label [_______] Value [_______]  [✗]                  │
├─────────────────────────────────────────────────────────┤
│  TESTIMONIALS                                           │
│  [+ Add Testimonial]                                    │
│  Name [____] Role [____] Quote [___________]  [✗]      │
├─────────────────────────────────────────────────────────┤
│  STORY SECTION                                          │
│  Title [______] Description [______] Image [Upload]     │
│  Link [______]                                          │
├─────────────────────────────────────────────────────────┤
│  CTA SECTION                                            │
│  Title [______] Desc [______] Button [_____] Link [___] │
├─────────────────────────────────────────────────────────┤
│  FOOTER LINKS                                           │
│  Support Links / Quick Links / Legal Links / Social     │
├─────────────────────────────────────────────────────────┤
│  [Save Changes]                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 6.4 Products Manager (`/admin/dashboard/products`)

```
┌─────────────────────────────────────────────────────────┐
│  Products  [+ Add New Product]                          │
├─────────────────────────────────────────────────────────┤
│  TABLE:                                                 │
│  Image | Name | Category | Price | Stock | Active | Act │
│  ──────────────────────────────────────────────────     │
│  [img]   Atta  Flour      ₹299    50      ✓      [✎][✗] │
│  [img]   Ghee  Dairy      ₹599    12      ✓      [✎][✗] │
└─────────────────────────────────────────────────────────┘
```

**Add/Edit Product Modal/Form:**
```
Name:        [____________________________]
Description: [____________________________]
             [____________________________] (textarea)
Price:       [________]  (number)
Category:    [________]  (text)
Stock:       [________]  (number)
Image:       [Upload to Cloudinary]
Featured:    [☐] Mark as Featured
Active:      [☑] Is Active
[Save Product]
```

---

### 6.5 Blogs Manager (`/admin/dashboard/blogs`)

```
┌─────────────────────────────────────────────────────────┐
│  Blogs  [+ New Blog Post]                               │
├─────────────────────────────────────────────────────────┤
│  Title          | Date      | Published | Actions       │
│  ───────────────────────────────────────────────────    │
│  Our Journey... │ 15 Jan 26 │ ✓         │ [✎] [✗]      │
└─────────────────────────────────────────────────────────┘
```

**Blog Form (rich text editor):**
```
Title:     [____________________________]
Slug:      [____________________________]  (auto-generated)
Excerpt:   [____________________________]
Date:      [Date Picker]
Image:     [Upload Cover Image]
Published: [☑] Publish immediately

Content: [React Quill Rich Text Editor]
         ┌───────────────────────────────┐
         │ B  I  U  | H1 H2 | 🔗 | img  │
         │ ─────────────────────────────  │
         │  Rich text content here...    │
         └───────────────────────────────┘

[Save Draft]  [Publish]
```

---

### 6.6 Stories Manager (`/admin/dashboard/stories`)

Similar to Blogs Manager but with extra SEO fields:

```
Title:          [____________________________]
Slug:           [____________________________]
Excerpt:        [____________________________]
Image:          [Upload Image]
Meta Title:     [____________________________]
Meta Desc:      [____________________________]
Meta Keywords:  [____________________________]
Published:      [☑]

Content: [React Quill Rich Text Editor]

[Save]
```

---

### 6.7 Services Manager (`/admin/dashboard/services`)

```
┌─────────────────────────────────────────────────────────┐
│  Services/Initiatives  [+ Add Service]                  │
├─────────────────────────────────────────────────────────┤
│  Icon | Title         | Active | Actions                │
│  ────────────────────────────────────────────           │
│  🌾   Women Training   ✓       [✎] [✗]                  │
└─────────────────────────────────────────────────────────┘
```

---

### 6.8 Resources Manager (`/admin/dashboard/resources`)

```
Banner Image: [Upload Image]

Documents: [+ Add Document]
┌────────────────────────────────────────┐
│ Title [____] Type [____] Link [______] │
│ Desc  [________________________]  [✗]  │
└────────────────────────────────────────┘

[Save]
```

---

### 6.9 About Manager (`/admin/dashboard/about`)

Large multi-section form covering all About model fields:

- Hero (title, description, image upload)
- Mission / Vision / Values (title + description each)
- Why We Exist (description)
- Focus Areas (dynamic list)
- Core Team (dynamic list with image per member)
- CTA (title, description, button text)

---

### 6.10 Contact Leads Manager (`/admin/dashboard/contact`)

```
┌─────────────────────────────────────────────────────────┐
│  Contact Submissions                                    │
├─────────────────────────────────────────────────────────┤
│  Name      | Email          | Phone | Message | Del     │
│  ─────────────────────────────────────────────────────  │
│  Gurpreet  │ g@example.com  │ 9876  │ Hello.. │ [✗]    │
└─────────────────────────────────────────────────────────┘
```

---

### 6.11 Careers Manager (`/admin/dashboard/careers`)

```
Banner Image: [Upload Image]

Jobs: [+ Add Job]
┌──────────────────────────────────────────────┐
│ Title [_____] Location [____] Type [_______] │
│ Salary [_____] Image [Upload]                │
│ Description [________________________________]│
│                                          [✗] │
└──────────────────────────────────────────────┘

Applications Received:
Name | Email | Phone | Position | Resume | Date
```

---

### 6.12 Distributors Manager (`/admin/dashboard/distributors`)

**Page Manager tab:**
```
Banner Image: [Upload]
Benefits:   [+ Add] [Benefit text...]  [✗]
Requirements: [+ Add] [Requirement...]  [✗]
[Save]
```

**Distributor Listings tab:**
```
Name | Email | Phone | Website | Active | Actions
[img] Balvir  b@... 98765  balvir.in  ✓  [✎][✗]
```

---

### 6.13 Orders Manager (`/admin/dashboard/orders`)

```
┌─────────────────────────────────────────────────────────┐
│  Orders  [Export to Excel]                              │
│  Filter: [All] [PLACED] [CONFIRMED] [SHIPPED] [...]     │
├─────────────────────────────────────────────────────────┤
│  #      | Customer | Total  | Payment | Status | Act    │
│  ─────────────────────────────────────────────────────  │
│  MPBB.. │ Gurpreet │ ₹ 897 │ COD     │ PLACED │ [View] │
└─────────────────────────────────────────────────────────┘
```

**Order Detail / Update:**
```
Order #: MPBB-20260115-0042
Customer: Gurpreet Singh
Items: [list]
Total: ₹ 897

Update Status: [Dropdown: PLACED/CONFIRMED/PROCESSING/SHIPPED/DELIVERED/CANCELLED]
Notes: [textarea]
[Update Order]
```

---

## 7. Components Reference

### 7.1 Common Components

#### Navbar (`src/components/common/Navbar.tsx`)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Mera Pind BB  Home About Services Products Blog  │
│                       Stories Contact    🛒(2) 👤 🌙    │
└─────────────────────────────────────────────────────────┘
```

- Sticky positioned with backdrop blur
- Active link shows underline animation
- Cart icon shows badge with item count (from CartContext)
- Dark mode toggle switches between ☀️ and 🌙
- Mobile: collapses to hamburger menu (≡)
- Mobile menu: full-screen or slide-down panel

#### Footer (`src/components/common/Footer.tsx`)

```
┌──────────────────┬──────────┬──────────┬───────────────┐
│ [Logo]           │ Support  │ Quick    │ Legal         │
│ Brand Name       │ ─────    │ Links    │ ─────         │
│ Description      │ Link 1   │ ──────   │ Privacy       │
│                  │ Link 2   │ Link 1   │ Terms         │
│                  │ Link 3   │ Link 2   │               │
│                  │          │          │ [FB][IG][TW]  │
├──────────────────┴──────────┴──────────┴───────────────┤
│  © 2026 Mera Pind Balle Balle. All rights reserved.   │
└─────────────────────────────────────────────────────────┘
```

4-column grid, collapses to 2 on tablet, 1 on mobile.
Links populated dynamically from Dashboard model footer data.

---

### 7.2 Home Feature Components

| Component | Description |
|---|---|
| `HeroSection` | Full-viewport parallax hero, text reveal, dual CTAs |
| `ScrollStorySection` | Horizontally scrollable initiative cards |
| `CategoryGrid` | 4-column product category grid with links |
| `ProductSpotlight` | 2-column featured product showcase |
| `TrustSection` | Impact metrics grid with count-up animation |
| `TestimonialsSection` | Testimonial card grid with quotes |
| `ClosingCTA` | Full-width CTA banner with button |

---

### 7.3 Product Components

#### ProductCard (`src/components/features/products/ProductCard.tsx`)

```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │  Product Image  │ │  ← hover: scale(1.05), transition 300ms
│ │  (aspect-4/3)   │ │
│ └─────────────────┘ │
│                     │
│ Product Name        │  ← font-semibold, truncate 1 line
│ Description text... │  ← text-muted, 2 line clamp
│                     │
│ ₹ 299.00            │  ← text-primary, font-bold, text-xl
│                     │
│ [Add to Cart]       │  ← variant="outline", full width
│ [Buy Now]           │  ← variant="default", full width
└─────────────────────┘
```

#### ProductActions (`src/components/features/products/ProductActions.tsx`)

- Quantity selector with − and + buttons
- Current quantity display
- "Add to Cart" → adds to CartContext
- "Buy Now" → adds to cart + navigates to `/cart`

#### FeaturedProductsScroll

- Horizontal scrollable row
- Uses `overflow-x-auto` with `scroll-snap-x`
- Shows 4 cards visible on desktop, 1.5 on mobile

#### RelatedProducts

- Fetches products with same category
- Renders up to 4 ProductCards in a grid

---

### 7.4 Cart Components

#### CartPageClient (`src/components/features/cart/CartPageClient.tsx`)

Full cart UI (see Section 5.4 above). Key interactions:
- `+` / `−` buttons call `updateQuantity()` from CartContext
- Trash icon calls `removeFromCart()` from CartContext
- AnimatePresence wraps list for smooth remove animations
- "Proceed to Checkout" opens CheckoutDrawer

#### CheckoutDrawer (`src/components/features/cart/CheckoutDrawer.tsx`)

- Slide-over drawer from right (or centered modal)
- Zod-validated form with React Hook Form
- On submit → POST `/api/orders/create`
- On success → redirect to `/order-success/[orderId]`

---

### 7.5 Motion & Animation Components

| Component | File | Effect |
|---|---|---|
| `ScrollReveal` | `motion/ScrollReveal.tsx` | Fade-in + slide-up when element enters viewport |
| `TextReveal` | `motion/TextReveal.tsx` | Character/word by word text animation |
| `ParallaxImage` | `motion/ParallaxImage.tsx` | Image moves at different speed than scroll |
| `StaggerContainer` | `motion/StaggerContainer.tsx` | Children animate in staggered sequence |
| `TiltCard` | `motion/TiltCard.tsx` | 3D card tilt on mouse hover |

All powered by **Framer Motion (motion v12)** with `useInView`, `useScroll`, `useTransform`.

---

### 7.6 Layout Components

| Component | Purpose |
|---|---|
| `PageContainer` | Applies `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| `PageTransition` | Wraps page content with fade animation on route change |
| `LayoutWrapper` | Combines Navbar + PageTransition + Footer for public pages |

---

### 7.7 UI Primitives (Shadcn)

Located in `src/components/ui/`:

| Component | Used for |
|---|---|
| `Button` | All buttons (variants: default, outline, ghost, destructive) |
| `Card`, `CardHeader`, `CardContent`, `CardFooter` | Card wrappers |
| `Input` | Text inputs |
| `Label` | Form labels |
| `Textarea` | Multi-line text inputs |
| `Dialog`, `DialogContent` | Modal dialogs |
| `Badge` | Tag/status badges |
| `Sonner` | Toast notifications (success/error/info) |
| `ToggleBtn` | Toggle switch |

---

## 8. API Routes Reference

### Public API Routes

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/home` | GET | None | Homepage dashboard data |
| `/api/dashboard` | GET | None | Same as above (alias) |
| `/api/products` | GET | None | All active products |
| `/api/products?category=X` | GET | None | Filtered by category |
| `/api/blogs` | GET | None | Paginated published blogs |
| `/api/blogs?search=X` | GET | None | Search blogs by text |
| `/api/blogs?page=2&limit=9` | GET | None | Paginated blogs |
| `/api/blogs/[slug]` | GET | None | Single blog by slug |
| `/api/stories` | GET | None | All published stories |
| `/api/stories/[slug]` | GET | None | Single story by slug |
| `/api/services` | GET | None | All active services |
| `/api/services/[id]` | GET | None | Single service |
| `/api/about` | GET | None | About page content |
| `/api/distributors` | GET | None | Active distributors |
| `/api/distributorPage` | GET | None | Distributor page info |
| `/api/initiatives` | GET | None | All initiatives |
| `/api/resources` | GET | None | Resources with documents |
| `/api/careers` | GET | None | Career applications |
| `/api/contact` | POST | None | Submit contact form |
| `/api/distributors` | POST | None | Submit distributor application |
| `/api/orders/create` | POST | User JWT | Create new order |
| `/api/orders/[id]` | GET | User JWT | Get order details |
| `/api/upload` | POST | None | Upload image to Cloudinary |

### Admin API Routes (all require Admin JWT)

| Endpoint | Methods | Description |
|---|---|---|
| `/api/admin/dashboard` | POST | Update dashboard/homepage |
| `/api/admin/products` | GET, POST | List all, create product |
| `/api/admin/products/[id]` | PUT, DELETE | Update, delete product |
| `/api/admin/blogs` | GET, POST | List all, create blog |
| `/api/admin/blogs/[id]` | PUT, DELETE | Update, delete blog |
| `/api/admin/stories` | GET, POST | List all, create story |
| `/api/admin/stories/[id]` | PUT, DELETE | Update, delete story |
| `/api/admin/services` | POST | Create service |
| `/api/admin/about` | POST | Update about content |
| `/api/admin/contact-leads` | GET | List contact submissions |
| `/api/admin/contact-leads/[id]` | DELETE | Delete contact lead |
| `/api/admin/careers` | GET, POST | List, create career posts |
| `/api/admin/careers/[id]` | PUT, DELETE | Update, delete career |
| `/api/admin/distributors` | GET, POST | List, create distributor |
| `/api/admin/distributors/[id]` | PUT, DELETE | Update, delete distributor |
| `/api/admin/distributors-page` | POST | Update distributor page |
| `/api/admin/resources` | GET, POST | List, create resources |
| `/api/admin/resources/[id]` | PUT, DELETE | Update, delete resource |
| `/api/admin/orders` | GET | List all orders |
| `/api/admin/orders/[id]` | GET, PUT | Get, update order status |
| `/api/admin/home` | POST | Update hero section |

### Auth Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login (sets httpOnly cookie) |
| `/api/auth/me` | GET | Get logged-in user info |
| `/api/auth/user-logout` | POST | User logout (clears cookie) |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler (admin) |
| `/api/auth/logout` | POST | Admin logout |

---

## 9. Database Models (MongoDB Schemas)

### User

```typescript
{
  name: String           // required, trimmed
  email: String          // required, unique, indexed, lowercase
  password: String       // required, bcrypt hashed
  phone: String          // required
  address: {
    line1: String
    line2: String
    city: String
    state: String
    pincode: String
  }
  timestamps: true
}
```

### AdminUser

```typescript
{
  name: String           // required
  email: String          // required, unique, indexed
  password: String       // required, bcrypt hashed
  role: "admin"|"editor" // default: "admin"
  isActive: Boolean      // default: true
  timestamps: true
}
```

### Product

```typescript
{
  name: String           // required, indexed
  description: String    // required
  price: Number          // required
  image: String          // Cloudinary URL
  imageId: String        // Cloudinary public_id (for deletion)
  category: String       // indexed
  stock: Number          // default: 0
  isActive: Boolean      // default: true, indexed
  isFeatured: Boolean    // default: false, indexed
  timestamps: true
}
```

### Order

```typescript
{
  userId: ObjectId       // ref: User, indexed
  orderNumber: String    // unique, e.g. "MPBB-20260115-0042"
  customer: {
    name, email, phone, address: { line1, line2, city, state, pincode }
  }
  items: [{
    productId: ObjectId  // ref: Product
    name, price, quantity, image: String
  }]
  subtotal: Number
  deliveryCharge: Number // default: 0
  total: Number
  paymentMethod: "COD"|"ONLINE"
  paymentStatus: "PENDING"|"PAID"|"FAILED"|"REFUNDED"
  razorpayOrderId: String
  razorpayPaymentId: String
  razorpaySignature: String
  status: "PLACED"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED"
  estimatedDelivery: Date  // auto: now + 8 days
  deliveredAt: Date
  notes: String
  timestamps: true
}
```

### Blog

```typescript
{
  slug: String           // unique, indexed, lowercase
  title: String          // required, indexed
  excerpt: String        // required
  image: String          // cover image URL
  content: String        // rich HTML content
  date: Date             // required, indexed
  isPublished: Boolean   // default: true, indexed
  timestamps: true
}
```

### Story

```typescript
{
  slug: String           // unique, indexed
  title: String          // required
  excerpt: String        // required
  image: String          // required
  content: String        // rich HTML content
  metaTitle: String
  metaDescription: String
  metaKeywords: [String]
  isPublished: Boolean   // default: true
  timestamps: true
}
```

### Service

```typescript
{
  title: String          // required
  description: String    // required
  icon: String           // icon name or image URL
  isActive: Boolean      // default: true
  timestamps: true
}
```

### About

```typescript
{
  hero: { title, description, image }
  mission: { title, description }
  vision: { title, description }
  values: { title, description }
  whyWeExist: { description }
  focusAreas: [{ title, description }]
  coreTeam: [{ name, role, description, image }]
  cta: { title, description, buttonText }
  isActive: Boolean
  timestamps: true
}
```

### Dashboard (Homepage CMS)

```typescript
{
  hero: {
    title, subtitle, image,
    primaryCTA: { label, link },
    secondaryCTA: { label, link }
  }
  initiatives: [{ title, description }]
  popularProducts: [{ title, description, image }]
  impact: [{ label, value }]
  cta: { title, description, buttonText, link }
  testimonials: [{ name, role, quote, avatar }]
  storySection: { title, description, image, link }
  footer: {
    supportLinks: [{ label, link }]
    quickLinks: [{ label, link }]
    legalLinks: [{ label, link }]
    socialLinks: [{ platform, link }]
  }
  isActive: Boolean
  updatedBy: String
  timestamps: true
}
```

### Contact (Form Submissions)

```typescript
{
  name: String           // required
  email: String          // required, indexed
  phone: String
  message: String        // required
  isResolved: Boolean    // default: false, indexed
  timestamps: true
}
```

### Distributor

```typescript
{
  name: String           // required, min 3 chars
  email: String          // required, unique, regex validated
  phone: String          // required
  website: String        // optional
  image: String          // Cloudinary URL
  publicId: String       // Cloudinary public_id
  isActive: Boolean      // default: true
  timestamps: true
}
```

### DistributorsPage

```typescript
{
  bannerImage: String    // required, Cloudinary URL
  benefits: [String]
  requirements: [String]
  isActive: Boolean
  timestamps: true
}
```

### CareersPage

```typescript
{
  bannerImage: String
  jobs: [{
    title, location, type, description, salary, image
  }]
  isActive: Boolean
  timestamps: true
}
```

### CareerApplication

```typescript
{
  name, email, phone, position: String
  resumeUrl: String      // Cloudinary URL
  message: String
  timestamps: true
}
```

### Resource

```typescript
{
  bannerImage: String
  documents: [{
    title, type, link, description: String
  }]
  isActive: Boolean
  timestamps: true
}
```

### Initiative

```typescript
{
  title: String
  description: String
  icon: String
  timestamps: true
}
```

---

## 10. Authentication System

### Two Authentication Systems

#### 1. Admin Authentication (NextAuth v5)

- **Provider:** Credentials (email + password)
- **Session:** JWT stored in httpOnly cookie
- **Session duration:** 1 hour (with activity timeout reset)
- **Routes protected:** All `/admin/dashboard/*` pages
- **Middleware:** checks for admin session cookie on admin routes
- **Files:** `auth.ts`, `auth.config.ts`, `src/lib/auth/options.ts`
- **Logout:** `AdminLogoutButton` component calls `/api/auth/logout`

#### 2. User Authentication (Custom JWT)

- **Provider:** Custom register/login API routes
- **Token:** JWT stored in httpOnly cookie (`user_token`)
- **Protected:** Order creation (`/api/orders/create`)
- **Files:** `src/lib/auth/user-jwt.ts`, `src/lib/auth/hash.ts`
- **Context:** `UserAuthContext` provides `user`, `login()`, `logout()`
- **Auto-logout:** `useActivityTimeout` hook — logs out after inactivity

### Route Protection (Middleware)

`src/middleware.ts` protects:
- `/admin/dashboard/*` → requires admin session
- `/admin-login` → redirects to dashboard if already logged in

---

## 11. Context / State Management

### CartContext (`src/context/CartContext.tsx`)

```typescript
interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addToCart(item: CartItem): void
  removeFromCart(productId: string): void
  updateQuantity(productId: string, quantity: number): void
  clearCart(): void
  totalItems: number
  totalPrice: number
}
```

- Persisted to `localStorage` on every change
- Re-hydrated on app mount
- Provided at root layout level

### UserAuthContext (`src/context/UserAuthContext.tsx`)

```typescript
interface UserAuthContextType {
  user: { name: string, email: string, phone: string } | null
  loading: boolean
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  register(data: RegisterData): Promise<void>
}
```

- Fetches `/api/auth/me` on mount to restore session
- Cookie-based, no localStorage

---

## 12. Key Features Summary

| Feature | Implementation |
|---|---|
| Server-side rendering | Next.js RSC for all public pages |
| SEO optimization | `generateMetadata()` on all pages, sitemap.ts, robots.ts |
| Dark mode | `next-themes` with CSS variables |
| Animations | Framer Motion — parallax, scroll reveal, text reveal, tilt |
| Image optimization | Next.js `<Image>` + Cloudinary transformations |
| Rich text editing | React Quill New (WYSIWYG) in admin |
| Form validation | React Hook Form + Zod schemas |
| Toast notifications | Sonner (success/error/info toasts) |
| Cart persistence | localStorage via CartContext |
| Order management | Full CRUD + status tracking + Excel export |
| Admin CMS | Full content management for every page |
| Pagination | Blog list paginated (9 per page) |
| Search | Blog search by title |
| File uploads | Cloudinary with delete support |
| Two auth systems | NextAuth (admin) + Custom JWT (users) |
| Activity timeout | Auto-logout after inactivity |
| Sitemap | Auto-generated from DB content |
| Excel export | Orders export via `xlsx` library |

---

## 13. Environment Variables

Create a `.env.local` file in the project root:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mera-pind

# NextAuth (Admin Auth)
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# JWT (User Auth)
JWT_SECRET=your-jwt-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin credentials (seeded on first run)
ADMIN_EMAIL=admin@meraipind.com
ADMIN_PASSWORD=your-secure-admin-password
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin-login](http://localhost:3000/admin-login) for the admin panel.

---

*Documentation last updated: February 2026*
