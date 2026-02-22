# Admin Dashboard Pages

## Dashboard Overview

### Page Purpose
Central admin panel for managing all content, products, orders, and site settings.

### Route Path
`/admin/dashboard`

### Required Permissions
Authenticated session with `admin` role (enforced by middleware + layout).

### Layout Used
Admin layout (`(admin)/admin/dashboard/layout.tsx`) with admin header, logout button, sidebar navigation, and Sonner toaster.

### Authentication Guard

```tsx
// layout.tsx
const session = await auth();
if (!session?.user || session.user.role !== "admin") {
  redirect("/admin-login");
}
```

---

## Dashboard Modules

### Products Management (`/admin/dashboard/products`)

**Purpose**: CRUD operations for product catalog.

**API Calls**:
- `GET /api/admin/products` — List all products
- `POST /api/admin/products` — Create product (FormData with image)
- `PUT /api/admin/products/[id]` — Update product
- `DELETE /api/admin/products/[id]` — Delete product + Cloudinary image

**Features**:
- Product list with search and filtering
- Image upload via Cloudinary
- Rich text editor for descriptions
- Category assignment
- Stock management
- Featured product toggle

---

### Orders Management (`/admin/dashboard/orders`)

**Purpose**: View, filter, and manage customer orders.

**API Calls**:
- `GET /api/admin/orders` — List orders (filterable by status, date, search)
- `PUT /api/admin/orders/[id]` — Update order status
- `DELETE /api/admin/orders/[id]` — Delete order

**Features**:
- Order list with status filtering (PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Date range filtering
- Search by customer name or order number
- Export to Excel (XLSX)
- Payment status tracking (PENDING, PAID, FAILED, REFUNDED)

---

### Blog Management (`/admin/dashboard/blogs`)

**Purpose**: Create and manage blog posts.

**API Calls**:
- `GET /api/admin/blogs` — List blogs
- `POST /api/admin/blogs` — Create blog (with image)
- `PUT /api/admin/blogs/[id]` — Update blog
- `DELETE /api/admin/blogs/[id]` — Delete blog

**Features**:
- Rich text editor (react-quill-new) for blog content
- Image upload for featured image
- Tag management
- Publish/unpublish toggle
- Slug auto-generation

---

### Stories Management (`/admin/dashboard/stories`)

**Purpose**: Manage community impact stories.

**API Calls**:
- `GET /api/admin/stories` — List stories
- `POST /api/admin/stories` — Create story
- `PUT /api/admin/stories/[id]` — Update story
- `DELETE /api/admin/stories/[id]` — Delete story

---

### Careers Management (`/admin/dashboard/careers`)

**Purpose**: Manage job listings and career page.

**API Calls**:
- `GET /api/admin/careers` — Get careers page data
- `POST /api/admin/careers` — Update careers page
- `PUT /api/admin/careers/[id]` — Update specific listing
- `DELETE /api/admin/careers/[id]` — Remove listing

---

### Contact Leads (`/admin/dashboard/contact`)

**Purpose**: View and manage contact form submissions.

**API Calls**:
- `GET /api/admin/contact-leads` — List submissions
- `PATCH /api/admin/contact-leads/[id]` — Mark as resolved
- `DELETE /api/admin/contact-leads/[id]` — Delete submission

---

### Distributors Management (`/admin/dashboard/distributors`)

**Purpose**: Manage distributor profiles and applications.

**API Calls**:
- `GET /api/admin/distributors` — List distributors
- `POST /api/admin/distributors` — Add distributor
- `PUT /api/admin/distributors/[id]` — Update distributor
- `DELETE /api/admin/distributors/[id]` — Delete distributor

---

### Content Page Managers

Each page manager follows the same pattern: fetch current content, edit in form, save via POST.

| Route | API Endpoint | Content Managed |
|-------|-------------|-----------------|
| `/admin/dashboard/home` | `/api/admin/home` | Homepage hero, initiatives, CTA |
| `/admin/dashboard/about` | `/api/admin/about` | About page sections |
| `/admin/dashboard/navbar` | `/api/admin/navbar-settings` | Navigation links, branding |
| `/admin/dashboard/footer` | `/api/admin/footer-page` | Footer links, contact info |
| `/admin/dashboard/privacy-policy` | `/api/admin/privacy-policy-page` | Privacy policy content |
| `/admin/dashboard/terms-conditions` | `/api/admin/terms-conditions-page` | T&C content |
| `/admin/dashboard/services` | `/api/admin/services` | Service listings |
| `/admin/dashboard/resources` | `/api/admin/resources` | Downloadable resources |

---

## Common Admin Patterns

### Loading States
- Skeleton loaders while fetching data
- Submit button disabled during save operations
- Sonner toast for success/error feedback

### Error Handling
- API errors displayed via toast
- Session expiry redirects to admin login
- Form validation prevents invalid submissions

### Data Refresh
- `revalidatePath()` called after mutations to refresh cached pages
- Optimistic UI updates where applicable
