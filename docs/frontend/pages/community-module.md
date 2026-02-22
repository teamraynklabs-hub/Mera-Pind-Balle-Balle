# Community Module (Careers, Resources)

## Careers Page

### Page Purpose
Displays open job positions and allows visitors to submit career applications.

### Route Path
`/careers`

### Required Permissions
None — publicly accessible.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| CareersHero | `features/careers/CareersHero.tsx` | Hero section with banner |
| CareersOpenPositions | `features/careers/CareersOpenPositions.tsx` | Job listings grid |
| CareersBenefits | `features/careers/CareersBenefits.tsx` | Benefits display |
| CareersCulture | `features/careers/CareersCulture.tsx` | Culture section with image |
| CareersCTA | `features/careers/CareersCTA.tsx` | Call-to-action section |
| CareersForm | `src/app/(public)/careers/CareersForm.tsx` | Application form |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/careers` | GET | Fetch career page data + job listings |
| `/api/careers` | POST | Submit career application |

### Validation Schema

**File**: `src/lib/validations/careers.ts`

```typescript
careersSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().max(20).optional().or(z.literal("")),
  position: z.string().min(1, "Select a position"),
  message: z.string().max(5000).optional().or(z.literal("")),
});
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | text | Yes | Min 2, max 100 chars |
| Email | email | Yes | Valid email |
| Phone | tel | No | Max 20 chars |
| Position | select | Yes | Must select one |
| Message | textarea | No | Max 5000 chars |

### State Management
- `useForm<CareersFormInput>` with `zodResolver(careersSchema)`
- Position options populated from job listings API response

### Loading State
- Submit button disabled and shows loading text during submission
- Success message displayed after submission

### Error Handling
- Inline Zod validation errors
- API errors caught with `err instanceof Error` pattern
- Toast notification for success

### Image Handling
- Culture section uses hardcoded Unsplash image extracted to `CULTURE_IMAGE` constant
- Banner image from admin-configured CareersPage model
- All images use `next/image` with `fill` and responsive `sizes`

---

## Resources Page

### Page Purpose
Provides downloadable resources (PDFs, guides, documents) for users.

### Route Path
`/resources`

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| ResourcesPageClient | `features/resources/ResourcesPageClient.tsx` | Page orchestrator |
| ResourcesHero | `features/resources/ResourcesHero.tsx` | Hero section |
| ResourcesFilter | `features/resources/ResourcesFilter.tsx` | Category filter |
| ResourcesGrid | `features/resources/ResourcesGrid.tsx` | Resources grid |
| ResourcesCard | `features/resources/ResourcesCard.tsx` | Individual resource card |
| ResourcesCTA | `features/resources/ResourcesCTA.tsx` | Call-to-action |
| ResourcesNewsletter | `features/resources/ResourcesNewsletter.tsx` | Newsletter signup |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/resources` | GET | Fetch published resources |

### Features
- Category-based filtering (Guide, Article, Report, etc.)
- Download links to resource files
- File type and size display
- Responsive grid layout

### Data File
`features/resources/resourcesData.ts` contains static fallback content.

### Edge Cases
- No resources available — empty state message
- Broken file download URLs — handled by browser
- Large number of resources — pagination support

---

## Shared Page Patterns

### Privacy Policy Page (`/privacy-policy`)

**Components**: `PrivacyPolicyPageClient`
**API**: `GET /api/privacy-policy-page`
**Content**: Rich HTML content managed through admin dashboard.

### Terms & Conditions Page (`/terms-conditions`)

**API**: `GET /api/terms-conditions-page`
**Content**: Rich HTML content managed through admin dashboard.

### Common Features
- Content managed entirely through admin dashboard
- Rendered as rich HTML with `prose-luxury` styling
- Dynamic rendering (SSR) for always-fresh content
