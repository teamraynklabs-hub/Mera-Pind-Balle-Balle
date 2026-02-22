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
    { "title": "Skill Development", "description": "Training villagers in craft, digital literacy, and entrepreneurship.", "image": "/photo1.png" },
    { "title": "Women Empowerment", "description": "Helping rural women build independent and sustainable businesses.", "image": "/photo1.png" },
    { "title": "Sustainable Products", "description": "Organic, handmade, eco-friendly items crafted by communities.", "image": "/photo1.png" },
    { "title": "Community Growth", "description": "Building stronger villages through education and economic opportunity.", "image": "/photo1.png" }
  ],
  "feedback": [
    { "name": "Gurpreet Kaur", "role": "Women Entrepreneur, Patiala", "quote": "Mera Pind Balle Balle helped me turn my pickle-making hobby into a full-time business.", "avatar": "" },
    { "name": "Ramesh Kumar", "role": "Organic Farmer, Hoshiarpur", "quote": "Their training programs taught me organic farming techniques that doubled my yield.", "avatar": "" }
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
| originalPrice | number | No (default 0) |
| category | string | No |
| stock | number | No (default 0) |
| sku | string | No |
| material | string | No |
| color | string | No |
| weight | string | No |
| story | string | No |
| careInstructions | string | No |
| socialImpact | string | No |
| isActive | boolean | No (default true) |
| isFeatured | boolean | No (default false) |
| image | File | Yes |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "665abc...",
    "name": "Organic Honey",
    "price": 299,
    "originalPrice": 399,
    "image": "https://res.cloudinary.com/...",
    "category": "Food",
    "stock": 50,
    "sku": "MPBB-HONEY-001",
    "material": "",
    "color": "",
    "weight": "500g",
    "story": "Collected by rural beekeepers...",
    "careInstructions": "Store in cool dry place",
    "socialImpact": "Supports 10+ beekeeping families",
    "isActive": true,
    "isFeatured": true
  }
}
```

**Example seed (use form-data in Postman):**

```
name: "Organic Honey"
description: "Pure handmade village honey collected from rural beekeepers. No chemicals, no processing — just natural sweetness straight from the hive."
price: 299
originalPrice: 399
category: "Food"
stock: 50
sku: "MPBB-HONEY-001"
weight: "500g"
story: "Our honey is collected from wild beehives in the forests of Punjab."
socialImpact: "Supports 10+ beekeeping families"
isFeatured: true
image: [Upload file]
```

```
name: "Handwoven Basket"
description: "Traditional handwoven basket made from natural bamboo and grass by skilled rural artisans."
price: 450
category: "Handicrafts"
stock: 30
material: "Bamboo, Natural Grass"
careInstructions: "Keep dry, avoid direct sunlight"
image: [Upload file]
```

```
name: "Organic Jaggery"
description: "Pure unprocessed jaggery from sugarcane grown in village farms. Rich in iron and minerals."
price: 199
category: "Food"
stock: 100
weight: "1kg"
isFeatured: true
image: [Upload file]
```

```
name: "Handmade Soap"
description: "Natural herbal soap made with neem, turmeric, and aloe vera by women self-help groups."
price: 120
originalPrice: 150
category: "Personal Care"
stock: 75
material: "Neem, Turmeric, Aloe Vera"
socialImpact: "Made by women self-help groups"
image: [Upload file]
```

```
name: "Khadi Cloth Bag"
description: "Eco-friendly reusable bag made from handspun khadi fabric. Durable and stylish."
price: 250
category: "Textiles"
stock: 40
material: "Handspun Khadi"
color: "Natural White"
image: [Upload file]
```

### POST /api/admin/blogs

Create a new blog. **Requires admin session. Body: FormData.**

**Example seed (use form-data in Postman):**

```
title: "The Story Behind Block Printing"
excerpt: "Uncover the rich history of block printing, a traditional art form that transforms fabric into masterpieces."
content: "<p>Block printing is one of the oldest and most respected textile arts in India...</p>"
author: "Priya Sharma"
tags: "traditional crafts, heritage textiles"
isPublished: true
image: [Upload file]
```

```
title: "Women Weavers of Rajasthan"
excerpt: "Meet the incredible women artisans of Rajasthan keeping centuries-old weaving traditions alive."
content: "<p>In the heart of Rajasthan, generations of women have mastered the art of handloom weaving...</p>"
author: "Priya Sharma"
tags: "rural women, handweaving"
isPublished: true
image: [Upload file]
```

```
title: "Natural Dyes: The Eco-Friendly Choice"
excerpt: "Learn about the sustainable practice of using natural dyes extracted from plants, flowers, and minerals."
content: "<p>Natural dyes have been used for thousands of years across Indian textiles...</p>"
author: "Mera Pind Balle Balle"
tags: "natural dyes, eco-friendly, sustainable fashion"
isPublished: true
image: [Upload file]
```

### POST /api/admin/stories

Create a new story. **Requires admin session. Body: FormData.**

**Example seed (use form-data in Postman):**

```
title: "Sunita's Bamboo Revolution"
excerpt: "How one woman turned humble bamboo into beautiful home decor and created jobs in her village."
content: "<p>Starting with just a few tools and traditional knowledge passed down from her grandmother, Sunita now leads a cooperative of 40 women artisans producing eco-friendly bamboo products...</p>"
name: "Sunita Devi"
author: "Mera Pind Balle Balle"
location: "Assam, Northeast India"
tags: "bamboo crafts, women empowerment, eco-friendly"
featured: true
isPublished: true
image: [Upload file]
```

```
title: "Radha's Natural Skincare Legacy"
excerpt: "Three generations of women preserving traditional beauty recipes and building a sustainable business."
content: "<p>Radha's grandmother's herbal formulas now reach thousands of homes across India...</p>"
name: "Radha Sharma"
author: "Mera Pind Balle Balle"
location: "Manali, Himachal Pradesh"
tags: "skincare, natural products, heritage"
featured: false
isPublished: true
image: [Upload file]
```

```
title: "Meera's Clay Creations: Art from the Earth"
excerpt: "A young widow found hope and purpose through terracotta jewelry making."
content: "<p>Her intricate designs now sell across India, supporting her two children's education...</p>"
name: "Meera Patel"
author: "Mera Pind Balle Balle"
location: "Kutch, Gujarat"
tags: "terracotta, jewelry, artisan"
featured: false
isPublished: true
image: [Upload file]
```

### POST /api/admin/resources

Create a new resource. **Requires admin session. Body: FormData.**

**Example seed (use form-data in Postman):**

```
title: "Product Catalog 2026"
description: "Complete catalog of our handcrafted product collection featuring artisan-made textiles, pottery, and home decor."
category: "Catalog"
fileType: "pdf"
size: "12.5 MB"
isPublished: true
file: [Upload file]
```

```
title: "Women Empowerment Toolkit"
description: "Training material and worksheets for self-help groups."
category: "Education"
fileType: "pdf"
size: "4.1 MB"
isPublished: true
file: [Upload file]
```

```
title: "Annual Impact Report 2025"
description: "Comprehensive report on our social impact, sustainability metrics, and community development efforts."
category: "Report"
fileType: "pdf"
size: "18.7 MB"
isPublished: true
file: [Upload file]
```

---

## Public API Routes

### GET /api/home

Aggregated home page data. Returns fresh data on every request (no caching). The frontend polls this endpoint every 30 seconds for real-time updates when admin saves changes.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": { "title": "...", "subtitle": "...", "image": "https://...", "primaryCTA": {}, "secondaryCTA": {} },
    "initiatives": [{ "title": "...", "description": "...", "image": "/photo1.png" }],
    "feedback": [{ "name": "...", "role": "...", "quote": "...", "avatar": "" }],
    "impact": [{ "label": "...", "value": "..." }],
    "cta": { "title": "...", "description": "...", "buttonText": "...", "link": "..." },
    "storySection": { "title": "...", "description": "...", "image": "...", "link": "..." },
    "featuredProducts": [{ "_id": "...", "name": "...", "price": 299, "image": "...", "description": "...", "category": "Food" }],
    "allProducts": [{ "_id": "...", "name": "...", "price": 299, "image": "...", "description": "...", "category": "Food", "isFeatured": false }]
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
  "data": { "hero": {}, "initiatives": [], "feedback": [], "impact": [], "cta": {}, "storySection": {}, "footer": {} }
}
```

