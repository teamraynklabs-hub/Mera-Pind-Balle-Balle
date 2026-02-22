# Complete System Understanding

> Single source of truth for the Mera Pind Balle Balle platform architecture, workflows, and development guide.

---

## 1. System Overview

Mera Pind Balle Balle is a **full-stack e-commerce and community engagement platform** built with Next.js 16. It provides a product catalog, shopping cart, order management, blog/stories content system, career listings, distributor management, and a comprehensive admin dashboard.

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | MongoDB (Atlas) | — |
| ODM | Mongoose | 9.1.2 |
| Admin Auth | NextAuth.js | 5.0.0-beta.30 |
| User Auth | Custom JWT | jsonwebtoken 9.0.3 |
| Image CDN | Cloudinary | 2.8.0 |
| Forms | react-hook-form + Zod | 7.71.1 / 4.3.6 |
| Animations | Motion (Framer Motion) | 12.23.24 |
| Toast | Sonner | 2.0.7 |
| Icons | lucide-react | 0.554.0 |
| Rich Text | react-quill-new | 3.7.0 |
| HTTP Client | Axios | 1.13.2 |

---

## 2. Business Flow

```
┌──────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                       │
│                                                          │
│  Browse → Product Detail → Add to Cart → Checkout → Order│
│    │                                                     │
│    ├── Blog/Stories (engagement)                         │
│    ├── Contact Form (inquiries)                          │
│    ├── Distributor Application (partnerships)            │
│    └── Career Application (recruitment)                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                     ADMIN WORKFLOW                        │
│                                                          │
│  Login → Dashboard → Manage Content/Products/Orders      │
│    │                                                     │
│    ├── Product CRUD + Cloudinary images                  │
│    ├── Blog/Story CRUD + Rich text editor                │
│    ├── Order management + status tracking                │
│    ├── Contact lead management                           │
│    ├── Distributor management                            │
│    ├── Career listing management                         │
│    ├── Page content management (home, about, footer...)  │
│    └── Navigation/branding configuration                 │
└──────────────────────────────────────────────────────────┘
```

---

## 3. User Roles

| Role | Access | Authentication | Session Duration |
|------|--------|---------------|-----------------|
| **Anonymous** | Browse products, read content, submit forms | None | — |
| **Customer** | All anonymous + place orders, view order history | Custom JWT (HTTP-only cookie) | 7 days |
| **Editor** | Content management (blogs, stories, resources) | NextAuth.js session | 1 hour |
| **Admin** | Full system access — all CRUD + settings | NextAuth.js session | 1 hour |

---

## 4. Permission Hierarchy

```
Admin (full access)
├── All CRUD operations
├── Order management
├── Site settings (navbar, footer, pages)
├── User/lead management
└── File uploads
    │
Editor (content access)
├── Blog CRUD
├── Story CRUD
└── Resource CRUD
    │
Customer (authenticated)
├── Place orders
├── View own order history
└── All anonymous permissions
    │
Anonymous (public)
├── Browse products
├── Read blogs, stories, about, resources
├── Submit contact/distributor/career forms
└── View cart (client-side)
```

---

## 5. Module Interaction Map

```
                    ┌─────────────┐
                    │   Navbar    │←── NavbarSettings model
                    │(configurable)│
                    └──────┬──────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼───┐          ┌──────▼──────┐         ┌─────▼─────┐
│Products│          │   Content   │         │  Commerce  │
│Module  │          │   Module    │         │  Module    │
├────────┤          ├─────────────┤         ├───────────┤
│Catalog │          │Blog         │         │Cart       │
│Detail  │          │Stories      │         │Checkout   │
│Card    │          │About        │         │Orders     │
│Gallery │          │Resources    │         │Payment    │
└───┬────┘          └──────┬──────┘         └─────┬─────┘
    │                      │                      │
    └──────────────────────┼──────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────┐          ┌──────▼──────┐         ┌─────▼─────┐
│Contact │          │Distributors │         │ Careers   │
│Module  │          │  Module     │         │  Module   │
├────────┤          ├─────────────┤         ├───────────┤
│Form    │          │Info         │         │Listings   │
│Leads   │          │Application  │         │Application│
└────────┘          └─────────────┘         └───────────┘
                           │
                    ┌──────▼──────┐
                    │   Footer    │←── FooterPage model
                    │(configurable)│
                    └─────────────┘
```

