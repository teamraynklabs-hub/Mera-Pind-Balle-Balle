# Frontend Architecture

## Overview

The frontend is built on **Next.js 16** (App Router) with **React 19** and **TypeScript 5**. It follows a modular, feature-based architecture with clear separation between public-facing pages and the admin dashboard.

## Core Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 (App Router) | Server components, file-based routing, built-in optimization |
| Styling | Tailwind CSS v4 + CSS Variables | Utility-first, dark mode via OKLch color space |
| UI Components | Shadcn/ui (custom) | Accessible, composable, Radix UI primitives |
| State | React Context API | Lightweight, no external state library overhead |
| Forms | react-hook-form + Zod | Performant, schema-validated forms |
| Animations | Motion (Framer Motion fork) | Declarative animations, scroll-driven effects |
| HTTP Client | Axios + fetch | Axios for client components, fetch for server components |
| Icons | lucide-react | Tree-shakeable, consistent icon set |
| Toast | Sonner | Lightweight, accessible notifications |

## Rendering Strategy

```
Server Components (default)
  ├── Data fetching at build/request time
  ├── No client JS bundle cost
  └── Used for: Page shells, SEO content, layouts

Client Components ("use client")
  ├── Interactive UI (forms, modals, carousels)
  ├── Browser APIs (localStorage, window)
  └── Used for: Feature components, providers, form handlers
```

### Static vs Dynamic

- **Static (SSG)**: Home, Blog listing, Stories listing, Resources, Cart, Login, Signup
- **Dynamic (SSR)**: Blog/[slug], Stories/[slug], Product/[id], About, Contact, Careers, Distributors, Products
- **Client-side polling**: HomePageContent (120s interval for fresh data)

## Component Hierarchy

```
RootLayout (providers: Auth, Theme, Cart, UserAuth)
├── (public)/layout.tsx (Navbar + Footer + LayoutWrapper)
│   ├── page.tsx → HomePageContent (client, polling)
│   ├── products/ → ProductsPageClient
│   ├── product/[id]/ → ProductActions, ProductImageGallery, ProductTabs
│   ├── blog/ → BlogPageClient → BlogHero, BlogFeatured, BlogGrid
│   ├── about/ → AboutPageClient → AboutHero, AboutMission, AboutVision...
│   ├── contact/ → ContactPageClient (react-hook-form + Zod)
│   ├── distributors/ → DistributorsPageClient (react-hook-form + Zod)
│   ├── careers/ → CareersForm, CareersHero, CareersOpenPositions
│   ├── cart/ → CartPageClient → CheckoutDrawer
│   ├── login/ → LoginForm (react-hook-form + Zod)
│   └── signup/ → SignupForm (react-hook-form + Zod)
│
└── (admin)/layout.tsx (Session guard + Admin header)
    ├── admin-login/ → Admin login page
    └── admin/dashboard/ → Admin CRUD pages (15 modules)
```

## Provider Stack

Providers wrap the entire application in `RootLayout`:

```tsx
<AuthSessionProvider>        // NextAuth session (admin)
  <ThemeProvider>             // next-themes (dark/light)
    <UserAuthProvider>        // Custom JWT auth (users)
      <CartProvider>          // Shopping cart state
        {children}
      </CartProvider>
    </UserAuthProvider>
  </ThemeProvider>
</AuthSessionProvider>
```

## Design System

### Color System (OKLch)

Colors are defined as CSS custom properties using the OKLch color space for perceptually uniform light/dark themes:

- `--background` / `--foreground` — Base surface and text
- `--primary` / `--primary-foreground` — Brand accent (gold tone)
- `--muted` / `--muted-foreground` — Subdued surfaces
- `--destructive` — Error states
- `--border`, `--ring`, `--input` — Form and border tokens

### Shadow System

Custom shadow scale: `--shadow-soft`, `--shadow-medium`, `--shadow-lg`, `--shadow-deep`, `--shadow-xl`, `--shadow-2xl`

### Animation System

CSS keyframes: `fadeUp`, `fadeIn`, `shake`, `slideUp`, `slideDown`, `scaleIn`, `shimmer`

Motion components: `ScrollReveal`, `StaggerContainer`, `TextReveal`, `ParallaxImage`

## Error Boundaries

- `src/app/(public)/error.tsx` — Public route error boundary with retry
- `src/app/(public)/loading.tsx` — Skeleton loading for public routes
- `src/app/not-found.tsx` — Custom 404 page

## Key Patterns

1. **Feature-based organization**: Components grouped by feature under `src/components/features/`
2. **Page-level client components**: Thin server page → fat client component pattern
3. **Normalized data**: `normalize*.ts` helpers transform API responses to UI shapes
4. **Optimistic image loading**: `next/image` with fill + sizes for responsive images
5. **Form pattern**: `useForm` + `zodResolver` + `register()` + inline error display
