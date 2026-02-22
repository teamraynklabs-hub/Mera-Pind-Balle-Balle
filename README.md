# Mera Pind Balle Balle

A full-stack e-commerce and community engagement platform built with Next.js 16, React 19, and MongoDB. The system provides a product catalog, order management, content publishing (blog/stories), career listings, distributor management, and a comprehensive admin dashboard with real-time content management.

**Live URL**: [https://your-live-url.com](https://your-live-url.com)

---

## Screenshots

> Add screenshots of the homepage, product catalog, admin dashboard, and mobile views here.

```
screenshots/
├── homepage.png
├── products.png
├── product-detail.png
├── admin-dashboard.png
├── mobile-home.png
└── mobile-cart.png
```

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                    │
│  Next.js App Router | React 19 | Tailwind CSS v4       │
│  Server Components + Client Components                  │
└───────────────────────┬────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────┐
│                   NEXT.JS SERVER                        │
│  ┌──────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │Middleware │  │ API Routes │  │ Server Components │  │
│  │(Edge)    │  │ /api/*     │  │ (SSR/SSG)         │  │
│  └──────────┘  └────────────┘  └───────────────────┘  │
└───────────────────────┬────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
  ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
  │  MongoDB     │ │Cloudinary│ │ bcryptjs   │
  │  Atlas       │ │  CDN    │ │ + JWT      │
  │  (Mongoose)  │ │(Images) │ │ (Auth)     │
  └──────────────┘ └────────┘ └────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.1 | React framework (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Shadcn/ui | Custom | Accessible UI components (Radix UI) |
| react-hook-form | 7.71.1 | Form state management |
| Zod | 4.3.6 | Schema validation |
| Motion | 12.23.24 | Scroll-driven animations |
| Sonner | 2.0.7 | Toast notifications |
| lucide-react | 0.554.0 | Icon library |
| next-themes | 0.4.6 | Dark/light mode |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 16.1.1 | REST API |
| MongoDB | Atlas | Document database |
| Mongoose | 9.1.2 | ODM with schemas |
| NextAuth.js | 5.0.0-beta.30 | Admin authentication |
| jsonwebtoken | 9.0.3 | User JWT authentication |
| bcryptjs | 3.0.3 | Password hashing |
| Cloudinary | 2.8.0 | Image CDN and management |
| Axios | 1.13.2 | HTTP client |
| react-quill-new | 3.7.0 | Rich text editor (admin) |
| xlsx | 0.18.5 | Excel export (orders) |

---

## Features

### Customer Features
- Product catalog with category filtering and search
- Product detail with image gallery and specifications
- Shopping cart with localStorage persistence
- Checkout with address validation and COD payment
- Order tracking with order number lookup
- Blog and community stories
- Career application submission
- Distributor partnership application
- Contact form
- Dark/light mode toggle
- Fully responsive design (mobile-first)
- SEO optimized (sitemap, robots.txt, meta tags)

### Admin Dashboard
- Product CRUD with Cloudinary image upload
- Order management with status tracking and Excel export
- Blog/story publishing with rich text editor (WYSIWYG)
- Career listing management
- Contact lead tracking and resolution
- Distributor management
- Page content management (homepage, about, footer, navbar, etc.)
- Navigation and branding configuration

---

## Module Overview

| Module | Public Routes | Admin Routes | Models |
|--------|-------------|-------------|--------|
| Products | `/products`, `/product/[id]` | `/admin/dashboard/products` | Product, Category |
| Orders | `/cart`, `/order-success/[id]` | `/admin/dashboard/orders` | Order |
| Blog | `/blog`, `/blog/[slug]` | `/admin/dashboard/blogs` | Blog |
| Stories | `/stories`, `/stories/[slug]` | `/admin/dashboard/stories` | Story |
| Careers | `/careers` | `/admin/dashboard/careers` | Career, CareerApplication |
| Contact | `/contact` | `/admin/dashboard/contact` | Contact |
| Distributors | `/distributors` | `/admin/dashboard/distributors` | Distributor |
| Resources | `/resources` | `/admin/dashboard/resources` | Resource |
| About | `/about` | `/admin/dashboard/about` | About |
| Auth | `/login`, `/signup` | `/admin-login` | User |

---

## Authentication Overview

### Dual Authentication System

| Domain | Method | Token | Expiry |
|--------|--------|-------|--------|
| Admin | NextAuth.js v5 (Credentials via .env) | Session cookie | 1 hour |
| Customer | Custom JWT | HTTP-only cookie | 7 days |

- Admin credentials configured via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
- Admin routes protected by Edge middleware + API route guards
- Customer passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens stored in HTTP-only cookies (XSS-safe)
- Middleware runs at Edge runtime for fast route protection

---

## Permission System Overview

| Role | Access Level |
|------|-------------|
| Admin | Full system access — all CRUD, settings, orders |
| Editor | Content management — blogs, stories, resources |
| Customer | Browse, purchase, view own orders |
| Anonymous | Browse products, read content, submit forms |

---

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd Mera-Pind-Balle-Balle

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials (see below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin-login](http://localhost:3000/admin-login) for the admin panel.

### Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create `.env.local` with the following:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

# Authentication
AUTH_SECRET=<random-secret-string>
JWT_SECRET=<random-secret-string>
ADMIN_API_KEY=<admin-api-key>
ADMIN_EMAIL=<admin-login-email>
ADMIN_PASSWORD=<admin-login-password>

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=false
```

---

## Folder Structure

```
src/
├── app/
│   ├── (public)/          # Customer-facing pages (18 routes)
│   ├── (admin)/           # Admin dashboard (15+ modules)
│   └── api/               # REST API routes (50+ endpoints)
├── components/
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── common/            # Navbar, Footer, Layout
│   ├── motion/            # Animation components
│   ├── features/          # Feature-based components (11 modules)
│   └── providers/         # Context providers
├── context/               # Cart + Auth state (React Context)
├── lib/
│   ├── models/            # Mongoose schemas (22 models)
│   ├── validations/       # Zod schemas (6 schemas)
│   ├── auth/              # JWT + password utilities
│   └── db/                # MongoDB connection
├── auth.ts                # NextAuth configuration
├── middleware.ts           # Route protection (Edge)
└── globals.css            # Tailwind + CSS variables
```

See [docs/frontend/folder-structure.md](docs/frontend/folder-structure.md) and [docs/backend/folder-structure.md](docs/backend/folder-structure.md) for complete file trees.

---

## API Versioning Strategy

All API routes follow the pattern:

```
/api/auth/*            → Authentication
/api/admin/*           → Protected admin CRUD (requires admin session)
/api/{resource}        → Public read endpoints
/api/{resource}/[id]   → Single resource operations
```

Response format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

See [docs/backend/api-versioning.md](docs/backend/api-versioning.md) for the complete API reference with 50+ endpoints.

---

## Performance Strategy

- **next/image** for all images with responsive `sizes` and lazy loading
- **React.memo** on performance-critical components (ProductCard)
- **Server components** by default — minimal client JavaScript
- **Static generation** for content listing pages (blog, stories, resources)
- **Connection pooling** (5-10 MongoDB connections with singleton pattern)
- **Cloudinary CDN** for image delivery with automatic optimization
- **Skeleton loading** states for perceived performance
- **120s polling interval** for real-time home page data
- **Lean queries** (`.lean()`) for read-heavy database operations
- **Compound indexes** on frequently queried fields

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js configuration

### Self-Hosted

```bash
npm run build
npm start
```

Requires: Node.js server (PM2 or Docker), reverse proxy (Nginx), SSL certificate (Let's Encrypt).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow existing code patterns and conventions
4. Ensure `npm run build` passes with 0 errors
5. Write meaningful commit messages
6. Submit a pull request with description of changes

### Code Conventions

- TypeScript strict mode
- Tailwind utility classes (no inline styles)
- Feature-based component organization
- Zod schemas for all form validation
- `next/image` for all images (no `<img>` tags)
- Sonner for toast notifications
- `err instanceof Error` pattern (no `catch (err: any)`)
- No `console.log` in production code

---

## Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|----------|-------------|
| [docs/understand.md](docs/understand.md) | Complete system understanding (single source of truth) |
| [docs/frontend/architecture.md](docs/frontend/architecture.md) | Frontend architecture and design system |
| [docs/frontend/routing.md](docs/frontend/routing.md) | All routes, layouts, and middleware |
| [docs/frontend/state-management.md](docs/frontend/state-management.md) | Context API state management |
| [docs/frontend/api-integration.md](docs/frontend/api-integration.md) | API integration patterns |
| [docs/frontend/auth-flow.md](docs/frontend/auth-flow.md) | Dual authentication flow |
| [docs/frontend/performance.md](docs/frontend/performance.md) | Performance optimization |
| [docs/frontend/pages/](docs/frontend/pages/) | Per-module page documentation |
| [docs/frontend/folder-structure.md](docs/frontend/folder-structure.md) | Complete frontend file tree |
| [docs/backend/architecture.md](docs/backend/architecture.md) | Backend architecture |
| [docs/backend/authentication.md](docs/backend/authentication.md) | Auth implementation details |
| [docs/backend/permission-system.md](docs/backend/permission-system.md) | RBAC permission system |
| [docs/backend/api-versioning.md](docs/backend/api-versioning.md) | Complete API reference (50+ endpoints) |
| [docs/backend/database-design.md](docs/backend/database-design.md) | All 22 database models |
| [docs/backend/performance.md](docs/backend/performance.md) | Connection pooling, caching, optimization |
| [docs/backend/cloudinary-integration.md](docs/backend/cloudinary-integration.md) | Image CDN integration |
| [docs/backend/notification-system.md](docs/backend/notification-system.md) | Toast and communication system |
| [docs/backend/order-management.md](docs/backend/order-management.md) | Order lifecycle and management |
| [docs/backend/folder-structure.md](docs/backend/folder-structure.md) | Complete backend file tree |

---

## Roadmap

- [ ] Online payment integration (Razorpay)
- [ ] Email notifications (order confirmation, status updates)
- [ ] Customer order history page
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Newsletter system
- [ ] Admin audit trail
- [ ] Granular role permissions per module
- [ ] Full-text search with indexing
- [ ] PWA support
- [ ] Unit and E2E test coverage (Vitest + Playwright)
- [ ] API rate limiting
- [ ] Refresh token rotation

---

## License

This project is proprietary. All rights reserved.

---

### Developer

**Name:** Rohit Rathod
**Role:** Full Stack Developer

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion
**Backend:** Node.js, MongoDB, Mongoose, NextAuth.js, JWT, REST APIs, Cloudinary

Email: rohitrathod.dev@gmail.com
Portfolio: [https://rohitrathod.dev](https://rohitrathod.dev)
LinkedIn: [https://linkedin.com/in/rohit-rathod-dev](https://linkedin.com/in/rohit-rathod-dev)
