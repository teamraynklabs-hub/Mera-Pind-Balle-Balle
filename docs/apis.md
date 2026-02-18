# Mera Pind Balle Balle — API Documentation

Base URL: `http://localhost:3000` (dev) / `https://merapindballeballe.com` (prod)

---

## Authentication

### User Auth
- JWT tokens stored in HttpOnly secure cookies (`user-token`, 7-day expiry)
- Send cookies automatically via browser or include `Cookie` header manually in Postman

### Admin Auth
- NextAuth v5 session-based authentication
- Admin routes check `requireAdmin()` which verifies session `role === "admin"`
- Login via `/admin` page, session cookies sent automatically

---

## Public API Routes

### GET /api/home
Aggregated home page data (hero, initiatives, featured products, impact, testimonials, story section, categories).

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "string",
      "subtitle": "string",
      "image": "string (URL or /path)",
      "primaryCTA": { "label": "string", "link": "string" },
      "secondaryCTA": { "label": "string", "link": "string" }
    },
    "initiatives": [{ "title": "string", "description": "string" }],
    "impact": [{ "label": "string", "value": "string" }],
    "cta": {
      "title": "string",
      "description": "string",
      "buttonText": "string",
      "link": "string"
    },
    "testimonials": [{
      "name": "string",
      "role": "string",
      "quote": "string",
      "avatar": "string (optional)"
    }],
    "storySection": {
      "title": "string",
      "description": "string",
      "image": "string",
      "link": "string"
    },
    "featuredProducts": [{
      "_id": "string",
      "name": "string",
      "price": 100,
      "image": "string",
      "description": "string",
      "category": "string"
    }],
    "categories": ["Category A", "Category B"]
  }
}
```

---

### GET /api/dashboard
Full dashboard configuration. Returns fallback defaults if DB fails.

**Response:**
```json
{
  "success": true,
  "data": { "hero": {}, "initiatives": [], "popularProducts": [], "impact": [], "cta": {}, "testimonials": [], "storySection": {}, "footer": {} },
  "warning": "string (optional — present when using fallback)"
}
```

---

### GET /api/products
All active products.

**Response:**
```json
{
  "success": true,
  "data": [{
    "_id": "string",
    "name": "string",
    "price": 100,
    "description": "string",
    "image": "string (Cloudinary URL)",
    "isActive": true
  }]
}
```

---

### GET /api/blogs
Published blogs with pagination and search.

**Query Params:** `?search=keyword&page=1&limit=6`

**Response:**
```json
{
  "blogs": [{
    "_id": "string",
    "title": "string",
    "slug": "string",
    "excerpt": "string",
    "content": "string (HTML)",
    "image": "string",
    "isPublished": true,
    "createdAt": "ISO date"
  }],
  "total": 25,
  "page": 1,
  "limit": 6
}
```

---

### GET /api/blogs/[slug]
Single published blog by slug.

**Response:**
```json
{
  "success": true,
  "data": { "_id": "string", "title": "string", "slug": "string", "content": "string", "image": "string", "createdAt": "ISO date" }
}
```

---

### GET /api/stories
All published stories.

**Response:**
```json
{
  "success": true,
  "data": [{ "_id": "string", "title": "string", "slug": "string", "excerpt": "string", "content": "string", "image": "string" }]
}
```

---

### GET /api/stories/[slug]
Single published story by slug.

**Response:**
```json
{
  "success": true,
  "data": { "_id": "string", "title": "string", "slug": "string", "content": "string", "image": "string" }
}
```

---

### GET /api/services
All active services.

**Response:**
```json
{
  "success": true,
  "data": [{ "_id": "string", "title": "string", "description": "string", "image": "string" }]
}
```

---

### GET /api/about
Active about page content.

**Response:**
```json
{
  "success": true,
  "data": { "_id": "string", "isActive": true, "...about page fields" }
}
```

---

### GET /api/resources
Downloadable resources/documents.

**Response:**
```json
{ "documents": [{ "title": "string", "desc": "string", "fileUrl": "string" }] }
```

---

### GET /api/careers
Careers page with job postings.

**Response:**
```json
{
  "success": true,
  "data": { "jobs": [{ "title": "string", "description": "string", "location": "string", "type": "string" }] }
}
```

---

### POST /api/contact
Submit contact form.

**Body (JSON):**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "message": "string (required)"
}
```

**Response (201):**
```json
{ "success": true, "message": "Message sent successfully" }
```

---

### GET /api/distributors
Distributor page content.

### POST /api/distributors
Submit distributor application.

**Body (JSON):**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "website": "string (optional)"
}
```

---

## User Authentication Routes

### POST /api/auth/register
Register new user.

**Body (JSON):**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (required, 10 digits)",
  "password": "string (required, min 6 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { "id": "string", "name": "string", "email": "string", "phone": "string" }
}
```
Sets HttpOnly cookie: `user-token` (7 days)

---

### POST /api/auth/login
User login.

**Body (JSON):**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { "id": "string", "name": "string", "email": "string", "phone": "string", "address": {} }
}
```
Sets HttpOnly cookie: `user-token` (7 days)

---

### GET /api/auth/me
Get current user profile. Requires `user-token` cookie.

**Response (200):**
```json
{
  "success": true,
  "user": { "id": "string", "name": "string", "email": "string", "phone": "string", "address": {} }
}
```

---

### POST /api/auth/user-logout
Logout user. Clears `user-token` cookie.

**Response (200):**
```json
{ "success": true, "message": "Logged out" }
```

---

## Order Routes

### POST /api/orders/create
Create order. **Requires user login** (JWT in cookie).

**Body (JSON):**
```json
{
  "customer": {
    "name": "string (required)",
    "email": "string (required)",
    "phone": "string (required)",
    "address": {
      "line1": "string (required)",
      "line2": "string (optional)",
      "city": "string (required)",
      "state": "string (required)",
      "pincode": "string (required)"
    }
  },
  "items": [
    { "productId": "string (required)", "quantity": 1 }
  ],
  "paymentMethod": "COD"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "orderNumber": "MPBB-20260219-0001",
    "total": 500,
    "estimatedDelivery": "ISO date"
  }
}
```

> Server re-validates product prices from DB. Never trusts client-side prices.

---

### GET /api/orders/[id]
Get order by `_id` or `orderNumber`.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "orderNumber": "string",
    "customer": {},
    "items": [],
    "total": 500,
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "status": "PLACED",
    "estimatedDelivery": "ISO date",
    "createdAt": "ISO date"
  }
}
```

