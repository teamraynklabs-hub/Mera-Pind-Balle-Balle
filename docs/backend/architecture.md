# Backend Architecture

## Overview

The backend is built as a **monolithic API** within the Next.js App Router. All API routes live under `src/app/api/` and communicate with MongoDB via Mongoose. There is no separate backend server — the Next.js server handles both frontend rendering and API logic.

## Architecture Diagram

```
                    ┌─────────────────┐
                    │   Client/Browser │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Middleware     │  ← Route protection (Edge)
                    │   (middleware.ts)│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │ Public API     │ │ Auth API │ │ Admin API    │
     │ /api/(public)/ │ │ /api/auth│ │ /api/admin/  │
     └────────┬──────┘ └────┬─────┘ └──────┬──────┘
              │              │              │
              │              │       ┌──────▼──────┐
              │              │       │ requireAdmin │
              │              │       │ (auth check) │
              │              │       └──────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │   connectDB()   │  ← MongoDB connection pool
                    │   (Mongoose)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │  Mongoose      │ │ Cloudinary│ │ bcryptjs    │
     │  Models        │ │ (images) │ │ (passwords) │
     └───────────────┘ └──────────┘ └─────────────┘
```

## Request Lifecycle

```
1. HTTP Request arrives
2. Middleware (Edge) checks authentication for protected routes
3. Route handler executes:
   a. Admin routes: requireAdmin() verifies session
   b. Auth routes: process credentials/tokens
   c. Public routes: open access
4. connectDB() establishes/reuses MongoDB connection
5. Mongoose model operations (find, create, update, delete)
6. Optional: Cloudinary upload/delete for images
7. Response formatted as { success, data, error }
8. Optional: revalidatePath() for cache invalidation
```

## API Route Organization

```
src/app/api/
├── auth/                    # Authentication endpoints
│   ├── [...nextauth]/       # NextAuth.js handler (admin)
│   ├── login/               # User login
│   ├── register/            # User registration
│   ├── me/                  # Current user info
│   ├── logout/              # Admin logout
│   └── user-logout/         # User logout
│
├── admin/                   # Protected admin CRUD
│   ├── products/            # Product management
│   ├── blogs/               # Blog management
│   ├── stories/             # Story management
│   ├── careers/             # Career management
│   ├── orders/              # Order management
│   ├── categories/          # Category management
│   ├── distributors/        # Distributor management
│   ├── contact-leads/       # Contact submissions
│   ├── resources/           # Resource management
│   ├── services/            # Service management
│   ├── home/                # Homepage content
│   ├── about/               # About page content
│   ├── navbar-settings/     # Navigation config
│   ├── footer-page/         # Footer config
│   ├── contact-page/        # Contact page config
│   ├── distributors-page/   # Distributors page config
│   ├── privacy-policy-page/ # Privacy policy
│   ├── terms-conditions-page/ # T&C
│   ├── dashboard/           # Dashboard data
│   └── example/             # Example/test route
│
├── (public)/                # Public data endpoints
│   ├── about/
│   ├── blogs/
│   ├── careers/
│   ├── categories/
│   ├── contact/
│   ├── contact-page/
│   ├── dashboard/
│   ├── distributors/
│   ├── distributors-page/
│   ├── footer-page/
│   ├── home/
│   ├── initiatives/
│   ├── navbar-settings/
│   ├── orders/
│   ├── privacy-policy-page/
│   ├── products/
│   ├── resources/
│   ├── services/
│   ├── stories/
│   ├── terms-conditions-page/
│   └── testimonials/
│
├── upload/                  # File upload endpoint
└── test-db/                 # Database connection test
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Monolithic API in Next.js | Single deployment, no CORS issues, shared types |
| Mongoose ODM | Schema validation, middleware hooks, query building |
| JWT for user auth | Stateless, no session store needed |
| NextAuth for admin auth | Battle-tested, secure session management |
| Cloudinary for images | CDN delivery, automatic transformation, folder organization |
| No ORM abstraction layer | Direct Mongoose — simple, no over-engineering |
| revalidatePath for cache | Next.js native cache invalidation after mutations |

## Error Handling Architecture

**File**: `src/lib/api-error.ts`

```typescript
class ApiError extends Error {
  statusCode: number;
  code: string;
}

// Standard error response
handleApiError(error, requestId?) → NextResponse<{
  success: false,
  error: string,
  code: string,
  requestId?: string
}>

// Standard success response
createSuccessResponse(data?, message?) → NextResponse<{
  success: true,
  data: T,
  message?: string
}>
```

## Connection Management

**File**: `src/lib/db/index.ts`

MongoDB connection uses a global singleton with connection pooling:
- Max pool: 10 connections
- Min pool: 5 connections
- Server selection timeout: 5 seconds
- Socket timeout: 45 seconds
- Auto-indexing disabled in production
- IPv4 only (family: 4)
