# API Structure & Versioning

## Current API Strategy

The application uses **Next.js App Router API routes** without explicit versioning. All endpoints are under `/api/` with logical grouping by domain.

### URL Structure

```
/api/auth/*           → Authentication endpoints
/api/admin/*          → Protected admin CRUD endpoints
/api/{resource}       → Public read endpoints
/api/{resource}/[id]  → Public single-resource endpoints
```

## Complete API Reference

### Authentication (`/api/auth/`)

| Method | Endpoint | Request Body | Response | Auth |
|--------|----------|-------------|----------|------|
| POST | `/api/auth/login` | `{ email, password }` | `{ success, user, token }` | None |
| POST | `/api/auth/register` | `{ name, email, phone, password }` | `{ success, user }` | None |
| GET | `/api/auth/me` | — | `{ success, user }` | User JWT |
| POST | `/api/auth/user-logout` | — | `{ success }` | User JWT |
| POST | `/api/auth/logout` | — | `{ success }` | Admin session |
| * | `/api/auth/[...nextauth]` | — | NextAuth handlers | — |

### Public Endpoints

| Method | Endpoint | Query Params | Response |
|--------|----------|-------------|----------|
| GET | `/api/home` | — | Homepage data (hero, initiatives, CTA) |
| GET | `/api/about` | — | About page sections |
| GET | `/api/products` | — | Active products list |
| GET | `/api/categories` | — | Product categories |
| GET | `/api/blogs` | `search, tag, page, limit` | Published blogs + tags |
| GET | `/api/blogs/[slug]` | — | Single blog post |
| GET | `/api/stories` | `page, limit` | Published stories |
| GET | `/api/stories/[slug]` | — | Single story |
| GET | `/api/careers` | — | Careers page + job listings |
| GET | `/api/resources` | — | Published resources |
| GET | `/api/services` | — | Active services |
| GET | `/api/services/[id]` | — | Single service |
| GET | `/api/testimonials` | — | Testimonials |
| GET | `/api/initiatives` | — | Initiative items |
| GET | `/api/distributors` | — | Active distributors |
| POST | `/api/contact` | `{ name, email, phone, message }` | Submit contact form |
| POST | `/api/distributors` | `{ name, email, phone, ... }` | Submit distributor application |
| POST | `/api/careers` | Application data | Submit career application |
| POST | `/api/orders/create` | Order data | Create order (auth required) |
| GET | `/api/orders/[id]` | — | Order by ID or orderNumber |

### Page Content Endpoints

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/navbar-settings` | Navigation configuration |
| GET | `/api/footer-page` | Footer content |
| GET | `/api/contact-page` | Contact page content |
| GET | `/api/distributors-page` | Distributors page content |
| GET | `/api/privacy-policy-page` | Privacy policy HTML |
| GET | `/api/terms-conditions-page` | T&C HTML |

### Admin CRUD Endpoints (`/api/admin/`)

All require admin session authentication.

| Resource | GET (List) | POST (Create) | PUT (Update) | DELETE |
|----------|-----------|---------------|-------------|--------|
| `/api/admin/products` | List all | Create + image | — | — |
| `/api/admin/products/[id]` | — | — | Update + image | Delete + cleanup |
| `/api/admin/blogs` | List all | Create + image | — | — |
| `/api/admin/blogs/[id]` | — | — | Update | Delete |
| `/api/admin/stories` | List all | Create + image | — | — |
| `/api/admin/stories/[id]` | — | — | Update | Delete |
| `/api/admin/careers` | Get page | Update page | — | — |
| `/api/admin/careers/[id]` | — | — | Update job | Delete job |
| `/api/admin/orders` | List (filterable) | — | — | — |
| `/api/admin/orders/[id]` | — | — | Update status | Delete |
| `/api/admin/categories` | List all | Create | — | — |
| `/api/admin/categories/[id]` | — | — | Update | Delete |
| `/api/admin/distributors` | List all | Create + image | — | — |
| `/api/admin/distributors/[id]` | — | — | Update | Delete |
| `/api/admin/contact-leads` | List all | — | — | — |
| `/api/admin/contact-leads/[id]` | — | — | PATCH (resolve) | Delete |
| `/api/admin/resources` | List all | Create | — | — |
| `/api/admin/resources/[id]` | — | — | Update | Delete |
| `/api/admin/services` | List all | Create/Update | — | — |

### Content Page Management (Admin)

| Endpoint | Methods | Model |
|----------|---------|-------|
| `/api/admin/home` | GET, POST | Dashboard |
| `/api/admin/about` | GET, POST | About |
| `/api/admin/dashboard` | GET, POST | Dashboard |
| `/api/admin/navbar-settings` | GET, POST | NavbarSettings |
| `/api/admin/footer-page` | GET, POST | FooterPage |
| `/api/admin/contact-page` | GET, POST | ContactPage |
| `/api/admin/distributors-page` | GET, POST | DistributorsPage |
| `/api/admin/privacy-policy-page` | GET, POST | PrivacyPolicyPage |
| `/api/admin/terms-conditions-page` | GET, POST | TermsConditionsPage |

### Utility Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload` | File upload to Cloudinary |
| GET | `/api/test-db` | Database connection test |
| POST | `/api/admin/resources/seed` | Seed resources data |

## Response Format Convention

```typescript
// Success
{
  success: true,
  data: T,
  message?: string
}

// Error
{
  success: false,
  error: string,
  code?: string,        // e.g., "VALIDATION_ERROR", "NOT_FOUND"
  details?: Array<{     // Zod validation errors
    path: string,
    message: string
  }>,
  requestId?: string    // For debugging
}
```

## HTTP Status Codes Used

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (resource created) |
| 400 | Validation error, malformed request |
| 401 | Unauthorized (missing/invalid auth) |
| 404 | Resource not found |
| 405 | Method not allowed |
| 500 | Internal server error |

## Future Versioning Strategy

When API versioning is needed:

```
/api/v1/products    → Current version
/api/v2/products    → New version with breaking changes
```

Migration steps:
1. Create versioned route group: `src/app/api/v1/`
2. Move current routes under v1
3. Create v2 routes for breaking changes
4. Maintain v1 for backward compatibility
5. Deprecate v1 with sunset headers