---

## 6. End-to-End Data Flow

### Product Listing Flow

```
1. Admin creates product via /admin/dashboard/products
2. POST /api/admin/products → Cloudinary upload → MongoDB insert
3. revalidatePath("/products") invalidates cached page
4. User visits /products
5. Server component fetches GET /api/products
6. Product.find({ isActive: true }) → Returns product list
7. ProductsPageClient renders ProductCard grid
8. next/image serves optimized images from Cloudinary CDN
```

### Order Flow

```
1. User browses products → adds to cart (localStorage)
2. User clicks Checkout → requireAuth() checks JWT cookie
3. If not logged in → redirect to /login → login → redirect back
4. CheckoutDrawer collects shipping details (Zod validated)
5. POST /api/orders/create
6. Server: verify user JWT → verify product prices from DB
7. Server: create Order document with verified prices
8. Server: generate orderNumber (MPBB-YYYYMMDD-XXXX)
9. Client: redirect to /order-success/[orderNumber]
10. Client: clearCart() empties localStorage
11. Admin views order in /admin/dashboard/orders
12. Admin updates status: PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
```

### Content Publishing Flow

```
1. Admin creates blog via /admin/dashboard/blogs
2. Rich text editor (react-quill-new) for content
3. Image upload via Cloudinary
4. POST /api/admin/blogs → MongoDB insert → revalidatePath("/blog")
5. User visits /blog → server fetches published blogs
6. User clicks blog → /blog/[slug] → fetch by slug
7. HTML content rendered with prose-luxury styling
```

---

## 7. Complete Workflow Explanation

### Authentication → Entry → Content → Commerce → Notifications

```
┌─────────────┐     ┌──────────┐     ┌───────────┐
│Authentication│────→│  Entry   │────→│  Content  │
│              │     │          │     │           │
│ Login/Signup │     │ Homepage │     │ Blog      │
│ JWT/Session  │     │ Products │     │ Stories   │
│ Middleware   │     │ Category │     │ About     │
└─────────────┘     └──────────┘     └───────────┘
                                           │
                    ┌──────────┐     ┌─────▼─────┐
                    │Notification│←──│  Commerce  │
                    │           │    │           │
                    │ Toast     │    │ Cart      │
                    │ Contact   │    │ Checkout  │
                    │ Forms     │    │ Orders    │
                    └──────────┘    └───────────┘
```

---

## 8. Status Lifecycle Mapping

### Order Status

| Status | Description | Next States |
|--------|------------|-------------|
| PLACED | Order submitted | CONFIRMED, CANCELLED |
| CONFIRMED | Admin confirmed | PROCESSING, CANCELLED |
| PROCESSING | Being prepared | SHIPPED, CANCELLED |
| SHIPPED | In transit | DELIVERED |
| DELIVERED | Received by customer | (terminal) |
| CANCELLED | Order cancelled | (terminal) |

### Payment Status

| Status | Description | Trigger |
|--------|------------|---------|
| PENDING | Awaiting payment | Order created (COD) |
| PAID | Payment received | Admin update / Razorpay webhook |
| FAILED | Payment failed | Payment gateway rejection |
| REFUNDED | Payment returned | Admin action on cancellation |

### Content Status

| Field | Values | Purpose |
|-------|--------|---------|
| `isPublished` | true/false | Blog, Story, Resource visibility |
| `isActive` | true/false | Product, Category, Service, Distributor visibility |
| `isResolved` | true/false | Contact lead tracking |

---

## 9. Folder Architecture Explanation

```
src/
├── app/                  # Next.js App Router (pages + API)
│   ├── (public)/         # Customer-facing pages (route group)
│   ├── (admin)/          # Admin dashboard (route group)
│   └── api/              # Backend API routes
│
├── components/           # React components
│   ├── ui/               # Base UI primitives (shadcn/ui)
│   ├── common/           # Shared layout (Navbar, Footer)
│   ├── motion/           # Animation components
│   ├── layout/           # Page wrappers
│   ├── providers/        # Context providers
│   ├── admin/            # Admin-specific components
│   └── features/         # Feature-based components (by module)
│
├── context/              # React Context providers (Cart, Auth)
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities & business logic
│   ├── db/               # Database connection
│   ├── models/           # Mongoose schemas (22 models)
│   ├── auth/             # Auth utilities
│   └── validations/      # Zod schemas
│
├── types/                # TypeScript type definitions
├── auth.ts               # NextAuth configuration
├── auth.config.ts        # Edge-safe auth callbacks
├── middleware.ts          # Route protection
└── globals.css           # Global styles + CSS variables
```

