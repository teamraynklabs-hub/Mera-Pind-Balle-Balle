# Permission System

## Overview

The application uses a **role-based access control (RBAC)** system with two distinct authentication domains.

## Role Hierarchy

```
Admin (full access)
  └── Editor (limited admin access)

Customer (public + authenticated operations)
  └── Anonymous (public read-only)
```

## Role Definitions

### Admin Roles (AdminUser model)

| Role | Permissions | Description |
|------|------------|-------------|
| `admin` | Full CRUD on all resources, settings management, order management | Super administrator |
| `editor` | Content management (blogs, stories, resources) | Content editor |

### Customer Role (User model)

| Role | Permissions | Description |
|------|------------|-------------|
| Customer (implicit) | Browse products, place orders, view order history | Registered user |

### Anonymous Access

| Permission | Description |
|-----------|-------------|
| Browse products | View product catalog and details |
| Read content | View blogs, stories, about, resources |
| Submit forms | Contact form, distributor application, career application |
| View cart | Client-side cart (no auth needed) |

## Access Control Matrix

### Public Endpoints (No Auth Required)

| Endpoint | Methods | Access |
|----------|---------|--------|
| `/api/products` | GET | Everyone |
| `/api/blogs` | GET | Everyone |
| `/api/stories` | GET | Everyone |
| `/api/about` | GET | Everyone |
| `/api/careers` | GET | Everyone |
| `/api/resources` | GET | Everyone |
| `/api/services` | GET | Everyone |
| `/api/contact` | POST | Everyone |
| `/api/distributors` | POST | Everyone |
| `/api/navbar-settings` | GET | Everyone |
| `/api/footer-page` | GET | Everyone |
| All page content APIs | GET | Everyone |

### Authenticated User Endpoints

| Endpoint | Methods | Access |
|----------|---------|--------|
| `/api/auth/me` | GET | Authenticated user |
| `/api/orders/create` | POST | Authenticated user |
| `/api/orders/[id]` | GET | Authenticated user (own orders) |

### Admin Endpoints (Admin Role Required)

| Endpoint Pattern | Methods | Access |
|-----------------|---------|--------|
| `/api/admin/*` | ALL | Admin role |
| `/api/upload` | POST | Admin session OR API key |

## Enforcement Layers

### Layer 1: Middleware (Edge Runtime)

```typescript
// src/middleware.ts
// Runs before any route handler
if (pathname.startsWith("/admin")) {
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin-login");
  }
}
```

- Protects admin pages (not API routes)
- Protects mutating API operations on specific routes
- Edge-compatible — no database access

### Layer 2: API Route Guards

```typescript
// Every admin API route
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session; // Unauthorized
  // ... proceed with operation
}
```

### Layer 3: Data Isolation

- Customer orders filtered by `userId`
- Admin users filtered by `isActive: true`
- Content filtered by `isPublished: true` / `isActive: true` for public endpoints

## Upload Endpoint Dual Auth

The upload endpoint (`/api/upload`) supports two authentication methods:

```typescript
// Method 1: Admin session
const session = await auth();
if (session?.user?.role === "admin") { /* allow */ }

// Method 2: API key header
const adminKey = req.headers.get("x-admin-key");
if (adminKey === process.env.ADMIN_API_KEY) { /* allow */ }
```

This allows both browser-based admin uploads and programmatic API uploads.

## Security Considerations

1. **No fine-grained permissions** — Admin has full access to everything
2. **No resource-level authorization** — Any admin can modify any resource
3. **Customer isolation** — Orders are scoped to `userId` via JWT
4. **No audit logging** — Mutations are not tracked by who performed them

## Future Improvements

- Implement granular permissions per module (products, orders, content)
- Add audit trail for admin actions
- Implement rate limiting on public form endpoints
- Add CSRF token verification for mutations
- Consider API key rotation mechanism
