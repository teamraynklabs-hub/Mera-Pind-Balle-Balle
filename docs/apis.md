# Mera Pind Balle Balle — API Documentation

Base URL: `http://localhost:3000` (dev) / `https://merapindballeballe.com` (prod)

---

## Authentication

### User Auth
- JWT tokens stored in HttpOnly secure cookies (`user-token`, 7-day expiry)
- Send cookies automatically via browser or include `Cookie` header in Postman

### Admin Auth
- NextAuth v5 session-based authentication
- Admin routes check `requireAdmin()` which verifies session `role === "admin"`
- Login via `/admin` page, session cookies sent automatically

---

## Seed Data Examples (Postman-Ready)

### POST /api/admin/dashboard

Create/update full dashboard configuration. **Requires admin session.**

```json
{
  "hero": {
    "title": "Empowering Villages Through Innovation & Sustainable Products",
    "subtitle": "Mera Pind Balle Balle works with rural communities to create quality products, generate employment, and encourage sustainable growth.",
    "image": "https://res.cloudinary.com/yourcloud/image/upload/v1/mpbb/hero.jpg",
    "primaryCTA": { "label": "Explore Products", "link": "/products" },
    "secondaryCTA": { "label": "Our Initiatives", "link": "/services" }
  },
  "initiatives": [
    { "title": "Skill Development", "description": "Training villagers in craft, digital literacy, and entrepreneurship." },
    { "title": "Women Empowerment", "description": "Helping rural women build independent and sustainable businesses." },
    { "title": "Sustainable Products", "description": "Organic, handmade, eco-friendly items crafted by communities." }
  ],
  "popularProducts": [
    { "title": "Organic Jaggery", "description": "Pure village-made jaggery with no chemicals.", "image": "https://res.cloudinary.com/yourcloud/image/upload/v1/mpbb/products/jaggery.jpg" },
    { "title": "Handcrafted Baskets", "description": "Made by artisans using natural materials.", "image": "https://res.cloudinary.com/yourcloud/image/upload/v1/mpbb/products/baskets.jpg" }
  ],
  "impact": [
    { "label": "Villagers Empowered", "value": "2500+" },
    { "label": "Women-Owned Units", "value": "120+" },
    { "label": "Product Lines", "value": "65+" }
  ],
  "cta": {
    "title": "Want to Work With Us?",
    "description": "Join us as a distributor, volunteer, or partner NGO.",
    "buttonText": "Get in Touch",
    "link": "/contact"
  },
  "testimonials": [
    {
      "name": "Gurpreet Kaur",
      "role": "Women Entrepreneur, Patiala",
      "quote": "Mera Pind Balle Balle helped me turn my pickle-making hobby into a full-time business. I now employ 5 other women!",
      "avatar": ""
    },
    {
      "name": "Ramesh Kumar",
      "role": "Organic Farmer, Hoshiarpur",
      "quote": "Their training programs taught me organic farming techniques that doubled my yield and gave me access to urban markets.",
      "avatar": ""
    },
    {
      "name": "Sunita Devi",
      "role": "Artisan, Ludhiana",
      "quote": "I learned basket weaving through their skill program. Now my handmade baskets are sold across India through this platform.",
      "avatar": ""
    }
  ],
  "storySection": {
    "title": "Our Story & Mission",
    "description": "From a small village initiative to empowering thousands of rural families — learn about the journey of Mera Pind Balle Balle.",
    "image": "https://res.cloudinary.com/yourcloud/image/upload/v1/mpbb/story.jpg",
    "link": "/stories"
  },
  "footer": {
    "supportLinks": [
      { "label": "Resources", "link": "/resources" },
      { "label": "Distributors", "link": "/distributors" },
      { "label": "Careers", "link": "/careers" },
      { "label": "Contact", "link": "/contact" }
    ],
    "quickLinks": [
      { "label": "About Us", "link": "/about" },
      { "label": "Services", "link": "/services" },
      { "label": "Products", "link": "/products" },
      { "label": "Blog", "link": "/blog" }
    ],
    "legalLinks": [
      { "label": "Privacy Policy", "link": "/privacy-policy" },
      { "label": "Terms & Conditions", "link": "/terms-conditions" }
    ],
    "socialLinks": [
      { "platform": "facebook", "link": "https://facebook.com/merapindballeballe" },
      { "platform": "instagram", "link": "https://instagram.com/merapindballeballe" },
      { "platform": "twitter", "link": "https://x.com/Merapindballe" },
      { "platform": "linkedin", "link": "https://linkedin.com/in/merapind-balleballe" }
    ]
  },
  "isActive": true
}
```