---

## Admin Routes

> All admin routes require active NextAuth session with `role: "admin"`. Use the admin login page at `/admin` to authenticate.

### POST /api/admin/dashboard
Update full dashboard configuration.

**Body (JSON):**
```json
{
  "hero": {
    "title": "string",
    "subtitle": "string",
    "image": "string (URL or /path)",
    "primaryCTA": { "label": "string", "link": "string" },
    "secondaryCTA": { "label": "string", "link": "string" }
  },
  "initiatives": [{ "title": "string", "description": "string" }],
  "popularProducts": [{ "title": "string", "description": "string", "image": "string" }],
  "impact": [{ "label": "string", "value": "string" }],
  "cta": { "title": "string", "description": "string", "buttonText": "string", "link": "string" },
  "testimonials": [{ "name": "string", "role": "string", "quote": "string", "avatar": "string" }],
  "storySection": { "title": "string", "description": "string", "image": "string", "link": "string" },
  "footer": { "supportLinks": [], "quickLinks": [], "legalLinks": [], "socialLinks": [] },
  "isActive": true
}
```

---

### GET /api/admin/products
Fetch all active products (admin view).

### POST /api/admin/products
Create new product.

**Body (FormData):**
| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| description | string | Yes |
| price | number | Yes |
| isActive | boolean | No (default true) |
| image | File | Yes |

Uploads image to Cloudinary `mpbb/products` folder.

---

### PUT /api/admin/products/[id]
Update product. Body: FormData (same fields, image optional).

### DELETE /api/admin/products/[id]
Delete product and remove Cloudinary image.

---

### GET /api/admin/blogs
Fetch all blogs (published + unpublished).

### POST /api/admin/blogs
Create new blog.

**Body (FormData):**
| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| excerpt | string | Yes |
| content | string (HTML) | Yes |
| slug | string | No (auto-generated) |
| isPublished | boolean | No |
| image | File | Yes |

### PUT /api/admin/blogs/[id]
Update blog. Body: FormData (same fields, image optional).

### DELETE /api/admin/blogs/[id]
Delete blog and remove image.

---

### GET /api/admin/stories
Fetch all stories.

### POST /api/admin/stories
Create new story.

**Body (FormData):**
| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| excerpt | string | Yes |
| content | string (HTML) | Yes |
| isPublished | boolean | No |
| image | File | Yes |

### PUT /api/admin/stories/[id]
Update story. Body: FormData (same fields, image optional).

### DELETE /api/admin/stories/[id]
Delete story and remove image.

---

### GET /api/admin/orders
Fetch orders with filtering and pagination.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED |
| paymentStatus | string | PENDING, PAID, FAILED, REFUNDED |
| paymentMethod | string | COD, ONLINE |
| search | string | Search orderNumber, customer name, email, phone |
| from | date | Filter orders created after this date |
| to | date | Filter orders created before this date |
| page | number | Page number (default 1) |
| limit | number | Items per page (default 20) |

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [],
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### GET /api/admin/orders/[id]
Fetch single order detail.

### PATCH /api/admin/orders/[id]
Update order status.

**Body (JSON):**
```json
{
  "status": "SHIPPED",
  "paymentStatus": "PAID"
}
```

---

### GET /api/admin/contact-leads
Fetch all contact form submissions (sorted newest first).

---

### GET/PATCH /api/admin/about
Fetch or update about page content.

---

### GET/POST /api/admin/careers
Fetch careers page or add new job posting.

### PUT/DELETE /api/admin/careers/[id]
Update or delete job posting.

---

### GET/POST /api/admin/distributors
Fetch all distributors or create new one.

### GET/PATCH/DELETE /api/admin/distributors/[id]
Fetch, update, or delete distributor.

---

### GET/PATCH /api/admin/distributors-page
Fetch or update distributors page configuration.

---

### GET/POST /api/admin/resources
Fetch or add downloadable resources.

### DELETE /api/admin/resources/[id]
Delete resource.

---

### POST /api/admin/services
Create or manage services.

---

### POST /api/upload
Upload image to Cloudinary.

**Auth:** Admin API key header (`x-admin-key`) OR NextAuth admin session.

**Body (FormData):**
| Field | Type | Required |
|-------|------|----------|
| file | File | Yes |

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "secure_url": "https://res.cloudinary.com/..."
}
```

---

## Error Response Format

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error (optional)",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

**Common Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error / Bad request |
| 401 | Unauthorized (not logged in or not admin) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, etc.) |
| 500 | Internal server error |

---

## Postman Setup Tips

1. **Base URL Variable:** Set `{{BASE_URL}}` = `http://localhost:3000`
2. **User Auth:** Call POST `/api/auth/login` first — cookie is auto-stored
3. **Admin Auth:** Login via browser at `/admin`, then copy session cookies to Postman
4. **FormData Routes:** Use "form-data" body type for product/blog/story creation
5. **JSON Routes:** Use "raw" body type with JSON content type
