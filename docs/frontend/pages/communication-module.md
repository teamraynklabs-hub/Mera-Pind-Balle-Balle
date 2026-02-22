# Communication Module (Contact, Distributors)

## Contact Page

### Page Purpose
Contact form for customer inquiries with office information display.

### Route Path
`/contact`

### Required Permissions
None — publicly accessible.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| ContactPageClient | `features/contact/ContactPageClient.tsx` | Contact form + info |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact-page` | GET | Fetch page content (address, phone, email) |
| `/api/contact` | POST | Submit contact form |

### Validation Schema

**File**: `src/lib/validations/contact.ts`

```typescript
ContactFormSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().min(5).max(254).toLowerCase(),
  phone: z.string().regex(/^[0-9\s\-\+\(\)]*$/).max(20).optional().or(z.literal("")),
  subject: z.string().min(2).max(200).trim(),
  message: z.string().min(10).max(5000).trim(),
});
```

### State Management
- `useForm<ContactFormInput>` with `zodResolver(ContactFormSchema)`
- `register()` pattern on all inputs
- `reset()` on successful submission

### Loading State
- Submit button shows loading state during form submission
- Success message displayed after submission

### Error Handling
- Inline Zod validation errors below each field
- Error input styling (red border) via `inputError` class
- API errors caught silently (toast can be added)

### Edge Cases
- Phone field is optional
- Very long messages (max 5000 chars)
- Rapid form resubmission (prevented by loading state)

---

## Distributors Page

### Page Purpose
Information about becoming a distributor with application form and requirements.

### Route Path
`/distributors`

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| DistributorsPageClient | `features/distributors/DistributorsPageClient.tsx` | Full page orchestrator |
| DistributorHero | `features/distributors/DistributorHero.tsx` | Hero section |
| DistributorRequirements | `features/distributors/DistributorRequirements.tsx` | Requirements list |
| DistributorBenefits | `features/distributors/DistributorBenefits.tsx` | Benefits grid |
| DistributorSteps | `features/distributors/DistributorSteps.tsx` | Application steps |
| DistributorApplyForm | `features/distributors/DistributorApplyForm.tsx` | Application form |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/distributors-page` | GET | Fetch page content |
| `/api/distributors` | POST | Submit distributor application |

### Validation Schema

**File**: `src/lib/validations/distributor.ts`

```typescript
distributorSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().min(10).max(20).trim(),
  location: z.string().min(2).max(100).trim(),
  businessType: z.string().min(1, "Select a business type"),
  experience: z.string().min(1, "Select experience level"),
  about: z.string().min(10).max(5000).trim(),
});
```

### Form Fields

| Field | Type | Validation |
|-------|------|------------|
| Name | text | Min 2 chars, max 100 |
| Email | email | Valid email format |
| Phone | tel | 10-20 characters |
| Location | text | Min 2 chars |
| Business Type | select | Required selection |
| Experience | select | Required selection |
| About | textarea | Min 10, max 5000 chars |

### State Management
- `useForm<DistributorFormInput>` with `zodResolver(distributorSchema)`
- Select elements use `register("field")` with `inputError`/`selectError` styles
- API error stored in local state (`apiError`)

### Error Handling
- Inline Zod validation for all fields
- Select fields show red border on error
- API errors displayed as alert message
- Caught errors use `err instanceof Error` pattern

### Image Handling
- Hero and requirements images use `next/image` with `fill`
- Images served from Cloudinary or admin-configured URLs

### Data File
`features/distributors/distributorData.ts` contains static content for benefits and steps (fallback if admin data not available).