---

### POST /api/admin/products

Create a new product. **Requires admin session. Body: FormData.**

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| description | string | Yes |
| price | number | Yes |
| category | string | No |
| stock | number | No (default 0) |
| isActive | boolean | No (default true) |
| isFeatured | boolean | No (default false) |
| image | File | Yes |

**Example seed (use form-data in Postman):**

```
name: "Organic Honey"
description: "Pure handmade village honey collected from rural beekeepers. No chemicals, no processing — just natural sweetness straight from the hive."
price: 299
category: "Food"
stock: 50
isFeatured: true
image: [Upload file]
```

```
name: "Handwoven Basket"
description: "Traditional handwoven basket made from natural bamboo and grass by skilled rural artisans."
price: 450
category: "Handicrafts"
stock: 30
image: [Upload file]
```

```
name: "Organic Jaggery"
description: "Pure unprocessed jaggery from sugarcane grown in village farms. Rich in iron and minerals."
price: 199
category: "Food"
stock: 100
isFeatured: true
image: [Upload file]
```

```
name: "Handmade Soap"
description: "Natural herbal soap made with neem, turmeric, and aloe vera by women self-help groups."
price: 120
category: "Personal Care"
stock: 75
image: [Upload file]
```

```
name: "Khadi Cloth Bag"
description: "Eco-friendly reusable bag made from handspun khadi fabric. Durable and stylish."
price: 250
category: "Textiles"
stock: 40
image: [Upload file]
```

---

## Public API Routes

### GET /api/home

Aggregated home page data.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": { "title": "...", "subtitle": "...", "image": "https://...", "primaryCTA": {}, "secondaryCTA": {} },
    "initiatives": [{ "title": "...", "description": "..." }],
    "impact": [{ "label": "...", "value": "..." }],
    "cta": { "title": "...", "description": "...", "buttonText": "...", "link": "..." },
    "testimonials": [{ "name": "...", "role": "...", "quote": "...", "avatar": "..." }],
    "storySection": { "title": "...", "description": "...", "image": "...", "link": "..." },
    "featuredProducts": [{ "_id": "...", "name": "...", "price": 299, "image": "...", "description": "...", "category": "Food" }],
    "categories": ["Food", "Handicrafts", "Personal Care", "Textiles"]
  }
}
```

---

### GET /api/dashboard

Full dashboard configuration from DB.

**Response:**
```json
{
  "success": true,
  "data": { "hero": {}, "initiatives": [], "popularProducts": [], "impact": [], "cta": {}, "testimonials": [], "storySection": {}, "footer": {} }
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
    "_id": "665abc...",
    "name": "Organic Honey",
    "price": 299,
    "description": "Pure handmade village honey...",
    "image": "https://res.cloudinary.com/...",
    "category": "Food",
    "stock": 50,
    "isActive": true,
    "isFeatured": true
  }]
}
```

---

### GET /api/blogs

Published blogs with pagination. `?search=keyword&page=1&limit=6`

**Response:**
```json
{
  "blogs": [{ "_id": "...", "title": "...", "slug": "...", "excerpt": "...", "content": "...", "image": "...", "createdAt": "..." }],
  "total": 25,
  "page": 1,
  "limit": 6
}
```

### GET /api/blogs/[slug]

Single blog by slug. **Response:** `{ "success": true, "data": { ... } }`

---

### GET /api/stories

All published stories. **Response:** `{ "success": true, "data": [...] }`

### GET /api/stories/[slug]

Single story by slug. **Response:** `{ "success": true, "data": { ... } }`

---

### GET /api/services

All active services. **Response:** `{ "success": true, "data": [...] }`

### GET /api/about

About page content. **Response:** `{ "success": true, "data": { ... } }`

### GET /api/resources

Downloadable resources. **Response:** `[{ "title": "...", "link": "...", "description": "..." }]`

### GET /api/careers

Careers page and job postings.

---

### POST /api/contact

Submit contact form.

```json
{
  "name": "Rajesh Singh",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "message": "I am interested in becoming a distributor in Amritsar."
}
```

**Response (201):** `{ "success": true, "message": "Message sent successfully. We'll get back to you soon!" }`

---

### POST /api/distributors

Submit distributor application.

```json
{
  "name": "Punjab Distributors Pvt Ltd",
  "email": "info@punjabdist.com",
  "phone": "9812345678",
  "website": "https://punjabdist.com"
}
```

---

## User Authentication Routes

### POST /api/auth/register

```json
{
  "name": "Amanpreet Kaur",
  "email": "aman@example.com",
  "phone": "9876543210",
  "password": "securepass123"
}
```

**Response:** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "phone": "..." } }`

