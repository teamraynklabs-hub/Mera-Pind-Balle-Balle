# Content Module (Blog, Stories, About)

## Blog Pages

### Blog Listing (`/blog`)

**Purpose**: Displays all published blog posts with a featured post and grid layout.

**Components**:

| Component | File | Purpose |
|-----------|------|---------|
| BlogPageClient | `features/blog/BlogPageClient.tsx` | Orchestrates blog page |
| BlogHero | `features/blog/BlogHero.tsx` | Page header |
| BlogFeatured | `features/blog/BlogFeatured.tsx` | Featured blog card |
| BlogGrid | `features/blog/BlogGrid.tsx` | Blog post grid |
| BlogNewsletter | `features/blog/BlogNewsletter.tsx` | Newsletter signup |

**API Calls**:
- `GET /api/blogs` — Fetch published blogs with pagination and search
- Query params: `search`, `tag`, `page`, `limit`

**Features**:
- Text search across title, excerpt, and tags
- Tag-based filtering
- Pagination
- Featured post highlight

---

### Blog Detail (`/blog/[slug]`)

**Purpose**: Displays a single blog post with full content.

**Dynamic Parameter**: `slug: string` — URL-friendly blog identifier.

**API Calls**:
- `GET /api/blogs/[slug]` — Fetch blog by slug

**Features**:
- Rich HTML content rendering with `prose-luxury` styling
- Author attribution
- Tags display
- Date formatting
- Related blogs (future)

---

## Stories Pages

### Stories Listing (`/stories`)

**Purpose**: Showcases community impact stories.

**Components**:

| Component | File | Purpose |
|-----------|------|---------|
| StoriesPageClient | `features/stories/StoriesPageClient.tsx` | Page orchestrator |
| StoriesHero | `features/stories/StoriesHero.tsx` | Header section |
| StoriesFeatured | `features/stories/StoriesFeatured.tsx` | Featured story |
| StoriesGrid | `features/stories/StoriesGrid.tsx` | Story card grid |
| StoriesImpact | `features/stories/StoriesImpact.tsx` | Impact metrics |
| StoriesCTA | `features/stories/StoriesCTA.tsx` | Call-to-action section |

**API Calls**:
- `GET /api/stories` — Fetch published stories with pagination

---

### Story Detail (`/stories/[slug]`)

**Purpose**: Displays a single community story.

**Dynamic Parameter**: `slug: string`

**API Calls**:
- `GET /api/stories/[slug]` — Fetch story by slug

---

## About Page (`/about`)

**Purpose**: Displays organization information — hero, mission, vision, values, impact metrics, and team.

**Components**:

| Component | File | Purpose |
|-----------|------|---------|
| AboutPageClient | `features/about/AboutPageClient.tsx` | Page orchestrator |
| AboutHero | `features/about/AboutHero.tsx` | Hero section with image |
| AboutMission | `features/about/AboutMission.tsx` | Mission statement |
| AboutVision | `features/about/AboutVision.tsx` | Vision statement |
| AboutValues | `features/about/AboutValues.tsx` | Core values grid |
| AboutImpact | `features/about/AboutImpact.tsx` | Impact statistics |
| AboutTeam | `features/about/AboutTeam.tsx` | Team members grid |
| AboutCTA | `features/about/AboutCTA.tsx` | Call-to-action section |

**API Calls**:
- `GET /api/about` — Fetch all about page sections

**Data Structure**:
All content is managed through the admin dashboard (`/admin/dashboard/about`) and stored in the `About` model with nested sections.

**Image Handling**:
- Hero and section images use `next/image` with `fill` and responsive `sizes`
- Images served from Cloudinary CDN

---

## Common Content Patterns

### Data Flow
```
Admin Dashboard → API POST → MongoDB → API GET → Server Component → Client Component
```

### Image Convention
All content images use `next/image` with:
- `fill` layout for background/hero images
- Explicit `width`/`height` for fixed-size images (avatars, thumbnails)
- Responsive `sizes` prop matching grid breakpoints

### Animation
Content sections use Motion components for scroll-driven animations:
- `ScrollReveal` — Fade-in on scroll
- `StaggerContainer` — Staggered children animation
- `TextReveal` — Text fade-up effect
- `ParallaxImage` — Parallax scrolling on images