---

### GET /api/products

All active products. The frontend fetches this on mount for real-time updates (client-side hydration).

**Response:**
```json
{
  "success": true,
  "data": [{
    "_id": "665abc...",
    "name": "Organic Honey",
    "price": 299,
    "originalPrice": 399,
    "description": "Pure handmade village honey...",
    "image": "https://res.cloudinary.com/...",
    "category": "Food",
    "stock": 50,
    "sku": "MPBB-HONEY-001",
    "material": "",
    "color": "",
    "weight": "500g",
    "story": "Collected by rural beekeepers...",
    "careInstructions": "Store in cool dry place",
    "socialImpact": "Supports 10+ beekeeping families",
    "isActive": true,
    "isFeatured": true
  }]
}
```

---

### GET /api/categories

All active categories (sorted by name).

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "665abc...", "name": "Food", "slug": "food", "description": "Organic food products", "image": "" },
    { "_id": "665def...", "name": "Handicrafts", "slug": "handicrafts", "description": "Handmade crafts", "image": "" }
  ]
}
```

---

### GET /api/blogs

Published blogs with search, pagination, and popular topics. Returns fresh data on every request (no caching). Frontend polls every 30 seconds for real-time updates.

**Query params:** `?search=keyword&page=1&limit=6`

Search matches against title, tags, and excerpt.

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [{
      "_id": "...",
      "slug": "story-behind-block-printing",
      "title": "The Story Behind Block Printing",
      "excerpt": "Uncover the rich history of block printing...",
      "content": "<p>Full HTML content...</p>",
      "image": "https://res.cloudinary.com/...",
      "author": "Priya Sharma",
      "tags": ["traditional crafts", "heritage textiles"],
      "date": "2026-02-21T00:00:00.000Z",
      "isPublished": true,
      "createdAt": "2026-02-21T10:00:00.000Z"
    }],
    "total": 25,
    "page": 1,
    "limit": 6,
    "topics": ["traditional crafts", "rural women", "handweaving", "eco-friendly"]
  }
}
```

