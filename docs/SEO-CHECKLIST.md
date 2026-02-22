# SEO Implementation Checklist — Mera Pind Balle Balle

## 1. Structured Data (JSON-LD)

- [x] **Organization Schema** — name, url, logo, address, contactPoint, sameAs (social profiles)
- [x] **WebSite Schema** — name, url, publisher, inLanguage, SearchAction
- [x] **SiteNavigationElement Schema** — all 8 main nav items
- [x] **BreadcrumbList Schema** — all public pages (visual + JSON-LD)
- [x] **Product Schema** — product detail pages (name, description, image, offers, brand)
- [x] **BlogPosting Schema** — blog detail pages (headline, author, publisher, dates)
- [x] **Article Schema** — story detail pages (headline, author, publisher, dates)

## 2. Page-Level Metadata

Every public page has:
- [x] Unique `<title>` (≤ 60 chars) with brand suffix via template `%s | Mera Pind Balle Balle`
- [x] Unique `meta description` (150–160 chars)
- [x] Canonical URL via `alternates.canonical`
- [x] Open Graph tags (title, description, url, type, images)
- [x] Twitter Card tags (inherited from root layout `summary_large_image`)
- [x] Keywords where applicable

### Pages with metadata:
| Page | Title | Canonical |
|------|-------|-----------|
| Homepage | Dynamic from DB | `merapindballeballe.com` |
| About | About — Mera Pind Balle Balle | `/about` |
| Products | Products — Mera Pind Balle Balle | `/products` |
| Product Detail | `{name} \| Mera Pind Balle Balle` | `/product/{id}` |
| Blog | Blog — Mera Pind Balle Balle | `/blog` |
| Blog Detail | `{title} — Mera Pind Balle Balle` | `/blog/{slug}` |
| Stories | Success Stories — Mera Pind Balle Balle | `/stories` |
| Story Detail | `{title} — Mera Pind Balle Balle` | `/stories/{slug}` |
| Contact | Contact Us — Mera Pind Balle Balle | `/contact` |
| Careers | Careers — Mera Pind Balle Balle | `/careers` |
| Distributors | Distributors — Mera Pind Balle Balle | `/distributors` |
| Resources | Resources — Mera Pind Balle Balle | `/resources` |
| Privacy Policy | Privacy Policy — Mera Pind Balle Balle | `/privacy-policy` |
| Terms & Conditions | Terms & Conditions — Mera Pind Balle Balle | `/terms-conditions` |

## 3. Technical SEO

- [x] `robots.ts` — allows all public pages, blocks admin/api/cart/checkout/login
- [x] `sitemap.ts` — dynamic with DB content (products, blogs, stories, categories)
- [x] AI crawler blocking (GPTBot, CCBot)
- [x] Canonical tags on all pages
- [x] `metadataBase` set in root layout
- [x] `robots` meta with `index: true, follow: true`
- [x] `max-image-preview: large` for rich snippets
- [x] `lang="en"` on `<html>` tag

## 4. Site Architecture

- [x] Clean URL structure (max depth = 3: `/blog/slug`, `/product/id`, `/stories/slug`)
- [x] Crawlable `<Link>` navigation (no JS-only nav)
- [x] Visual breadcrumbs on all internal pages
- [x] Header navigation: Home, About, Products, Blog, Stories, Contact
- [x] Footer with Quick Links, Support Links, Contact Info, Social Links, Legal Links
- [x] No orphan pages — all pages linked from navigation or footer

## 5. Internal Linking

- [x] Products page → Distributors CTA ("Become a Distributor")
- [x] Product detail → Related Products
- [x] Blog tags → filtered blog listings
- [x] Story tags → filtered story listings
- [x] Blog detail → Back to All Blogs
- [x] Story detail → Back to All Stories
- [x] Footer Quick Links → major pages
- [x] Footer Legal Links → Privacy Policy, Terms & Conditions

## 6. Performance

- [x] `next/image` with AVIF/WebP formats
- [x] Image `minimumCacheTTL` = 30 days
- [x] Compress enabled in Next.js config
- [x] `poweredByHeader: false` (security + smaller headers)
- [x] Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- [x] Static asset caching (1 year, immutable)
- [x] Dynamic imports for below-fold homepage components
- [x] Dynamic import for CheckoutDrawer (loaded on demand)
- [x] `React.memo` on ProductCard

## 7. Brand Consistency

- [x] Brand name "Mera Pind Balle Balle" used consistently across:
  - Title template
  - Meta descriptions
  - OG tags
  - JSON-LD Organization schema
  - Footer
  - Navbar
  - Copyright text

---

## Google Search Console Setup Guide

### Step 1: Verify Domain
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Choose "URL prefix" → enter `https://merapindballeballe.com`
4. Verify via one of:
   - **HTML tag** (recommended): Add meta tag to root layout `<head>`
   - **DNS TXT record**: Add to domain DNS settings
   - **HTML file**: Upload verification file to `public/` folder

### Step 2: Submit Sitemap
1. In Search Console → **Sitemaps** (left sidebar)
2. Enter `sitemap.xml` in the input field
3. Click **Submit**
4. Verify status shows "Success"

### Step 3: Request Indexing
1. Use the **URL Inspection** tool (top search bar)
2. Enter `https://merapindballeballe.com`
3. Click **Request Indexing**
4. Repeat for key pages: `/about`, `/products`, `/blog`, `/contact`, `/stories`

### Step 4: Monitor Coverage
1. Go to **Pages** report (left sidebar)
2. Check for:
   - Pages with errors (fix immediately)
   - Pages with warnings (review)
   - Valid pages (ensure all important pages are indexed)
3. Check **Crawled - currently not indexed** for pages Google found but didn't index

### Step 5: Check Enhancements
1. Go to **Enhancements** section:
   - **Breadcrumbs** — should show valid items from all pages
   - **Sitelinks searchbox** — should detect SearchAction from WebSite schema
   - **Products** — should show product structured data
2. Fix any errors flagged

### Step 6: Ongoing Monitoring
- Check Search Console weekly for the first month
- Monitor **Performance** tab for:
  - Click-through rates
  - Average position for brand searches
  - Impressions for "Mera Pind Balle Balle"
- Set up email alerts for coverage issues

---

## Backlink Strategy

1. **Social profiles**: Create/claim profiles on Facebook, Instagram, LinkedIn, YouTube, Twitter with consistent brand name and link to website
2. **Google Business Profile**: Set up and verify business at the New Delhi address
3. **Local directories**: List on JustDial, Sulekha, IndiaMART, TradeIndia
4. **Press/PR**: Reach out to rural development blogs, women empowerment publications
5. **Content marketing**: Publish 2-4 blog posts per month with shareable content
6. **Community engagement**: Partner with NGOs and rural development organizations for backlinks

## Content Publishing Frequency

- **Blog**: 2-4 posts/month (rural development stories, product spotlights, artisan features)
- **Stories**: 1-2 success stories/month
- **Products**: Update as new products are added
- **Social media**: Daily posts on Instagram/Facebook, weekly on LinkedIn

## Expected Timeline

| Week | Action |
|------|--------|
| 1 | Deploy all SEO changes, verify Search Console, submit sitemap |
| 2-3 | Google crawls and indexes pages |
| 4-6 | Monitor indexing, fix any issues |
| 6-12 | Build backlinks, publish content consistently |
| 12+ | Sitelinks may start appearing if brand search volume grows |

> **Note**: Google sitelinks are algorithm-based and cannot be manually forced. They appear when Google determines your site has strong brand signals, clear structure, and sufficient search volume.
