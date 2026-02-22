# Notification & Communication System

## Overview

The application uses **Sonner** (toast notifications) for real-time user feedback. There is no push notification, email, or SMS system currently implemented.

## Client-Side Notifications (Sonner)

### Configuration

**File**: `src/components/ui/sonner.tsx`

```tsx
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return <SonnerToaster richColors closeButton position="top-right" />;
}
```

The `<Toaster />` component is included in:
- Admin dashboard layout (`admin/dashboard/layout.tsx`)
- Root layout or public layout (via providers)

### Usage Patterns

```tsx
import { toast } from "sonner";

// Success
toast.success("Product created successfully");

// Error
toast.error("Failed to save changes");

// Loading
toast.loading("Uploading image...");
```

### When Notifications Are Used

| Event | Type | Message |
|-------|------|---------|
| Form submission success | `success` | "Message sent successfully" |
| Form submission error | `error` | "Something went wrong" |
| Product created/updated | `success` | "Product saved" |
| Product deleted | `success` | "Product deleted" |
| Order status updated | `success` | "Order updated" |
| Login success | `success` | "Welcome back" |
| Authentication error | `error` | "Invalid credentials" |
| Network error | `error` | "Network error. Please try again." |
| Image upload | `loading` → `success` | Progress indicator |

## Contact Form Submissions

Contact form data is stored in the `Contact` model for admin review:

```
User submits contact form
    │
    ▼
POST /api/contact
    │
    ├── Zod validation
    ├── Contact.create({ name, email, phone, message })
    │
    ▼
Admin views in /admin/dashboard/contact
    │
    ├── List all submissions
    ├── Mark as resolved (PATCH)
    └── Delete (DELETE)
```

## Distributor Applications

Similar flow — stored in `Distributor` model, reviewed by admin.

## Career Applications

Career applications stored as part of the CareersPage model or separate CareerApplication model.

## Future Notification Improvements

### Email Notifications (Recommended)

| Event | Recipient | Content |
|-------|-----------|---------|
| New order placed | Admin + Customer | Order confirmation details |
| Order status change | Customer | Status update notification |
| Contact form submitted | Admin | New lead notification |
| Distributor application | Admin | New application alert |
| Career application | Admin | New application alert |
| Password reset | User | Reset link |

### Implementation Options

1. **Resend** — Modern email API, Next.js friendly
2. **SendGrid** — Enterprise email service
3. **AWS SES** — Cost-effective at scale
4. **Nodemailer** — Self-hosted SMTP

### Push Notifications (Future)

- Service Worker for browser notifications
- Real-time order status updates
- Admin alerts for new submissions

### Newsletter System

The `BlogNewsletter` component has a placeholder for newsletter subscription:

```typescript
// Currently: TODO comment
// Future: POST /api/newsletter endpoint
```

Requires:
- Email collection and storage
- Unsubscribe mechanism
- GDPR compliance
- Email delivery integration