### GET /api/blogs/[slug]

Single published blog by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "slug": "story-behind-block-printing",
    "title": "The Story Behind Block Printing",
    "excerpt": "...",
    "content": "<p>Full HTML content...</p>",
    "image": "https://res.cloudinary.com/...",
    "author": "Priya Sharma",
    "tags": ["traditional crafts", "heritage textiles"],
    "date": "2026-02-21T00:00:00.000Z",
    "createdAt": "2026-02-21T10:00:00.000Z"
  }
}
```

---

### GET /api/stories

Published stories with search, pagination, and popular topics. Returns fresh data on every request (no caching). Frontend polls every 30 seconds for real-time updates.

**Query params:** `?search=keyword&page=1&limit=9`

Search matches against title, tags, excerpt, name, and location.

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [{
      "_id": "...",
      "slug": "sunitas-bamboo-revolution",
      "title": "Sunita's Bamboo Revolution",
      "excerpt": "How one woman turned humble bamboo into beautiful home decor...",
      "content": "<p>Full HTML content...</p>",
      "image": "https://res.cloudinary.com/...",
      "name": "Sunita Devi",
      "author": "Mera Pind Balle Balle",
      "location": "Assam, Northeast India",
      "tags": ["bamboo crafts", "women empowerment"],
      "featured": true,
      "isPublished": true,
      "createdAt": "2026-02-22T10:00:00.000Z"
    }],
    "total": 15,
    "page": 1,
    "limit": 9,
    "topics": ["bamboo crafts", "women empowerment", "organic farming"]
  }
}
```

### GET /api/stories/[slug]