### Why This Structure?

- **Route groups** `(public)` and `(admin)` share the same URL space but have different layouts
- **Feature-based components** keep related UI together (e.g., all product components in `features/products/`)
- **API routes co-located** with the framework for type sharing and deployment simplicity
- **lib/ for shared logic** keeps business logic separate from UI
- **models/ centralized** for single source of truth on data shapes

---

## 10. How Frontend & Backend Connect

```
Frontend (React)                    Backend (API Routes)
─────────────────                   ───────────────────
Server Components  ──fetch()──→     GET /api/products
                                    GET /api/blogs
                                    GET /api/about

Client Components  ──axios──→       POST /api/contact
                   ──fetch──→       POST /api/orders/create
                                    POST /api/auth/login

Admin Pages        ──fetch──→       POST /api/admin/products
                   ──FormData──→    (with file upload)
```

**Key principle**: Server components call APIs directly via `fetch`. Client components use `axios` or `fetch` for mutations.

---

## 11. How API Client Works

```typescript
// Server component (page.tsx)
const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
const { data } = await res.json();
return <ProductsPageClient products={data} />;

// Client component (form submission)
const base = getBaseUrl(); // window.location.origin or env
await axios.post(`${base}/api/contact`, formData);

// File upload (admin)
const formData = new FormData();
formData.append("image", file);
await fetch("/api/admin/products", { method: "POST", body: formData });
```

---

## 12. How Token Refresh Works

### Admin (NextAuth)

- JWT session with 1-hour expiry
- **No refresh mechanism** — session expires, user redirected to login
- NextAuth handles token rotation internally via session callbacks

### User (Custom JWT)

- JWT with 7-day expiry stored in HTTP-only cookie
- **No refresh mechanism** — token expires, user must re-login
- Token verified on each `/api/auth/me` call

### Recommended Improvement

Implement refresh token rotation:
1. Issue short-lived access token (15 min) + long-lived refresh token (30 days)
2. Store refresh token in HTTP-only cookie
3. Create `/api/auth/refresh` endpoint
4. Auto-refresh on 401 response via axios interceptor

---

## 13. How State Management Works

```
┌─────────────────────────────────────┐
│           React Context API          │
├─────────────────────────────────────┤
│                                     │
│  CartContext                        │
│  ├── items: CartItem[]              │
│  ├── addToCart(product)             │
│  ├── removeFromCart(id)             │
│  ├── updateQuantity(id, qty)       │
│  ├── clearCart()                    │
│  └── Persisted in localStorage     │
│                                     │
│  UserAuthContext                    │
│  ├── user: UserData | null         │
│  ├── login(email, password)        │
│  ├── signup(data)                  │
│  ├── logout()                      │
│  └── Backed by HTTP-only JWT cookie│
│                                     │
│  ThemeProvider (next-themes)        │
│  └── theme: "light" | "dark"       │
│                                     │
│  AuthSessionProvider (NextAuth)     │
│  └── session: { user, role }       │
│                                     │
└─────────────────────────────────────┘
```

**No Redux, Zustand, or external state library.** Context API is sufficient for the application's state needs.

---

## 14. How to Extend the System

### Adding a New Public Page

1. Create page: `src/app/(public)/new-page/page.tsx`
2. Create feature components: `src/components/features/new-page/`
3. Create API route (if needed): `src/app/api/new-page/route.ts`
4. Create model (if needed): `src/lib/models/NewPage.model.ts`
5. Add nav link via admin dashboard or NavbarSettings

### Adding a New Admin Module

1. Create admin page: `src/app/(admin)/admin/dashboard/new-module/page.tsx`
2. Create API routes: `src/app/api/admin/new-module/route.ts`
3. Add `requireAdmin()` guard to API routes
4. Create Mongoose model in `src/lib/models/`
5. Add link to admin navigation

---

## 15. How to Add a New Module

**Example: Adding a "Testimonials Management" module**

### Step 1: Model

```typescript
// src/lib/models/Testimonial.model.ts
const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String },
  quote: { type: String, required: true },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
```

