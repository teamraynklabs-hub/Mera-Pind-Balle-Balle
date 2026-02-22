# Shared Components

## UI Components (`src/components/ui/`)

Base-level, reusable components built on Radix UI primitives with Tailwind styling.

| Component | File | Base | Description |
|-----------|------|------|-------------|
| Button | `button.tsx` | CVA + Slot | Button with variants: default, destructive, outline, secondary, ghost, link. Sizes: default, sm, lg, icon |
| Badge | `badge.tsx` | CVA | Badge/label with variants: default, secondary, destructive, outline |
| Card | `card.tsx` | div | Card container with CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Dialog | `dialog.tsx` | Radix Dialog | Modal dialog with overlay, close button, header, footer |
| Input | `input.tsx` | input | Styled input field |
| Label | `label.tsx` | Radix Label | Accessible form label |
| Textarea | `textarea.tsx` | textarea | Styled textarea |
| Sonner | `sonner.tsx` | Sonner Toaster | Toast notification wrapper |
| ToggleBtn | `toggleBtn.tsx` | button | Theme toggle (dark/light/system) |

### CVA (Class Variance Authority) Pattern

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        // ...
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
  }
);
```

---

## Common Components (`src/components/common/`)

| Component | File | Purpose |
|-----------|------|---------|
| Navbar | `Navbar.tsx` | Main navigation bar |
| Footer | `Footer.tsx` | Site footer |
| LayoutWrapper | `LayoutWrapper.tsx` | Public page wrapper (Navbar + content + Footer) |
| ClientImage | `ClientImage.tsx` | Client-side image component |

### Navbar

- Fetches configuration from `/api/navbar-settings`
- Displays brand name, navigation links, cart icon, login button, theme toggle
- Responsive: hamburger menu on mobile
- Visibility of cart, login, theme toggle configurable from admin
- Admin-configurable nav links

### Footer

- Fetches configuration from `/api/footer-page`
- Quick links, support links, contact info, social links
- Copyright text
- Responsive multi-column layout

---

## Motion Components (`src/components/motion/`)

Animation components built on the Motion library (Framer Motion fork).

| Component | File | Effect |
|-----------|------|--------|
| ScrollReveal | `ScrollReveal.tsx` | Fade-in animation triggered by scroll viewport entry |
| StaggerContainer | `StaggerContainer.tsx` | Staggers children animations with configurable delay |
| TextReveal | `TextReveal.tsx` | Text fade-up reveal animation |
| ParallaxImage | `ParallaxImage.tsx` | Parallax scrolling effect on images |

### Usage Pattern

```tsx
<ScrollReveal>
  <StaggerContainer>
    {items.map(item => (
      <div key={item.id}>{item.content}</div>
    ))}
  </StaggerContainer>
</ScrollReveal>
```

---

## Layout Components (`src/components/layout/`)

| Component | File | Purpose |
|-----------|------|---------|
| PageContainer | `PageContainer.tsx` | Wraps page content with consistent padding/spacing |
| PageTransition | `PageTransition.tsx` | Animated page transitions |

---

## Provider Components (`src/components/providers/`)

| Component | File | Purpose |
|-----------|------|---------|
| AuthSessionProvider | `AuthSessionProvider.tsx` | NextAuth SessionProvider wrapper |
| ThemeProvider | `ThemeProvider.tsx` | next-themes ThemeProvider wrapper |

---

## Admin Components (`src/components/admin/`)

| Component | File | Purpose |
|-----------|------|---------|
| AdminLogoutButton | `AdminLogoutButton.tsx` | Admin logout action |
| AdminSessionProvider | `AdminSessionProvider.tsx` | Admin session context for client components |

---

## Utility Functions (`src/lib/utils.ts`)

```typescript
cn(...inputs: ClassValue[]): string
// Combines class names using clsx + tailwind-merge
// Resolves Tailwind class conflicts
```

### Usage
```tsx
<div className={cn("p-4 bg-card", isActive && "bg-primary", className)} />
```

---

## Normalize Functions (`src/lib/normalize*.ts`)

Transform raw API/database responses into consistent UI-ready shapes:

| Function | File | Purpose |
|----------|------|---------|
| normalizeAbout | `normalizeAbout.ts` | About page data normalization |
| normalizeContactPage | `normalizeContactPage.ts` | Contact page data |
| normalizeDistributorsPage | `normalizeDistributorsPage.ts` | Distributors page data |
| normalizeFooterPage | `normalizeFooterPage.ts` | Footer settings |
| normalizeNavbarSettings | `normalizeNavbarSettings.ts` | Navbar configuration |
| normalizePrivacyPolicyPage | `normalizePrivacyPolicyPage.ts` | Privacy policy data |
| normalizeTermsConditionsPage | `normalizeTermsConditionsPage.ts` | T&C data |

These functions provide default values for missing fields, ensuring the UI never encounters undefined data.