Single published story by slug. Returns fresh data (no caching).

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "slug": "sunitas-bamboo-revolution",
    "title": "Sunita's Bamboo Revolution",
    "excerpt": "How one woman turned humble bamboo...",
    "content": "<p>Full HTML content...</p>",
    "image": "https://res.cloudinary.com/...",
    "name": "Sunita Devi",
    "author": "Mera Pind Balle Balle",
    "location": "Assam, Northeast India",
    "tags": ["bamboo crafts", "women empowerment"],
    "featured": true,
    "createdAt": "2026-02-22T10:00:00.000Z"
  }
}
```

---

### GET /api/services

All active services. **Response:** `{ "success": true, "data": [...] }`

### GET /api/about

About page content (all sections).

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Weaving Dreams into Reality",
      "subtitle": "Mera Pind Balle Balle is more than a marketplace...",
      "image": "https://res.cloudinary.com/..."
    },
    "mission": {
      "title": "Preserving Heritage, Creating Futures",
      "description": "We connect skilled rural women artisans...",
      "image": "https://res.cloudinary.com/..."
    },
    "vision": {
      "title": "A World Where Tradition Meets Opportunity",
      "description": "We envision a future where every rural woman...",
      "image": "https://res.cloudinary.com/..."
    },
    "values": {
      "sectionTitle": "Our Core Values",
      "sectionSubtitle": "The principles that guide everything we do",
      "items": [
        { "icon": "heart", "title": "Women Empowerment", "description": "..." },
        { "icon": "leaf", "title": "Sustainability", "description": "..." }
      ]
    },
    "impact": {
      "sectionTitle": "Our Impact",
      "sectionSubtitle": "Numbers that tell our story",
      "stats": [
        { "number": "500+", "label": "Women Artisans Empowered", "icon": "women" },
        { "number": "50+", "label": "Villages Reached", "icon": "villages" }
      ]
    },
    "team": {
      "sectionTitle": "Meet Our Team",
      "sectionSubtitle": "Passionate individuals working to create meaningful change",
      "members": [
        { "name": "Priya Sharma", "role": "Founder & CEO", "description": "...", "image": "https://..." }
      ]
    },
    "cta": {
      "title": "Join Our Mission",
      "description": "Support rural women artisans...",
      "primaryButtonText": "Shop Collection",
      "primaryButtonLink": "/products",
      "secondaryButtonText": "Read Stories",
      "secondaryButtonLink": "/stories"
    }
  }
}
```

| Code | Meaning |
|------|---------|
| 200 | Success |
| 404 | About data not found |
| 500 | Server error |

### GET /api/contact-page

Contact page content (hero, contact info cards, form section titles, FAQs). Frontend fetches on mount for real-time updates.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Contact Us",
      "subtitle": "Have a question or want to collaborate?...",
      "image": ""
    },
    "contactInfo": {
      "sectionTitle": "Get in Touch With Us",
      "sectionSubtitle": "We would love to hear from you...",
      "items": [
        { "icon": "map-pin", "title": "Address", "lines": ["123 Heritage Lane", "New Delhi, India 110001"], "href": "" },
        { "icon": "phone", "title": "Phone", "lines": ["+91 12345 67890"], "href": "tel:+911234567890" },
        { "icon": "mail", "title": "Email", "lines": ["hello@merapind.com"], "href": "mailto:hello@merapind.com" }
      ]
    },
    "formSection": {
      "title": "Send Us a Message",
      "subtitle": "Fill out the form and our team will respond within 24 hours."
    },
    "faqs": {
      "sectionTitle": "Quick Answers",
      "sectionSubtitle": "Common questions we receive from our customers",
      "items": [
        { "question": "What are your shipping times?", "answer": "We typically ship within 2-3 business days..." },
        { "question": "Do you ship internationally?", "answer": "Currently, we ship only within India..." }
      ]
    }
  }
}
```

---

### GET /api/resources

Published resources with optional category filter and search. Returns fresh data on every request (no caching). Frontend polls every 30 seconds for real-time updates.

**Query params:** `?search=keyword&category=Guide`

Search matches against title, description, and category.

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [{
      "_id": "...",
      "title": "Product Catalog 2026",
      "description": "Complete catalog of our handcrafted product collection.",
      "category": "Catalog",
      "fileType": "pdf",
      "size": "12.5 MB",
      "fileUrl": "https://res.cloudinary.com/...",
      "isPublished": true,
      "createdAt": "2026-02-22T10:00:00.000Z"
    }],
    "categories": ["Catalog", "Guide", "Education", "Report"],
    "total": 12
  }
}
```

