# Database Design

## Overview

The application uses **MongoDB** with **Mongoose ODM** for data persistence. The database is hosted on MongoDB Atlas.

**Database name**: `mpbb`
**Connection**: `src/lib/db/index.ts` with singleton connection pooling.

## Entity Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ AdminUser │     │   User   │────→│  Order   │
│ (admin)  │     │(customer)│     │          │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                                  ┌────▼─────┐
                                  │ Product  │←──┐
                                  └────┬─────┘   │
                                       │         │
                                  ┌────▼─────┐   │
                                  │ Category │   │
                                  └──────────┘   │
                                                 │
┌──────────┐  ┌──────────┐  ┌──────────┐       │
│   Blog   │  │  Story   │  │ Resource │       │
└──────────┘  └──────────┘  └──────────┘       │
                                                │
┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  Contact │  │Distributor│  │ Service  │       │
└──────────┘  └──────────┘  └──────────┘       │
                                                │
┌──────────────────────────────────────┐       │
│        Page Settings Models          │       │
│ Dashboard, About, NavbarSettings,    │       │
│ FooterPage, ContactPage,             │       │
│ DistributorsPage, PrivacyPolicyPage, │       │
│ TermsConditionsPage, CareersPage     │       │
└──────────────────────────────────────┘
```

## Models

### User Models

#### AdminUser

```typescript
{
  name: String,           // required
  email: String,          // required, unique, indexed
  password: String,       // required, bcryptjs hashed
  role: "admin" | "editor", // default: "admin"
  isActive: Boolean,      // default: true, indexed
}
// Compound index: { email: 1, isActive: 1 }
// Timestamps: createdAt, updatedAt
```

#### User (Customer)

```typescript
{
  name: String,           // required, trimmed
  email: String,          // required, unique, lowercase, indexed
  password: String,       // required, bcryptjs hashed
  phone: String,          // required, trimmed
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
  },
}
// Timestamps: createdAt, updatedAt
```

### E-commerce Models

#### Product

```typescript
{
  name: String,           // required, indexed
  description: String,    // required
  price: Number,          // required
  originalPrice: Number,  // default: 0 (for discount display)
  image: String,          // required (Cloudinary URL)
  imageId: String,        // Cloudinary public_id
  images: [{              // Additional images
    url: String,
    imageId: String,
  }],
  category: String,       // indexed
  stock: Number,          // default: 0
  sku: String,
  material: String,
  color: String,
  weight: String,
  story: String,          // Product backstory
  careInstructions: String,
  socialImpact: String,
  isActive: Boolean,      // default: true, indexed
  isFeatured: Boolean,    // default: false, indexed
}
// Timestamps: createdAt, updatedAt
```

#### Order

```typescript
{
  userId: ObjectId,       // ref: User, indexed
  orderNumber: String,    // unique, indexed (MPBB-YYYYMMDD-XXXX)
  customer: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  items: [{
    productId: ObjectId,  // ref: Product
    name: String,
    price: Number,        // Verified server-side from DB
    quantity: Number,
    image: String,
  }],
  subtotal: Number,
  deliveryCharge: Number, // default: 0
  total: Number,
  paymentMethod: "COD" | "ONLINE",
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: "PLACED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  estimatedDelivery: Date, // Auto-set to +8 days
  deliveredAt: Date,
  notes: String,
}
// Timestamps: createdAt, updatedAt
```

#### Category

```typescript
{
  name: String,           // required, unique, trimmed
  slug: String,           // required, unique, lowercase, indexed
  description: String,
  image: String,
  isActive: Boolean,      // default: true, indexed
}
```

### Content Models

#### Blog

```typescript
{
  slug: String,           // required, unique, lowercase, indexed
  title: String,          // required, indexed
  excerpt: String,        // required
  content: String,        // required (HTML)
  image: String,
  author: String,         // default: "Mera Pind Balle Balle"
  tags: [String],
  date: Date,             // required, indexed
  isPublished: Boolean,   // default: true, indexed
}
// Indexes: {isPublished: 1, date: -1}, {tags: 1}
```

#### Story

```typescript
{
  slug: String,           // required, unique, lowercase, indexed
  title: String,          // required, indexed
  excerpt: String,        // required
  image: String,          // required
  content: String,        // required (HTML)
  name: String,           // Featured person name
  author: String,
  location: String,
  tags: [String],
  featured: Boolean,      // default: false, indexed
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  isPublished: Boolean,   // default: true, indexed
}
// Indexes: {isPublished: 1, createdAt: -1}, {isPublished: 1, featured: -1}
```

#### Resource

```typescript
{
  title: String,          // required
  description: String,
  category: String,       // default: "Guide"
  fileType: String,       // default: "pdf"
  size: String,
  fileUrl: String,
  isPublished: Boolean,   // default: true, indexed
}
// Indexes: {isPublished: 1, createdAt: -1}, {category: 1}
```

### Form Submission Models

#### Contact

```typescript
{
  name: String,           // required, trimmed
  email: String,          // required, lowercase, indexed
  phone: String,
  message: String,        // required, trimmed
  isResolved: Boolean,    // default: false, indexed
}
```

#### Distributor

```typescript
{
  name: String,           // required, min: 3
  email: String,          // required, unique, email validation
  phone: String,          // required
  website: String,
  image: String,          // Cloudinary URL
  publicId: String,       // Cloudinary public_id
  isActive: Boolean,      // default: true
}
// Text index: {name: "text", email: "text"}
```

### Page Settings Models

These are **singleton** documents — each model has one active document that stores all page configuration.

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| Dashboard | hero, initiatives, feedback, impact, cta, testimonials | Homepage content |
| About | hero, mission, vision, values, impact, team, cta | About page sections |
| NavbarSettings | brandName, logoUrl, navLinks, showCart, showLogin | Navigation config |
| FooterPage | brand, quickLinks, supportLinks, contactInfo, socialLinks | Footer config |
| ContactPage | Contact page sections and content | Contact page layout |
| DistributorsPage | Distributor page sections | Distributors page layout |
| PrivacyPolicyPage | Rich HTML content | Privacy policy |
| TermsConditionsPage | Rich HTML content | Terms & conditions |
| CareersPage | bannerImage, jobs[], isActive | Careers page + listings |

## Indexing Strategy

### Primary Indexes

| Collection | Index | Type | Purpose |
|-----------|-------|------|---------|
| AdminUser | `{ email: 1, isActive: 1 }` | Compound | Login lookup |
| User | `{ email: 1 }` | Unique | Login/registration |
| Product | `{ name: 1 }`, `{ category: 1 }`, `{ isActive: 1 }`, `{ isFeatured: 1 }` | Single | Catalog queries |
| Order | `{ userId: 1 }`, `{ orderNumber: 1 }` | Single/Unique | Order lookup |
| Blog | `{ slug: 1 }`, `{ isPublished: 1, date: -1 }`, `{ tags: 1 }` | Compound | Content queries |
| Story | `{ slug: 1 }`, `{ isPublished: 1, createdAt: -1 }` | Compound | Content queries |
| Contact | `{ email: 1 }`, `{ isResolved: 1 }` | Single | Lead management |

### Performance Notes

- `autoIndex` disabled in production (indexes created during deployment)
- Lean queries (`.lean()`) used where possible for read operations
- Projection used to exclude unnecessary fields (e.g., `-password`)
- Connection pooling: 5-10 connections maintained