### Step 2: API Routes

```
src/app/api/admin/testimonials/route.ts     → GET, POST
src/app/api/admin/testimonials/[id]/route.ts → PUT, DELETE
src/app/api/testimonials/route.ts            → GET (public)
```

### Step 3: Admin Page

```
src/app/(admin)/admin/dashboard/testimonials/page.tsx
```

### Step 4: Public Component

```
src/components/features/home/TestimonialsSection.tsx
```

### Step 5: Validation (if form)

```
src/lib/validations/testimonial.ts
```

---

## 16. How to Deploy

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas cluster configured
- Cloudinary account set up
- Environment variables configured

### Deployment Options

#### Vercel (Recommended)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect repo to Vercel
# 3. Add environment variables in Vercel dashboard
# 4. Deploy
```

Vercel auto-detects Next.js and configures:
- Serverless functions for API routes
- Edge functions for middleware
- Static generation for applicable pages
- Automatic HTTPS

#### Self-Hosted

```bash
# Build
npm run build

# Start production server
npm start
```

Requires:
- Node.js server (PM2 or Docker)
- Reverse proxy (Nginx)
- SSL certificate (Let's Encrypt)

### Environment Variables Required

```
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_API_KEY=...
AUTH_SECRET=...
JWT_SECRET=...
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
AUTH_TRUST_HOST=true
```

---

## 17. How to Start Development

```bash
# 1. Clone the repository
git clone <repo-url>
cd Mera-Pind-Balle-Balle

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in MongoDB, Cloudinary, and auth secrets

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000        → Public site
# http://localhost:3000/admin  → Admin dashboard
```

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 18. How to Write Tests

### Recommended Test Strategy

| Layer | Tool | What to Test |
|-------|------|-------------|
| Unit | Vitest | Utility functions, validation schemas, normalizers |
| Component | React Testing Library | Component rendering, user interactions |
| API | Vitest + supertest | API route handlers, auth guards |
| E2E | Playwright | Critical user flows (checkout, login, admin) |

### Setup (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Example: Testing Validation Schema

```typescript
import { describe, it, expect } from "vitest";
import { loginSchema } from "@/lib/validations/login";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
```

### Example: E2E Test (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("customer can place an order", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid='product-card']:first-child");
  await page.click("text=Add to Cart");
  await page.goto("/cart");
  await page.click("text=Checkout");
  // ... fill form and submit
  await expect(page).toHaveURL(/order-success/);
});
```

---

## Related Documentation

| Document | Path | Description |
|----------|------|-------------|
| Frontend Architecture | [frontend/architecture.md](frontend/architecture.md) | Component hierarchy, design system |
| Frontend Routing | [frontend/routing.md](frontend/routing.md) | All routes and layouts |
| State Management | [frontend/state-management.md](frontend/state-management.md) | Context API patterns |
| API Integration | [frontend/api-integration.md](frontend/api-integration.md) | Endpoint reference |
| Auth Flow | [frontend/auth-flow.md](frontend/auth-flow.md) | Dual auth system |
| Frontend Performance | [frontend/performance.md](frontend/performance.md) | Image, rendering, bundle |
| Page Documentation | [frontend/pages/](frontend/pages/) | Per-module documentation |
| Folder Structure | [frontend/folder-structure.md](frontend/folder-structure.md) | Complete file tree |
| Backend Architecture | [backend/architecture.md](backend/architecture.md) | API design, request lifecycle |
| Authentication | [backend/authentication.md](backend/authentication.md) | JWT, NextAuth, passwords |
| Permissions | [backend/permission-system.md](backend/permission-system.md) | RBAC system |
| API Reference | [backend/api-versioning.md](backend/api-versioning.md) | Complete endpoint list |
| Database Design | [backend/database-design.md](backend/database-design.md) | All 22 models |
| Backend Performance | [backend/performance.md](backend/performance.md) | Connection pooling, caching |
| Cloudinary | [backend/cloudinary-integration.md](backend/cloudinary-integration.md) | Image management |
| Notifications | [backend/notification-system.md](backend/notification-system.md) | Toast and future plans |
| Orders | [backend/order-management.md](backend/order-management.md) | Order lifecycle |
| Backend Structure | [backend/folder-structure.md](backend/folder-structure.md) | API and lib file tree |