### GET /api/careers

Careers page and job postings.

---

### POST /api/contact

Submit contact form. Validated with Zod schema.

```json
{
  "name": "Rajesh Singh",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "message": "I am interested in becoming a distributor in Amritsar."
}
```

**Response (201):** `{ "success": true, "message": "Message sent successfully. We'll get back to you soon!" }`

| Code | Meaning |
|------|---------|
| 201 | Created |
| 400 | Validation error (Zod) |
| 500 | Server error |

---

### GET /api/distributors-page

Distributors page content (hero, benefits, requirements, steps, form section). Frontend fetches on mount for real-time updates.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Become a Distributor",
      "subtitle": "Join our growing network of distributors...",
      "bannerImage": "https://res.cloudinary.com/..."
    },
    "benefits": {
      "sectionTitle": "Partnership Benefits",
      "sectionSubtitle": "Discover the advantages...",
      "items": [
        { "title": "Fair Pricing", "description": "Competitive wholesale rates..." },
        { "title": "Quality Products", "description": "Authentic handcrafted products..." }
      ]
    },
    "requirements": {
      "sectionTitle": "Partnership Requirements",
      "sectionSubtitle": "What we look for...",
      "image": "https://res.cloudinary.com/...",
      "items": [
        "Passion for handcrafted products",
        "Valid business registration or GST certificate"
      ]
    },
    "steps": {
      "sectionTitle": "How It Works",
      "sectionSubtitle": "Simple steps to become our partner",
      "items": [
        { "title": "Apply", "description": "Submit your application" },
        { "title": "Review", "description": "Our team reviews" },
        { "title": "Interview", "description": "Meet our team" },
        { "title": "Onboard", "description": "Start selling" }
      ]
    },
    "formSection": {
      "title": "Apply Now",
      "subtitle": "Fill out the form below..."
    }
  }
}
```

---

### GET /api/privacy-policy-page

Privacy policy page content (hero, sections, contact info). Frontend fetches on mount for real-time updates.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Privacy Policy",
      "subtitle": "This Privacy Policy describes how Mera Pind Balle Balle collects, uses, and protects your information."
    },
    "lastUpdated": "2026-02-22",
    "sections": [
      { "title": "1. Information We Collect", "content": "We may collect the following types of information:\n\n- Personal details such as your name, email address, phone number, and shipping address\n- Messages sent through our contact or distributor forms" },
      { "title": "2. How We Use Your Information", "content": "Your information helps us:\n\n- Process and fulfill your orders\n- Respond to your inquiries and support requests" }
    ],
    "contactEmail": "support@merapind.com",
    "contactPhone": "+91 98765 43210"
  }
}
```

---

### GET /api/footer-page

Footer content (brand, links, contact info, social links, legal links). Footer component fetches on mount for real-time updates without page refresh.

**Response:**
```json
{
  "success": true,
  "data": {
    "brand": {
      "description": "Empowering rural women artisans through traditional crafts and sustainable livelihood."
    },
    "quickLinks": {
      "columnTitle": "Quick Links",
      "items": [
        { "label": "Shop Products", "link": "/products" },
        { "label": "Artisan Stories", "link": "/stories" }
      ]
    },
    "supportLinks": {
      "columnTitle": "Get Involved",
      "items": [
        { "label": "Become a Distributor", "link": "/distributors" },
        { "label": "Careers", "link": "/careers" }
      ]
    },
    "contactInfo": {
      "columnTitle": "Contact Us",
      "address": "123 Heritage Lane, New Delhi, India 110001",
      "phone": "+91 12345 67890",
      "email": "hello@merapind.com"
    },
    "socialLinks": [
      { "platform": "facebook", "link": "https://facebook.com/merapindballeballe" },
      { "platform": "instagram", "link": "https://instagram.com/merapindballeballe" }
    ],
    "legalLinks": [
      { "label": "Privacy Policy", "link": "/privacy-policy" },
      { "label": "Terms of Service", "link": "/terms-conditions" }
    ],
    "copyrightText": "Mera Pind Balle Balle. All rights reserved."
  }
}
```

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

