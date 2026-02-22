# API Integration

## Overview

The frontend communicates with the backend through Next.js API routes. Server components use `fetch` directly; client components use `axios` or `fetch`.

## Base URL Resolution

**File**: `src/lib/getBaseUrl.ts`

```typescript
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
```

## Request Patterns

### Pattern 1: Server Component Fetch

```tsx
// Used in page.tsx (server components)
const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
const { data } = await res.json();
```

### Pattern 2: Client-Side Axios

```tsx
// Used in client components for mutations
const base = getBaseUrl();
const res = await axios.post(`${base}/api/contact`, formData);
```

### Pattern 3: FormData Upload

```tsx
// Used for file uploads (admin)
const formData = new FormData();
formData.append("name", name);
formData.append("image", file);

const res = await fetch("/api/admin/products", {
  method: "POST",
  body: formData,
  // No Content-Type header — browser sets multipart boundary
});
```

### Pattern 4: Query Parameters

```tsx
// Filtering and pagination
const params = new URLSearchParams({
  status: "SHIPPED",
  page: "1",
  limit: "20",
  search: searchTerm,
});
const res = await fetch(`/api/admin/orders?${params}`);
```

## Response Format

All API routes follow a consistent response shape:

```typescript
// Success
{ success: true, data: T, message?: string }

// Error
{ success: false, error: string, code?: string, details?: ValidationError[] }
```

## Public API Endpoints Used by Frontend

| Endpoint | Method | Component | Purpose |
|----------|--------|-----------|---------|
| `/api/home` | GET | HomePageContent | Homepage data |
| `/api/products` | GET | ProductsPageClient | Product catalog |
| `/api/categories` | GET | ProductsPageClient | Category filter |
| `/api/about` | GET | About page | About page sections |
| `/api/blogs` | GET | BlogPageClient | Blog listing |
| `/api/blogs/[slug]` | GET | Blog detail page | Single blog |
| `/api/stories` | GET | StoriesPageClient | Stories listing |
| `/api/stories/[slug]` | GET | Story detail page | Single story |
| `/api/careers` | GET | Careers page | Job listings |
| `/api/contact` | POST | ContactPageClient | Submit contact form |
| `/api/contact-page` | GET | Contact page | Page content |
| `/api/distributors` | GET/POST | DistributorsPageClient | Distributor data/apply |
| `/api/distributors-page` | GET | Distributors page | Page content |
| `/api/resources` | GET | ResourcesPageClient | Resources listing |
| `/api/services` | GET | Home/Services | Services data |
| `/api/testimonials` | GET | TestimonialsSection | Testimonials |
| `/api/navbar-settings` | GET | Navbar | Nav configuration |
| `/api/footer-page` | GET | Footer | Footer content |
| `/api/auth/login` | POST | LoginForm | User login |
| `/api/auth/register` | POST | SignupForm | User registration |
| `/api/auth/me` | GET | UserAuthContext | Current user |
| `/api/auth/user-logout` | POST | UserAuthContext | User logout |
| `/api/orders/create` | POST | CheckoutDrawer | Create order |
| `/api/orders/[id]` | GET | OrderSuccess | Order details |

## Admin API Endpoints

All admin endpoints require authenticated session with `admin` role.

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/admin/products` | GET, POST | List/create products |
| `/api/admin/products/[id]` | PUT, DELETE | Update/delete product |
| `/api/admin/blogs` | GET, POST | List/create blogs |
| `/api/admin/blogs/[id]` | PUT, DELETE | Update/delete blog |
| `/api/admin/stories` | GET, POST | List/create stories |
| `/api/admin/stories/[id]` | PUT, DELETE | Update/delete story |
| `/api/admin/careers` | GET, POST | Manage career listings |
| `/api/admin/careers/[id]` | PUT, DELETE | Update/delete career |
| `/api/admin/orders` | GET | List orders (filterable) |
| `/api/admin/orders/[id]` | PUT, DELETE | Update/delete order |
| `/api/admin/categories` | GET, POST | List/create categories |
| `/api/admin/categories/[id]` | PUT, DELETE | Update/delete category |
| `/api/admin/contact-leads` | GET | View contact submissions |
| `/api/admin/contact-leads/[id]` | PATCH, DELETE | Resolve/delete lead |
| `/api/admin/distributors` | GET, POST | Manage distributors |
| `/api/admin/distributors/[id]` | PUT, DELETE | Update/delete distributor |
| `/api/admin/home` | GET, POST | Manage homepage content |
| `/api/admin/about` | GET, POST | Manage about page |
| `/api/admin/navbar-settings` | GET, POST | Manage navigation |
| `/api/admin/footer-page` | GET, POST | Manage footer |
| `/api/admin/contact-page` | GET, POST | Manage contact page |
| `/api/admin/distributors-page` | GET, POST | Manage distributors page |
| `/api/admin/privacy-policy-page` | GET, POST | Manage privacy policy |
| `/api/admin/terms-conditions-page` | GET, POST | Manage T&C |
| `/api/admin/services` | GET, POST | Manage services |
| `/api/admin/resources` | GET, POST | Manage resources |
| `/api/admin/resources/[id]` | PUT, DELETE | Update/delete resource |
| `/api/admin/dashboard` | GET, POST | Dashboard data |
| `/api/upload` | POST | File upload (Cloudinary) |

## Error Handling

```tsx
try {
  const res = await axios.post(url, data);
  toast.success("Submitted successfully");
} catch (err) {
  const message = err instanceof Error ? err.message : "Something went wrong";
  toast.error(message);
}
```

All API errors are caught and displayed via Sonner toast notifications. Network failures show a generic user-friendly message.

## Cache Strategy

- **Server components**: `{ cache: "no-store" }` for dynamic data, default caching for static
- **Admin mutations**: Call `revalidatePath()` after create/update/delete operations
- **Client polling**: HomePageContent polls every 120 seconds for fresh data
- **Static pages**: Blog listing, Stories listing, Resources are statically generated at build time
