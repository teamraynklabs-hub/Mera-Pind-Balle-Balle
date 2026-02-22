# Frontend Folder Structure

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (providers, metadata)
│   ├── not-found.tsx                 # Global 404 page
│   ├── robots.ts                     # SEO robots.txt generator
│   ├── sitemap.ts                    # SEO sitemap generator
│   │
│   ├── (public)/                     # Public route group
│   │   ├── layout.tsx                # Public layout (Navbar + Footer)
│   │   ├── loading.tsx               # Skeleton loading state
│   │   ├── error.tsx                 # Error boundary with retry
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx            # About page
│   │   ├── blog/                     # Blog module
│   │   │   ├── page.tsx              # Blog listing
│   │   │   └── [slug]/page.tsx       # Blog detail
│   │   ├── careers/                  # Careers module
│   │   │   ├── page.tsx              # Careers page
│   │   │   └── CareersForm.tsx       # Application form (co-located)
│   │   ├── cart/page.tsx             # Shopping cart
│   │   ├── contact/                  # Contact module
│   │   │   ├── page.tsx              # Contact page
│   │   │   ├── ContactForm.tsx       # Legacy contact form
│   │   │   └── ContactFormSection.tsx # Contact form section
│   │   ├── distributors/             # Distributors module
│   │   │   ├── page.tsx              # Distributors page
│   │   │   └── DistributorsForm.tsx  # Legacy distributor form
│   │   ├── login/                    # User login
│   │   │   ├── page.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── order-success/[orderId]/  # Order confirmation
│   │   ├── privacy-policy/page.tsx   # Privacy policy
│   │   ├── product/[id]/page.tsx     # Product detail
│   │   ├── products/page.tsx         # Product catalog
│   │   ├── resources/page.tsx        # Resources
│   │   ├── signup/                   # User registration
│   │   │   ├── page.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── stories/                  # Stories module
│   │   │   ├── page.tsx              # Stories listing
│   │   │   └── [slug]/page.tsx       # Story detail
│   │   └── terms-conditions/page.tsx # T&C
│   │
│   ├── (admin)/                      # Admin route group
│   │   ├── admin-login/              # Admin login
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── admin/                    # Admin panel
│   │       ├── layout.tsx            # Session guard
│   │       ├── page.tsx              # Admin landing
│   │       └── dashboard/            # Dashboard modules
│   │           ├── layout.tsx        # Dashboard layout
│   │           ├── page.tsx          # Dashboard home
│   │           ├── about/page.tsx
│   │           ├── blogs/page.tsx
│   │           ├── careers/page.tsx
│   │           ├── contact/page.tsx
│   │           ├── distributors/page.tsx
│   │           ├── footer/page.tsx
│   │           ├── home/page.tsx
│   │           ├── navbar/page.tsx
│   │           ├── orders/page.tsx
│   │           ├── privacy-policy/page.tsx
│   │           ├── products/page.tsx
│   │           ├── resources/page.tsx
│   │           ├── services/page.tsx
│   │           ├── stories/page.tsx
│   │           └── terms-conditions/page.tsx
│   │
│   └── api/                          # API routes
│       ├── auth/                     # Auth endpoints
│       ├── admin/                    # Admin CRUD endpoints
│       └── (public routes)           # Public data endpoints
│
├── components/
│   ├── ui/                           # Base UI components (shadcn/ui)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── sonner.tsx
│   │   ├── textarea.tsx
│   │   └── toggleBtn.tsx
│   │
│   ├── common/                       # Shared layout components
│   │   ├── ClientImage.tsx
│   │   ├── Footer.tsx
│   │   ├── LayoutWrapper.tsx
│   │   └── Navbar.tsx
│   │
│   ├── motion/                       # Animation components
│   │   ├── ParallaxImage.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── StaggerContainer.tsx
│   │   └── TextReveal.tsx
│   │
│   ├── layout/                       # Layout helpers
│   │   ├── PageContainer.tsx
│   │   └── PageTransition.tsx
│   │
│   ├── providers/                    # Context providers
│   │   ├── AuthSessionProvider.tsx
│   │   └── ThemeProvider.tsx
│   │
│   ├── admin/                        # Admin-specific components
│   │   ├── AdminLogoutButton.tsx
│   │   └── AdminSessionProvider.tsx
│   │
│   └── features/                     # Feature-based components
│       ├── home/                     # ~20 components
│       ├── products/                 # 7 components
│       ├── blog/                     # 5 components
│       ├── about/                    # 8 components
│       ├── stories/                  # 8 components + data
│       ├── resources/                # 8 components + data
│       ├── careers/                  # 5 components
│       ├── distributors/             # 7 components + data
│       ├── cart/                     # 2 components
│       ├── contact/                  # 1 component
│       └── privacy-policy/           # 1 component
│
├── context/                          # React Context providers
│   ├── CartContext.tsx                # Shopping cart state
│   └── UserAuthContext.tsx            # User authentication state
│
├── hooks/                            # Custom React hooks
│   └── useActivityTimeout.ts         # Inactivity detection
│
├── lib/                              # Utility & business logic
│   ├── api/
│   │   └── dashboard.ts             # Dashboard API helpers
│   ├── auth/
│   │   ├── hash.ts                   # Password hashing
│   │   ├── options.ts                # Auth options
│   │   └── user-jwt.ts              # User JWT management
│   ├── db/
│   │   └── index.ts                 # MongoDB connection
│   ├── models/                       # Mongoose models (22 models)
│   ├── validations/                  # Zod schemas
│   │   ├── careers.ts
│   │   ├── checkout.ts
│   │   ├── contact.ts
│   │   ├── distributor.ts
│   │   ├── login.ts
│   │   └── signup.ts
│   ├── api-error.ts                 # API error handling
│   ├── cloudinary.ts                # Cloudinary config
│   ├── cloudinaryDelete.ts          # Image deletion
│   ├── exportOrders.ts              # Excel export
│   ├── getBaseUrl.ts                # URL resolution
│   ├── normalize*.ts                # Data normalization (7 files)
│   ├── request-id.ts               # Request ID generation
│   ├── requireAdmin.ts             # Admin auth check
│   ├── seo.ts                      # SEO utilities
│   └── utils.ts                    # cn() utility
│
├── types/
│   └── next-auth.d.ts              # NextAuth type augmentation
│
├── auth.ts                          # NextAuth configuration
├── auth.config.ts                   # Edge-safe auth callbacks
├── middleware.ts                     # Route protection middleware
└── globals.css                      # Global styles + CSS variables
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` | `src/app/(public)/products/page.tsx` |
| Layouts | `layout.tsx` | `src/app/(public)/layout.tsx` |
| Components | PascalCase | `ProductCard.tsx` |
| Client Components | `PageClient.tsx` suffix | `ProductsPageClient.tsx` |
| Data files | camelCase | `distributorData.ts` |
| Models | `Model.model.ts` | `Product.model.ts` |
| Validations | camelCase | `checkout.ts` |
| Utilities | camelCase | `getBaseUrl.ts` |
| Normalizers | `normalize*.ts` | `normalizeAbout.ts` |