**Response (201):** `{ "success": true, "message": "Distributor application submitted successfully", "data": { ...distributor } }`

| Code | Meaning |
|------|---------|
| 201 | Created |
| 400 | Name, email, phone required |
| 500 | Server error |

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

All products (active + inactive) sorted newest first.

**Response:** `{ "success": true, "data": [...] }`

### PUT /api/admin/products/[id]

Update product. **Body: FormData** — all fields from POST are supported, image is optional. Only fields included in the FormData are updated (partial update).

**Response:** `{ "success": true, "data": { ...updated } }`

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Product ID required |
| 404 | Product not found |
| 401 | Unauthorized (not admin) |
| 500 | Server error |

### DELETE /api/admin/products/[id]

Delete product and remove Cloudinary image.

**Response:** `{ "success": true, "message": "Product deleted" }`

---

### GET /api/admin/categories

All categories (active + inactive) sorted by name.

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "665abc...", "name": "Food", "slug": "food", "description": "", "image": "", "isActive": true }
  ]
}
```

### POST /api/admin/categories

Create a category. Auto-generates slug from name if not provided. Checks for duplicate name/slug.

**Request Body (JSON):**
```json
{
  "name": "Handicrafts",
  "description": "Handmade rural crafts",
  "image": "",
  "isActive": true
}
```

**Response (201):** `{ "success": true, "data": { "_id": "...", "name": "Handicrafts", "slug": "handicrafts", ... } }`

| Code | Meaning |
|------|---------|
| 201 | Created |
| 400 | Name is required |
| 409 | Category already exists |
| 401 | Unauthorized |
| 500 | Server error |

### PUT /api/admin/categories/[id]

Update category. Checks for duplicate name (excluding self).

**Request Body (JSON):**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": true
}
```

**Response:** `{ "success": true, "data": { ...updated } }`

### DELETE /api/admin/categories/[id]

Delete category permanently.

**Response:** `{ "success": true, "message": "Category deleted" }`

---

### GET /api/admin/blogs

Fetch all blogs (published + drafts). **Requires admin session.**

**Response:** `{ "success": true, "data": [{ "_id", "title", "slug", "excerpt", "content", "image", "author", "tags", "date", "isPublished" }] }`

### POST /api/admin/blogs

Create new blog. **Body: FormData. Requires admin session.**

| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| excerpt | string | Yes |
| content | string (HTML) | Yes |
| image | File | Yes |
| author | string | No (default "Mera Pind Balle Balle") |
| tags | string (comma-separated) | No |
| slug | string | No (auto-generated from title) |
| isPublished | "true"/"false" | No (default true) |

**Response (201):** `{ "success": true, "data": { ...blog } }`

### PUT /api/admin/blogs/[id]

Update blog. **Body: FormData** — same fields as POST, image optional.

**Response:** `{ "success": true, "data": { ...updated } }`

### DELETE /api/admin/blogs/[id]

Delete blog and remove Cloudinary image.

**Response:** `{ "success": true, "message": "Blog deleted" }`

---

### GET /api/admin/stories

Fetch all stories (published + drafts). **Requires admin session.**

**Response:** `{ "success": true, "data": [{ "_id", "title", "slug", "excerpt", "content", "image", "name", "author", "location", "tags", "featured", "isPublished" }] }`

### POST /api/admin/stories

Create new story. **Body: FormData. Requires admin session.**

| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| excerpt | string | Yes |
| content | string (HTML) | Yes |
| image | File | Yes |
| name | string | No (person featured in story) |
| author | string | No (default "Mera Pind Balle Balle") |
| location | string | No |
| tags | string (comma-separated) | No |
| featured | "true"/"false" | No (default false) |
| isPublished | "true"/"false" | No (default true) |

**Response (201):** `{ "success": true, "data": { ...story } }`

### PUT /api/admin/stories/[id]

Update story. **Body: FormData** — same fields as POST, image optional.

**Response:** `{ "success": true, "data": { ...updated } }`

### DELETE /api/admin/stories/[id]

Delete story and remove Cloudinary image.

**Response:** `{ "success": true, "message": "Story deleted" }`

---

### GET /api/admin/orders

Fetch orders with filtering. **Query:** `?status=PLACED&paymentStatus=PENDING&search=MPBB&page=1&limit=20`