Sets HttpOnly cookie: `user-token` (7 days)

---

### POST /api/auth/login

```json
{ "email": "aman@example.com", "password": "securepass123" }
```

**Response:** `{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "phone": "...", "address": {} } }`

---

### GET /api/auth/me

Requires `user-token` cookie. Returns current user profile.

### POST /api/auth/user-logout

Clears `user-token` cookie.

---

## Order Routes

### POST /api/orders/create

**Requires user login** (JWT in cookie). Server re-validates product prices from DB.

```json
{
  "customer": {
    "name": "Amanpreet Kaur",
    "email": "aman@example.com",
    "phone": "9876543210",
    "address": {
      "line1": "House No. 42, Sector 17",
      "line2": "Near Gurudwara Sahib",
      "city": "Chandigarh",
      "state": "Punjab",
      "pincode": "160017"
    }
  },
  "items": [
    { "productId": "665abc123...", "quantity": 2 },
    { "productId": "665def456...", "quantity": 1 }
  ],
  "paymentMethod": "COD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "orderNumber": "MPBB-20260219-0001",
    "total": 748,
    "estimatedDelivery": "2026-02-26T00:00:00.000Z"
  }
}
```

---

### GET /api/orders/[id]

Get order by `_id` or `orderNumber`.

---

## Admin Routes

> All require active NextAuth session with `role: "admin"`.

### GET /api/admin/products

All active products (admin view).

### PUT /api/admin/products/[id]

Update product. **Body: FormData** (same fields as POST, image optional). Now supports `category`, `stock`, `isFeatured`.

### DELETE /api/admin/products/[id]

Delete product and remove Cloudinary image.

---

### GET/POST /api/admin/blogs

Fetch all or create new blog. **Body: FormData** with title, excerpt, content, slug, isPublished, image.

### PUT/DELETE /api/admin/blogs/[id]

Update or delete blog.

---

### GET/POST /api/admin/stories

Fetch all or create new story. **Body: FormData** with title, excerpt, content, isPublished, image.

### PUT/DELETE /api/admin/stories/[id]

Update or delete story.

---

### GET /api/admin/orders

Fetch orders with filtering. **Query:** `?status=PLACED&paymentStatus=PENDING&search=MPBB&page=1&limit=20`

### PATCH /api/admin/orders/[id]

Update order status: `{ "status": "SHIPPED", "paymentStatus": "PAID" }`

---

### GET /api/admin/contact-leads

All contact form submissions (newest first).

### GET/PATCH /api/admin/about

Fetch or update about page.

### GET/POST /api/admin/careers + PUT/DELETE /api/admin/careers/[id]

Manage job postings.

### GET/POST /api/admin/distributors + GET/PATCH/DELETE /api/admin/distributors/[id]

Manage distributors.

### GET/PATCH /api/admin/distributors-page

Manage distributors page content (benefits, requirements, banner).

### GET/POST /api/admin/resources + DELETE /api/admin/resources/[id]

Manage downloadable resources.

---

### POST /api/upload

Upload image to Cloudinary. **Auth:** Admin API key (`x-admin-key` header) OR NextAuth session.

**Body: FormData** with `file` field.

**Response:** `{ "success": true, "url": "https://res.cloudinary.com/...", "secure_url": "https://res.cloudinary.com/..." }`

---

## Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error (optional)",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

## Postman Setup

1. Set variable `{{BASE_URL}}` = `http://localhost:3000`
2. **User Auth:** POST `/api/auth/login` first — cookie auto-stored
3. **Admin Auth:** Login via browser at `/admin`, copy session cookies to Postman
4. **FormData routes:** Use "form-data" body type for product/blog/story creation
5. **JSON routes:** Use "raw" body type with `Content-Type: application/json`
