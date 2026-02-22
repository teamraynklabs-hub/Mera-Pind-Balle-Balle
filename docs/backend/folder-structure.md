# Backend Folder Structure

```
src/
├── app/api/                          # All API routes
│   │
│   ├── auth/                         # Authentication endpoints
│   │   ├── [...nextauth]/route.ts    # NextAuth.js handler
│   │   ├── login/route.ts           # User login (POST)
│   │   ├── register/route.ts        # User registration (POST)
│   │   ├── me/route.ts             # Current user (GET)
│   │   ├── logout/route.ts         # Admin logout (POST)
│   │   └── user-logout/route.ts    # User logout (POST)
│   │
│   ├── admin/                        # Admin CRUD endpoints (all protected)
│   │   ├── products/route.ts        # GET (list), POST (create)
│   │   ├── products/[id]/route.ts   # PUT (update), DELETE
│   │   ├── blogs/route.ts          # GET, POST
│   │   ├── blogs/[id]/route.ts     # PUT, DELETE
│   │   ├── stories/route.ts        # GET, POST
│   │   ├── stories/[id]/route.ts   # PUT, DELETE
│   │   ├── careers/route.ts        # GET, POST
│   │   ├── careers/[id]/route.ts   # PUT, DELETE
│   │   ├── orders/route.ts         # GET (filterable)
│   │   ├── orders/[id]/route.ts    # PUT, DELETE
│   │   ├── categories/route.ts     # GET, POST
│   │   ├── categories/[id]/route.ts # PUT, DELETE
│   │   ├── contact-leads/route.ts  # GET
│   │   ├── contact-leads/[id]/route.ts # PATCH, DELETE
│   │   ├── distributors/route.ts   # GET, POST
│   │   ├── distributors/[id]/route.ts # PUT, DELETE
│   │   ├── resources/route.ts      # GET, POST
│   │   ├── resources/[id]/route.ts # PUT, DELETE
│   │   ├── resources/seed/route.ts # POST (data seeding)
│   │   ├── services/route.ts       # GET, POST
│   │   ├── home/route.ts           # GET, POST (homepage)
│   │   ├── about/route.ts          # GET, POST (about page)
│   │   ├── dashboard/route.ts      # GET, POST (dashboard data)
│   │   ├── navbar-settings/route.ts # GET, POST
│   │   ├── footer-page/route.ts    # GET, POST
│   │   ├── contact-page/route.ts   # GET, POST
│   │   ├── distributors-page/route.ts # GET, POST
│   │   ├── privacy-policy-page/route.ts # GET, POST
│   │   ├── terms-conditions-page/route.ts # GET, POST
│   │   └── example/route.ts        # Test/example endpoint
│   │
│   ├── (public routes - in api root) # Public read endpoints
│   │   ├── about/route.ts          # GET
│   │   ├── blogs/route.ts          # GET (with search, pagination)
│   │   ├── blogs/[slug]/route.ts   # GET
│   │   ├── careers/route.ts        # GET, POST (application)
│   │   ├── categories/route.ts     # GET
│   │   ├── contact/route.ts        # POST (form submission)
│   │   ├── contact-page/route.ts   # GET
│   │   ├── dashboard/route.ts      # GET
│   │   ├── distributors/route.ts   # GET, POST (application)
│   │   ├── distributors-page/route.ts # GET
│   │   ├── footer-page/route.ts    # GET
│   │   ├── home/route.ts           # GET
│   │   ├── initiatives/route.ts    # GET
│   │   ├── navbar-settings/route.ts # GET
│   │   ├── orders/[id]/route.ts    # GET (by ID or orderNumber)
│   │   ├── orders/create/route.ts  # POST (authenticated)
│   │   ├── privacy-policy-page/route.ts # GET
│   │   ├── products/route.ts       # GET
│   │   ├── resources/route.ts      # GET
│   │   ├── services/route.ts       # GET
│   │   ├── services/[id]/route.ts  # GET
│   │   ├── stories/route.ts        # GET (with pagination)
│   │   ├── stories/[slug]/route.ts # GET
│   │   ├── terms-conditions-page/route.ts # GET
│   │   └── testimonials/route.ts   # GET
│   │
│   ├── upload/route.ts             # File upload (Cloudinary)
│   └── test-db/route.ts            # DB connection test
│
├── lib/                              # Shared backend utilities
│   ├── db/
│   │   └── index.ts                 # MongoDB connection singleton
│   │
│   ├── models/                       # Mongoose schemas (22 models)
│   │   ├── About.model.ts
│   │   ├── AdminUser.model.ts
│   │   ├── Blog.model.ts
│   │   ├── Career.model.ts
│   │   ├── CareerApplication.model.ts
│   │   ├── Category.model.ts
│   │   ├── Contact.model.ts
│   │   ├── ContactPage.model.ts
│   │   ├── Dashboard.model.ts
│   │   ├── Distributor.model.ts
│   │   ├── DistributorsPage.model.ts
│   │   ├── FooterPage.model.ts
│   │   ├── Initiative.model.ts
│   │   ├── NavbarSettings.model.ts
│   │   ├── Order.model.ts
│   │   ├── PrivacyPolicyPage.model.ts
│   │   ├── Product.model.ts
│   │   ├── Resource.model.ts
│   │   ├── Service.model.ts
│   │   ├── Story.model.ts
│   │   ├── TermsConditionsPage.model.ts
│   │   └── User.model.ts
│   │
│   ├── auth/
│   │   ├── hash.ts                  # Password hashing (bcryptjs)
│   │   ├── options.ts               # Auth options
│   │   └── user-jwt.ts             # JWT sign/verify/cookie
│   │
│   ├── validations/                  # Zod validation schemas
│   │   ├── careers.ts
│   │   ├── checkout.ts
│   │   ├── contact.ts
│   │   ├── distributor.ts
│   │   ├── login.ts
│   │   └── signup.ts
│   │
│   ├── api-error.ts                 # ApiError class + handlers
│   ├── cloudinary.ts                # Cloudinary config
│   ├── cloudinaryDelete.ts          # Image deletion utility
│   ├── exportOrders.ts              # XLSX export
│   ├── getBaseUrl.ts                # URL resolution
│   ├── normalize*.ts                # Data normalization (7 files)
│   ├── request-id.ts               # Request ID generation
│   ├── requireAdmin.ts             # Admin auth guard
│   ├── seo.ts                      # SEO metadata helpers
│   └── utils.ts                    # cn() utility
│
├── auth.ts                          # NextAuth.js configuration
├── auth.config.ts                   # Edge-safe auth callbacks
└── middleware.ts                     # Route protection middleware
```

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| API Routes | `route.ts` | `api/products/route.ts` |
| Dynamic Routes | `[param]/route.ts` | `api/products/[id]/route.ts` |
| Models | `PascalCase.model.ts` | `Product.model.ts` |
| Utilities | `camelCase.ts` | `requireAdmin.ts` |
| Validations | `camelCase.ts` | `checkout.ts` |
| Auth files | `camelCase.ts` | `user-jwt.ts` |

## Module Boundaries

```
API Routes (route handlers)
    ↓ calls
Utilities (requireAdmin, connectDB, apiError)
    ↓ uses
Models (Mongoose schemas)
    ↓ queries
MongoDB (database)

API Routes
    ↓ calls
Cloudinary (image upload/delete)
    ↓ uses
cloudinary.ts / cloudinaryDelete.ts
```