### PATCH /api/admin/orders/[id]

Update order status: `{ "status": "SHIPPED", "paymentStatus": "PAID" }`

---

### GET /api/admin/contact-page

Fetch contact page content for admin editing. Returns all sections with seed defaults if no data exists.

**Response:** `{ "success": true, "data": { hero, contactInfo, formSection, faqs } }`

### PATCH /api/admin/contact-page

Update contact page content. Upserts — creates if none exists. Calls `revalidatePath("/contact")` for instant frontend updates.

**Request Body (JSON):**
```json
{
  "hero": { "title": "string", "subtitle": "string", "image": "string (URL)" },
  "contactInfo": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "items": [{ "icon": "map-pin|phone|mail|clock|globe|building", "title": "string", "lines": ["string"], "href": "string" }]
  },
  "formSection": { "title": "string", "subtitle": "string" },
  "faqs": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "items": [{ "question": "string", "answer": "string" }]
  }
}
```

**Response:** `{ "success": true, "data": { ...updated } }`

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Hero title is required |
| 401 | Unauthorized (not admin) |
| 500 | Server error |

---

### GET /api/admin/contact-leads

All contact form submissions (newest first).

**Response:** `{ "success": true, "data": [{ "_id", "name", "email", "phone", "message", "isResolved", "createdAt" }] }`

### PATCH /api/admin/contact-leads/[id]

Toggle lead resolved status.

**Request Body:** `{ "isResolved": true }`

**Response:** `{ "success": true, "data": { ...updated } }`

### DELETE /api/admin/contact-leads/[id]

Delete lead permanently.

**Response:** `{ "success": true, "message": "Lead deleted" }`

### GET /api/admin/about

Fetch about page data for admin editing. Returns all sections with default empty structure if no data exists.

**Response:** `{ "success": true, "data": { hero, mission, vision, values, impact, team, cta } }`

### PATCH /api/admin/about

Update about page. Upserts — creates if none exists.

**Request Body:**
```json
{
  "hero": { "title": "string", "subtitle": "string", "image": "string (URL)" },
  "mission": { "title": "string", "description": "string", "image": "string (URL)" },
  "vision": { "title": "string", "description": "string", "image": "string (URL)" },
  "values": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "items": [{ "icon": "string", "title": "string", "description": "string" }]
  },
  "impact": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "stats": [{ "number": "string", "label": "string", "icon": "string" }]
  },
  "team": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "members": [{ "name": "string", "role": "string", "description": "string", "image": "string (URL)" }]
  },
  "cta": {
    "title": "string",
    "description": "string",
    "primaryButtonText": "string",
    "primaryButtonLink": "string",
    "secondaryButtonText": "string",
    "secondaryButtonLink": "string"
  }
}
```

**Response:** `{ "success": true, "data": { ...updated } }`

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Hero title is required |
| 401 | Unauthorized (not admin) |
| 500 | Server error |

### GET/POST /api/admin/careers + PUT/DELETE /api/admin/careers/[id]

Manage job postings.

### GET /api/admin/distributors

All distributor applications (newest first). **Requires admin session.**

**Response:** `{ "success": true, "data": [{ "_id", "name", "email", "phone", "website", "image", "publicId", "isActive", "createdAt" }] }`

### POST /api/admin/distributors

Create distributor. **Body: FormData. Requires admin session.**

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |
| email | string | Yes |
| phone | string | Yes |
| website | string | No |
| image | File | No |

**Response (201):** `{ "success": true, "data": { ...distributor } }`

### GET /api/admin/distributors/[id]

Single distributor by ID. **Response:** `{ "success": true, "data": { ...distributor } }`

### PATCH /api/admin/distributors/[id]

Update distributor. **Body: FormData** — same fields as POST, all optional. New image replaces old (Cloudinary cleanup).

**Response:** `{ "success": true, "data": { ...updated } }`

### DELETE /api/admin/distributors/[id]

Delete distributor and remove Cloudinary image.

**Response:** `{ "success": true, "message": "Distributor deleted successfully" }`

---

### GET /api/admin/distributors-page

Fetch distributors page content for admin editing. Returns all sections with seed defaults if no data exists.

**Response:** `{ "success": true, "data": { hero, benefits, requirements, steps, formSection } }`

### PATCH /api/admin/distributors-page

Update distributors page content. Upserts — creates if none exists. Calls `revalidatePath("/distributors")` for instant frontend updates.

**Request Body (JSON):**
```json
{
  "hero": { "title": "string", "subtitle": "string", "bannerImage": "string (URL)" },
  "benefits": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "items": [{ "title": "string", "description": "string" }]
  },
  "requirements": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "image": "string (URL)",
    "items": ["string"]
  },
  "steps": {
    "sectionTitle": "string",
    "sectionSubtitle": "string",
    "items": [{ "title": "string", "description": "string" }]
  },
  "formSection": { "title": "string", "subtitle": "string" }
}
```

**Response:** `{ "success": true, "data": { ...updated } }`

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Hero title is required |
| 401 | Unauthorized (not admin) |
| 500 | Server error |

### GET /api/admin/privacy-policy-page

Fetch privacy policy page content for admin editing. Returns all sections with seed defaults if no data exists.

**Response:** `{ "success": true, "data": { hero, lastUpdated, sections, contactEmail, contactPhone } }`

### PATCH /api/admin/privacy-policy-page

Update privacy policy page content. Upserts — creates if none exists. Calls `revalidatePath("/privacy-policy")` for instant frontend updates.

**Request Body (JSON):**
```json
{
  "hero": { "title": "string", "subtitle": "string" },
  "lastUpdated": "2026-02-22",
  "sections": [
    { "title": "string", "content": "string (supports bullet points with '- ' prefix)" }
  ],
  "contactEmail": "string",
  "contactPhone": "string"
}
```

**Response:** `{ "success": true, "data": { ...updated } }`

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Page title is required |
| 401 | Unauthorized (not admin) |
| 500 | Server error |

### GET /api/admin/footer-page

Fetch footer page content for admin editing. Returns all sections with seed defaults if no data exists.

**Response:** `{ "success": true, "data": { brand, quickLinks, supportLinks, contactInfo, socialLinks, legalLinks, copyrightText } }`

### PATCH /api/admin/footer-page

Update footer page content. Upserts — creates if none exists. Calls `revalidatePath("/", "layout")` to update footer on all pages.

**Request Body (JSON):**
```json
{
  "brand": { "description": "string" },
  "quickLinks": {
    "columnTitle": "string",
    "items": [{ "label": "string", "link": "string" }]
  },
  "supportLinks": {
    "columnTitle": "string",
    "items": [{ "label": "string", "link": "string" }]
  },
  "contactInfo": {
    "columnTitle": "string",
    "address": "string",
    "phone": "string",
    "email": "string"
  },
  "socialLinks": [{ "platform": "facebook|instagram|twitter|youtube|linkedin", "link": "string" }],
  "legalLinks": [{ "label": "string", "link": "string" }],
  "copyrightText": "string"
}
```

**Response:** `{ "success": true, "data": { ...updated } }`

| Code | Meaning |
|------|---------|
| 200 | Success |
| 401 | Unauthorized (not admin) |
| 500 | Server error |

---

### GET /api/admin/resources

Fetch all resources (published + drafts). **Requires admin session.**

**Response:** `{ "success": true, "data": [{ "_id", "title", "description", "category", "fileType", "size", "fileUrl", "isPublished" }] }`

### POST /api/admin/resources

Create new resource. **Body: FormData. Requires admin session.**

| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| description | string | No |
| category | string | No (default "Guide") |
| fileType | string | No (default "pdf") |
| size | string | No (e.g. "12.5 MB") |
| file | File | No (PDF, DOC, image, video) |
| isPublished | "true"/"false" | No (default true) |

**Response (201):** `{ "success": true, "data": { ...resource } }`

### PUT /api/admin/resources/[id]

Update resource. **Body: FormData** — same fields as POST, file optional.

**Response:** `{ "success": true, "data": { ...updated } }`

### DELETE /api/admin/resources/[id]

Delete resource and remove Cloudinary file.

**Response:** `{ "success": true, "message": "Resource deleted" }`

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
