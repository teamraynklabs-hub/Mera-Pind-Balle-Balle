# FactoryFlow — Architecture & Folder Structure Guide

> **Industry-grade modular frontend architecture for enterprise manufacturing applications.**
> Built with React + TypeScript + Vite. Designed for scalability, performance, and team collaboration.

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Complete Folder Structure](#2-complete-folder-structure)
3. [Layer-by-Layer Breakdown](#3-layer-by-layer-breakdown)
4. [Module System — The Core Pattern](#4-module-system--the-core-pattern)
5. [API Layer Architecture](#5-api-layer-architecture)
6. [State Management Strategy](#6-state-management-strategy)
7. [Performance Optimizations](#7-performance-optimizations)
8. [Authentication & Security Architecture](#8-authentication--security-architecture)
9. [Code Splitting & Bundle Optimization](#9-code-splitting--bundle-optimization)
10. [Barrel Export Pattern](#10-barrel-export-pattern)
11. [Naming Conventions](#11-naming-conventions)
12. [Testing Architecture](#12-testing-architecture)
13. [Configuration Management](#13-configuration-management)
14. [How to Add a New Module](#14-how-to-add-a-new-module)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      main.tsx                           │
│              (Bootstrap + Runtime Config)                │
├─────────────────────────────────────────────────────────┤
│                     app/ (Shell)                        │
│    ┌─────────┐  ┌──────────┐  ┌────────┐  ┌────────┐  │
│    │Providers │  │  Routes  │  │Layouts │  │Registry│  │
│    └─────────┘  └──────────┘  └────────┘  └────────┘  │
├─────────────────────────────────────────────────────────┤
│                  modules/ (Features)                    │
│    ┌──────┐ ┌────┐ ┌────┐ ┌──────┐ ┌─────┐ ┌───────┐ │
│    │ auth │ │gate│ │ qc │ │ grpo │ │notif│ │ dash  │ │
│    └──────┘ └────┘ └────┘ └──────┘ └─────┘ └───────┘ │
├─────────────────────────────────────────────────────────┤
│                  core/ (Infrastructure)                  │
│    ┌─────┐  ┌───────┐  ┌───────┐  ┌────┐  ┌────────┐ │
│    │ api │  │  auth  │  │ store │  │i18n│  │notific.│ │
│    └─────┘  └───────┘  └───────┘  └────┘  └────────┘ │
├─────────────────────────────────────────────────────────┤
│                 shared/ (Reusable)                       │
│    ┌────────────┐  ┌───────┐  ┌───────┐  ┌──────┐     │
│    │ components │  │ hooks │  │ utils │  │types │     │
│    └────────────┘  └───────┘  └───────┘  └──────┘     │
├─────────────────────────────────────────────────────────┤
│                  config/ (Settings)                      │
│    ┌───────────┐  ┌─────────────┐  ┌───────┐          │
│    │ constants │  │ permissions │  │configs│          │
│    └───────────┘  └─────────────┘  └───────┘          │
└─────────────────────────────────────────────────────────┘
```

### Dependency Flow (Top → Bottom, Never Upward)

```
modules/ ──→ core/ ──→ shared/ ──→ config/
    │           │          │
    └───────────┴──────────┴──→  (No circular imports)
```

**Rule:** Lower layers NEVER import from higher layers. A `shared/` utility can never import from `modules/`. A `core/` service can never import from `app/`.

---

## 2. Complete Folder Structure

```
FactoryFlow/
├── public/                          # Static assets (PWA icons, favicon)
├── src/
│   ├── main.tsx                     # Entry point — bootstrap + runtime config
│   ├── index.css                    # Global styles (Tailwind directives)
│   │
│   ├── app/                         # Application shell (orchestration only)
│   │   ├── App.tsx                  # Root component (providers + auth + routes)
│   │   ├── index.ts                 # Barrel export
│   │   ├── layouts/                 # Page layouts
│   │   │   ├── AuthLayout.tsx       # Public pages (login, etc.)
│   │   │   ├── MainLayout.tsx       # Authenticated pages (sidebar, header)
│   │   │   ├── components/          # Layout-specific components
│   │   │   │   ├── Breadcrumbs.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── MobileSidebar.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── providers/               # Global context providers
│   │   │   ├── AppProviders.tsx     # Redux + React Query + Router + Theme
│   │   │   ├── NotificationProvider.tsx
│   │   │   └── index.ts
│   │   ├── registry/                # Module registration system
│   │   │   └── index.ts            # Central registry — aggregates all modules
│   │   └── routes/
│   │       ├── AppRoutes.tsx        # Route rendering from registry
│   │       └── index.ts
│   │
│   ├── config/                      # Application-wide configuration
│   │   ├── constants/               # Domain-specific constants
│   │   │   ├── api.constants.ts     # API endpoints mapping
│   │   │   ├── app.constants.ts     # App metadata
│   │   │   ├── auth.constants.ts    # Auth config (token prefix, intervals)
│   │   │   ├── status.constants.ts  # Status enums
│   │   │   ├── ui.constants.ts      # UI constants (pagination, etc.)
│   │   │   ├── validation.constants.ts
│   │   │   ├── vehicle.constants.ts
│   │   │   ├── idProof.constants.ts
│   │   │   └── index.ts            # Re-exports all constants
│   │   ├── permissions/             # Permission constants per module
│   │   │   ├── gate.permissions.ts
│   │   │   ├── qc.permissions.ts
│   │   │   ├── grpo.permissions.ts
│   │   │   ├── notification.permissions.ts
│   │   │   └── index.ts
│   │   ├── env.config.ts           # Environment variables (typed)
│   │   ├── firebase.config.ts      # Firebase/FCM setup
│   │   ├── query.config.ts         # React Query global defaults
│   │   ├── routes.config.ts        # Route path constants
│   │   └── runtime.config.ts       # Runtime config loader
│   │
│   ├── core/                        # Infrastructure services
│   │   ├── api/                     # HTTP client layer
│   │   │   ├── client.ts           # Axios instance + interceptors
│   │   │   ├── queryClient.ts      # React Query client instance
│   │   │   ├── types.ts            # ApiError, PaginatedResponse types
│   │   │   ├── utils/
│   │   │   │   └── validation.util.ts
│   │   │   └── index.ts
│   │   ├── auth/                    # Authentication system
│   │   │   ├── components/
│   │   │   │   ├── AuthInitializer.tsx   # Restores session on app load
│   │   │   │   ├── Authorized.tsx        # Permission-based rendering
│   │   │   │   └── ProtectedRoute.tsx    # Route-level permission guard
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts           # Login/logout/user state
│   │   │   │   └── usePermission.ts     # Permission checking hooks
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts      # Login/refresh API calls
│   │   │   │   └── indexedDb.service.ts # Token storage (IndexedDB)
│   │   │   ├── store/
│   │   │   │   ├── authSlice.ts         # Redux auth state
│   │   │   │   └── authSyncMiddleware.ts# Cross-tab sync
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts        # Auth interfaces + helpers
│   │   │   ├── utils/
│   │   │   │   └── tokenRefresh.util.ts # Proactive token refresh
│   │   │   └── index.ts                 # Public API for auth
│   │   ├── i18n/                    # Internationalization
│   │   │   ├── index.ts
│   │   │   └── useTranslation.ts
│   │   ├── notifications/           # Push notification system
│   │   │   ├── components/
│   │   │   │   ├── NotificationBell.tsx
│   │   │   │   └── NotificationGate.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useNotifications.ts
│   │   │   │   └── index.ts
│   │   │   ├── fcm.service.ts      # Firebase Cloud Messaging
│   │   │   ├── notification.service.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── pwa/                     # Progressive Web App
│   │   │   ├── PWAInstallPrompt.tsx
│   │   │   └── usePWAInstall.ts
│   │   ├── store/                   # Redux store setup
│   │   │   ├── store.ts            # configureStore + middleware
│   │   │   ├── rootReducer.ts      # Combines core + module reducers
│   │   │   ├── hooks.ts            # useAppDispatch, useAppSelector
│   │   │   ├── filtersSlice.ts     # Global filter state
│   │   │   ├── slices/
│   │   │   │   └── notification.slice.ts
│   │   │   └── index.ts
│   │   └── types/
│   │       ├── module.types.ts     # ModuleConfig, ModuleRoute, ModuleNavItem
│   │       └── index.ts
│   │
│   ├── shared/                      # Reusable across all modules
│   │   ├── components/
│   │   │   ├── ui/                  # Primitives (shadcn/ui based)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── collapsible.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── index.ts
│   │   │   ├── dashboard/           # Shared dashboard widgets
│   │   │   │   ├── DashboardError.tsx
│   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   ├── DashboardLoading.tsx
│   │   │   │   ├── StatusOverviewGrid.tsx
│   │   │   │   ├── SummaryCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── PageLoadError.tsx
│   │   │   ├── SearchableSelect.tsx
│   │   │   └── index.ts
│   │   ├── contexts/
│   │   │   ├── ThemeProvider.tsx    # Dark/light mode
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useCurrentTime.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useEditFormState.ts
│   │   │   ├── useFormErrors.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useScrollToError.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── common.types.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── cn.ts               # Tailwind class merger (clsx + twMerge)
│   │       ├── error.ts            # Error formatting utilities
│   │       ├── format.ts           # Date/number formatters
│   │       ├── formConditions.ts   # Form conditional logic
│   │       ├── storage.ts          # localStorage wrapper
│   │       └── index.ts
│   │
│   └── modules/                     # Feature modules (business logic)
│       ├── auth/                    # Authentication module
│       │   ├── components/
│       │   │   ├── ChangePasswordDialog.tsx
│       │   │   └── LoginForm.tsx
│       │   ├── pages/
│       │   │   ├── CompanySelectionPage.tsx
│       │   │   ├── LoadingUserPage.tsx
│       │   │   ├── LoginPage.tsx
│       │   │   └── ProfilePage.tsx
│       │   ├── schemas/
│       │   │   ├── changePassword.schema.ts
│       │   │   └── login.schema.ts
│       │   ├── utils/
│       │   │   └── profile.utils.ts
│       │   ├── module.config.tsx    # Routes + nav + lazy loading
│       │   ├── index.ts            # Public barrel
│       │   └── docs/README.md
│       │
│       ├── gate/                    # Gate Management (largest module)
│       │   ├── api/                 # Sub-domain API layers
│       │   │   ├── arrivalSlip/     # arrivalSlip.api.ts + .queries.ts
│       │   │   ├── attachment/
│       │   │   ├── construction/
│       │   │   ├── dailyNeed/
│       │   │   ├── department/
│       │   │   ├── driver/
│       │   │   ├── gateEntryFullView/
│       │   │   ├── maintenance/
│       │   │   ├── personGateIn/
│       │   │   ├── po/              # po.api + poReceipt.api
│       │   │   ├── quality/
│       │   │   ├── securityCheck/
│       │   │   ├── transporter/
│       │   │   ├── vehicle/         # vehicle.api + vehicleEntry.api
│       │   │   ├── weighment/
│       │   │   └── index.ts
│       │   ├── components/
│       │   │   ├── forms/           # Form shells (reusable form layouts)
│       │   │   │   ├── SecurityCheckFormShell.tsx
│       │   │   │   └── VehicleDriverFormShell.tsx
│       │   │   ├── persongatein/    # Sub-feature specific components
│       │   │   │   ├── CreateLabourDialog.tsx
│       │   │   │   ├── CreateVisitorDialog.tsx
│       │   │   │   └── ...
│       │   │   ├── CategorySelect.tsx
│       │   │   ├── TransporterSelect.tsx
│       │   │   ├── VehicleSelect.tsx
│       │   │   ├── DriverSelect.tsx
│       │   │   └── ... (15+ components)
│       │   ├── pages/
│       │   │   ├── shared/          # Shared page templates
│       │   │   │   ├── SharedStep1Page.tsx
│       │   │   │   ├── SharedStep2Page.tsx
│       │   │   │   ├── SharedAllPage.tsx
│       │   │   │   ├── SharedDashboard.tsx
│       │   │   │   └── SharedAttachmentsPage.tsx
│       │   │   ├── rawmaterialpages/
│       │   │   ├── constructionpages/
│       │   │   ├── dailyneedspages/
│       │   │   ├── maintenancepages/
│       │   │   ├── persongateinpages/
│       │   │   └── GateDashboardPage.tsx
│       │   ├── constants/
│       │   ├── hooks/
│       │   ├── schemas/             # Zod validation schemas
│       │   ├── types/
│       │   ├── utils/
│       │   ├── module.config.tsx
│       │   ├── index.ts
│       │   └── docs/README.md
│       │
│       ├── qc/                      # Quality Control module
│       │   ├── api/
│       │   │   ├── arrivalSlip/
│       │   │   ├── inspection/      # inspection.api.ts + .queries.ts
│       │   │   ├── materialType/
│       │   │   ├── qcParameter/
│       │   │   └── index.ts
│       │   ├── components/
│       │   ├── constants/
│       │   ├── hooks/
│       │   ├── pages/
│       │   │   ├── masterdata/      # Sub-section pages
│       │   │   └── ...
│       │   ├── types/
│       │   ├── module.config.tsx
│       │   └── index.ts
│       │
│       ├── grpo/                    # Goods Receipt PO module
│       │   ├── api/
│       │   ├── components/
│       │   ├── constants/
│       │   ├── pages/
│       │   ├── schemas/
│       │   ├── types/
│       │   ├── module.config.tsx
│       │   └── index.ts
│       │
│       ├── notifications/           # Notification management
│       │   ├── api/
│       │   ├── pages/
│       │   ├── types/
│       │   ├── module.config.tsx
│       │   └── index.ts
│       │
│       └── dashboard/               # Main dashboard
│           ├── components/
│           ├── pages/
│           ├── module.config.tsx
│           └── index.ts
│
├── vite.config.ts                   # Build config + path alias + PWA
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 3. Layer-by-Layer Breakdown

### Layer 1: `config/` — Application Configuration

**Purpose:** Single source of truth for all application-wide settings.

| File / Folder | Responsibility |
|---|---|
| `constants/api.constants.ts` | Every API endpoint URL mapped as `API_ENDPOINTS.MODULE.ACTION` |
| `constants/auth.constants.ts` | Token prefix, refresh intervals, storage keys |
| `constants/status.constants.ts` | Status enums shared across modules |
| `constants/ui.constants.ts` | Pagination sizes, debounce delays |
| `constants/validation.constants.ts` | Max lengths, regex patterns |
| `permissions/*.permissions.ts` | Django permission strings per module |
| `env.config.ts` | Typed `import.meta.env` wrapper — fails fast on missing vars |
| `query.config.ts` | React Query defaults (staleTime, gcTime, retry) |
| `runtime.config.ts` | Config loaded at runtime before React renders |

**Performance optimization:** Centralizing API endpoints prevents string duplication across the bundle. Constants are tree-shakeable because they are named exports.

---

### Layer 2: `shared/` — Reusable Foundation

**Purpose:** Zero business logic. Pure UI primitives, utility hooks, and type definitions.

```
shared/
├── components/ui/     → shadcn/ui primitives (Button, Card, Dialog, Input...)
├── components/        → Higher-level shared (ErrorBoundary, SearchableSelect)
├── components/dashboard/ → Reusable dashboard widgets (SummaryCard, StatusGrid)
├── hooks/             → useDebounce, useLocalStorage, useFormErrors...
├── contexts/          → ThemeProvider (dark/light mode)
├── types/             → Shared TypeScript interfaces
└── utils/             → cn(), formatDate(), error helpers
```

**Key optimizations:**
- **`cn()` utility** — Merges Tailwind classes efficiently using `clsx` + `tailwind-merge`, preventing class conflicts.
- **`SearchableSelect`** — Reusable async select with debounced search, used by every `*Select` component in modules.
- **`ErrorBoundary`** — Global crash handler prevents white-screen-of-death.
- **`useDebounce`** — Prevents excessive API calls on search inputs.
- **`useScrollToError`** — Auto-scrolls to first form validation error for UX.

---

### Layer 3: `core/` — Infrastructure Services

**Purpose:** Application-wide technical services. Not business logic — infrastructure.

#### `core/api/` — HTTP Client

```typescript
// Single Axios instance with interceptors
const apiClient = createApiClient();

// Request interceptor: Auto-attaches JWT + Company-Code header
// Response interceptor: Auto-refreshes expired tokens + transforms errors
```

**Optimizations:**
- **Proactive token refresh** — Checks token expiry BEFORE the request. If expiring soon, refreshes first. Prevents 401 round-trips.
- **Failed request queue** — When a 401 occurs during refresh, all concurrent requests queue up. Once refresh completes, they all retry with the new token. No duplicate refreshes.
- **Centralized error transformation** — Every API error is normalized to `ApiError { message, code, errors, status }`. Components never parse raw Axios errors.
- **Global toast notifications** — API errors auto-show toasts. Skip 401 (handled by redirect) and 404 (handled by page UI).

#### `core/auth/` — Authentication

```
auth/
├── components/
│   ├── AuthInitializer.tsx   → Restores session from IndexedDB on app load
│   ├── ProtectedRoute.tsx    → Route guard with permission checking
│   └── Authorized.tsx        → Inline permission gate for UI elements
├── services/
│   ├── auth.service.ts       → Login/logout/refresh API calls
│   └── indexedDb.service.ts  → Token persistence in IndexedDB (not localStorage)
├── store/
│   ├── authSlice.ts          → Redux state: user, tokens, permissions
│   └── authSyncMiddleware.ts → Cross-tab session synchronization
└── utils/
    └── tokenRefresh.util.ts  → Smart refresh logic with expiry detection
```

**Why IndexedDB over localStorage?**
- Async access — doesn't block the main thread
- Larger storage capacity
- Works in Web Workers (for service worker auth)
- Not sent with every HTTP request like cookies

**Performance:** `authSyncMiddleware` uses `BroadcastChannel` to sync auth state across browser tabs. One tab refreshes the token, all tabs get it instantly.

#### `core/store/` — Redux Store

```typescript
// rootReducer.ts — Dynamic reducer composition
export const rootReducer = combineReducers({
  auth: authReducer,           // Core
  filters: filtersReducer,     // Core
  notification: notificationReducer, // Core
  ...getAllReducers(),          // ← Modules inject their reducers dynamically
});
```

**Optimization:** Modules register their Redux slices via `module.config.tsx`. The root reducer auto-discovers them at build time. Adding a new module's state requires zero changes to `core/`.

---

### Layer 4: `app/` — Application Shell

**Purpose:** Composes everything. No business logic — pure orchestration.

```
app/
├── App.tsx          → ErrorBoundary → Providers → Auth → Routes
├── providers/       → Redux + React Query + Router + Theme + Notifications
├── registry/        → Module discovery + route/nav/reducer aggregation
├── routes/          → Renders routes from registry
└── layouts/         → AuthLayout (public), MainLayout (sidebar + header)
```

#### Module Registry — The Plug-in System

```typescript
// registry/index.ts
export const moduleRegistry: ModuleConfig[] = [
  authModuleConfig,
  dashboardModuleConfig,
  gateModuleConfig,
  qcModuleConfig,
  grpoModuleConfig,
  notificationsModuleConfig,
];

// Extract routes, navigation, and reducers from all modules
export function getAllRoutes(): ModuleRoute[] { ... }
export function getAllNavigation(): ModuleNavItem[] { ... }
export function getAllReducers(): Record<string, Reducer> { ... }
```

**Why this matters:**
- Adding a new module = create `module.config.tsx` + add one line to registry
- Routes, sidebar nav, and Redux state are auto-discovered
- No scattered route files. No manual reducer wiring.

---

## 4. Module System — The Core Pattern

Every feature module follows an **identical internal structure:**

```
modules/{moduleName}/
├── api/                    # API layer (data fetching)
│   ├── {domain}/
│   │   ├── {domain}.api.ts       # Raw API functions (axios calls)
│   │   ├── {domain}.queries.ts   # React Query hooks (useQuery/useMutation)
│   │   └── index.ts              # Re-exports
│   └── index.ts
├── components/             # Module-specific UI components
│   ├── forms/              # Form shells / layouts
│   ├── {SubFeature}Select.tsx
│   └── index.ts
├── pages/                  # Route-level page components
│   ├── {SubFeature}Page.tsx
│   ├── {subfeature}pages/  # Sub-feature page groups
│   └── index.ts
├── hooks/                  # Module-specific hooks
│   └── index.ts
├── types/                  # TypeScript interfaces for this module
│   ├── {module}.types.ts
│   └── index.ts
├── constants/              # Module-level constants
│   ├── {module}.constants.ts
│   └── index.ts
├── schemas/                # Zod validation schemas
│   ├── {entity}.schema.ts
│   └── index.ts
├── utils/                  # Module-specific helpers
│   └── index.ts
├── module.config.tsx       # ★ Routes + navigation + lazy imports
├── index.ts                # Public barrel export
└── docs/README.md          # Module documentation
```

### `module.config.tsx` — The Module Contract

Each module exports a `ModuleConfig` object:

```typescript
export const qcModuleConfig: ModuleConfig = {
  name: 'qc',
  routes: [
    {
      path: '/qc',
      element: <QCDashboardPage />,    // ← lazy loaded
      layout: 'main',
      permissions: [QC_PERMISSIONS.INSPECTION.VIEW],
    },
    // ...
  ],
  navigation: [
    {
      path: '/qc',
      title: 'Quality Control',
      icon: FlaskConical,
      showInSidebar: true,
      hasSubmenu: true,
      children: [ /* submenu items */ ],
    },
  ],
  // Optional: reducer: { sliceName: sliceReducer }
};
```

**This single file defines:**
- What pages exist and their routes
- What appears in the sidebar
- What permissions are required
- How pages are code-split (lazy loading)

---

## 5. API Layer Architecture

### Two-File Pattern: `*.api.ts` + `*.queries.ts`

Every API domain follows a strict separation:

```
api/{domain}/
├── {domain}.api.ts       # Pure functions — axios calls, no React hooks
├── {domain}.queries.ts   # React Query hooks — uses the .api functions
└── index.ts              # Re-exports both
```

#### `{domain}.api.ts` — Raw API Functions

```typescript
// inspection.api.ts
export const inspectionApi = {
  async getList(params?: InspectionListParams): Promise<InspectionListItem[]> {
    const response = await apiClient.get<InspectionListItem[]>(
      API_ENDPOINTS.QUALITY_CONTROL_V2.INSPECTIONS_LIST + buildQueryString(params)
    );
    return response.data;
  },
  async getById(id: number): Promise<Inspection> { ... },
  async create(slipId: number, data: CreateInspectionRequest): Promise<Inspection> { ... },
};
```

**Rules:**
- Returns typed data directly (not AxiosResponse)
- Uses centralized `API_ENDPOINTS` — never hardcoded strings
- Uses the shared `apiClient` — never creates its own axios instance
- Pure async functions — testable without React

#### `{domain}.queries.ts` — React Query Hooks

```typescript
// Structured query key factory — prevents key collisions
export const INSPECTION_QUERY_KEYS = {
  all: ['inspections'] as const,
  list: (params?) => [...INSPECTION_QUERY_KEYS.all, 'list', ...(params ? [params] : [])] as const,
  detail: (id: number) => [...INSPECTION_QUERY_KEYS.all, 'detail', id] as const,
};

// Query hook
export function useInspection(id: number | null) {
  return useQuery({
    queryKey: INSPECTION_QUERY_KEYS.detail(id!),
    queryFn: () => inspectionApi.getById(id!),
    enabled: !!id,       // ← Conditional fetching
  });
}

// Mutation hook with cache invalidation
export function useCreateInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slipId, data }) => inspectionApi.create(slipId, data),
    onSuccess: (_, { slipId }) => {
      queryClient.invalidateQueries({ queryKey: INSPECTION_QUERY_KEYS.all });
    },
  });
}
```

**Performance optimizations:**
- **Query key factory pattern** — Hierarchical keys enable precise cache invalidation. Invalidating `['inspections']` clears all inspection caches. Invalidating `['inspections', 'detail', 5]` only clears one.
- **`staleTime: 30s`** — Prevents refetching the same data within 30 seconds. Navigation between tabs reuses cached data.
- **`enabled` flag** — Queries don't fire until dependencies are ready (e.g., wait for ID from route params).
- **`refetchInterval`** — Pending inspections auto-poll every 60 seconds for real-time updates.
- **Targeted invalidation** — Mutations only invalidate related queries, not the entire cache.

---

## 6. State Management Strategy

### Dual-State Architecture: Redux + React Query

| Concern | Tool | Why |
|---|---|---|
| **Server data** (API responses) | React Query | Automatic caching, background refetch, stale management |
| **Client state** (auth, UI, filters) | Redux Toolkit | Persistent, synchronous, cross-component |
| **Form state** | React Hook Form + Zod | Local to form, validated schemas |

**Why not put everything in Redux?**
- Server state has different lifecycle (stale, loading, error, refetching)
- React Query handles caching, deduplication, and background updates automatically
- Redux would require manual cache management for every API call

### React Query Global Configuration

```typescript
// config/query.config.ts
export const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 min — data considered fresh
      gcTime: 10 * 60 * 1000,       // 10 min — garbage collect unused cache
      retry: 1,                      // Retry once on failure
      refetchOnWindowFocus: false,   // Don't spam API on tab switch
      refetchOnReconnect: true,      // Refetch when network comes back
    },
    mutations: {
      retry: 0,                      // Never auto-retry mutations
    },
  },
};
```

---

## 7. Performance Optimizations

### 7.1 Code Splitting via Lazy Loading

Every page is lazy-loaded in `module.config.tsx`:

```typescript
const QCDashboardPage = lazy(() => import('./pages/QCDashboardPage'));
```

**Impact:** Initial bundle only contains `app/`, `core/`, and `shared/`. Module pages load on-demand when navigated to.

### 7.2 Route-Level Suspense

```typescript
// AppRoutes.tsx
<Suspense fallback={<PageLoadError />}>
  <Routes>...</Routes>
</Suspense>
```

Shows a loading skeleton while lazy chunks download.

### 7.3 Proactive Token Refresh

```
Timeline:  [Token issued] ──────────────── [Expiry]
                              ↑
                     Proactive refresh
                     (before it expires)
```

The `apiClient` checks token expiry on EVERY request. If the token is about to expire, it refreshes proactively — preventing 401 errors entirely.

### 7.4 Request Deduplication

React Query automatically deduplicates identical requests. If 3 components call `useInspections()`, only 1 network request fires.

### 7.5 Smart Cache Invalidation

```typescript
onSuccess: (result) => {
  // Only invalidate what changed
  queryClient.invalidateQueries({ queryKey: INSPECTION_QUERY_KEYS.all });
  queryClient.invalidateQueries({ queryKey: INSPECTION_QUERY_KEYS.detail(result.id) });
};
```

### 7.6 Conditional Queries

```typescript
useQuery({
  queryKey: ['inspection', id],
  queryFn: () => api.getById(id!),
  enabled: !!id,  // Don't fetch until ID exists
});
```

Prevents wasted API calls when route params aren't ready.

### 7.7 Debounced Search

```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
// API call only fires after 300ms of no typing
```

### 7.8 IndexedDB for Token Storage

Tokens stored in IndexedDB instead of localStorage:
- Non-blocking async reads
- Doesn't interfere with SSR
- Larger storage limits
- Not included in HTTP headers automatically (security)

### 7.9 Vite + SWC Compilation

```typescript
// vite.config.ts
plugins: [react()]  // @vitejs/plugin-react-swc
```

SWC compiles TypeScript/JSX 20-70x faster than Babel. Development HMR is near-instant.

### 7.10 PWA with Auto-Update

```typescript
VitePWA({
  registerType: 'autoUpdate',  // Service worker auto-updates
})
```

Enables offline caching, app-like installation, and push notifications.

### 7.11 Redux DevTools (Dev Only)

```typescript
devTools: import.meta.env.DEV  // Stripped from production builds
```

### 7.12 Filter State Persistence

```typescript
// Only save when filters actually change
if (currentFilters !== previousFilters) {
  saveFiltersToStorage(currentFilters);
}
```

Reference equality check prevents unnecessary localStorage writes.

---

## 8. Authentication & Security Architecture

```
┌──────────────────────────────────────────────────┐
│                  App Boot                         │
│  main.tsx → loadRuntimeConfig() → render App     │
├──────────────────────────────────────────────────┤
│              AuthInitializer                      │
│  1. Read tokens from IndexedDB                   │
│  2. Validate token expiry                        │
│  3. Restore user session → Redux store           │
│  4. Fetch user permissions                       │
├──────────────────────────────────────────────────┤
│              ProtectedRoute                       │
│  1. Check: Is user authenticated?                │
│  2. Check: Does user have required permissions?  │
│  3. If no → redirect to /login or /unauthorized  │
├──────────────────────────────────────────────────┤
│              Authorized Component                 │
│  Inline permission check for UI elements:        │
│  <Authorized permissions={[...]}>                │
│    <DeleteButton />                              │
│  </Authorized>                                   │
└──────────────────────────────────────────────────┘
```

### Permission Model

Permissions follow Django's format: `app_label.permission_codename`

```typescript
// config/permissions/qc.permissions.ts
export const QC_PERMISSIONS = {
  INSPECTION: {
    CREATE: 'quality_control.add_rawmaterialinspection',
    VIEW: 'quality_control.view_rawmaterialinspection',
  },
  APPROVAL: {
    APPROVE_AS_CHEMIST: 'quality_control.can_approve_as_chemist',
    APPROVE_AS_QAM: 'quality_control.can_approve_as_qam',
  },
} as const;
```

Permissions are enforced at **three levels:**
1. **Route level** — `ProtectedRoute` prevents unauthorized page access
2. **Component level** — `<Authorized>` hides UI elements
3. **Sidebar level** — Navigation items filtered by user permissions

---

## 9. Code Splitting & Bundle Optimization

### What ships in the initial bundle:

```
main.tsx → App.tsx → AppProviders → AuthInitializer → AppRoutes
         ↓           ↓                ↓
       core/api    core/auth       core/store
         ↓           ↓                ↓
       shared/     config/          (small)
```

### What is loaded on-demand (per route):

```
/qc           → QCDashboardPage chunk
/qc/pending   → PendingInspectionsPage chunk
/gate         → GateDashboardPage chunk
/grpo         → GRPODashboardPage chunk
```

Each page is a separate chunk. Vite handles chunk optimization automatically.

---

## 10. Barrel Export Pattern

Every folder has an `index.ts` that re-exports its public API:

```typescript
// shared/hooks/index.ts
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useFormErrors, type UseFormErrorsReturn } from './useFormErrors';
```

**Benefits:**
- Clean imports: `import { useDebounce } from '@/shared/hooks'`
- Encapsulation: Internal files are hidden behind the barrel
- Refactoring: Move files internally without breaking imports

**Rules:**
- Types are explicitly exported with `type` keyword
- Only public API surfaces through barrels
- Modules export through their root `index.ts`

---

## 11. Naming Conventions

| Category | Convention | Example |
|---|---|---|
| **Pages** | `PascalCase` + `Page` suffix | `QCDashboardPage.tsx` |
| **Components** | `PascalCase` | `TransporterSelect.tsx` |
| **Hooks** | `camelCase` with `use` prefix | `useInspectionPermissions.ts` |
| **API files** | `camelCase` + `.api.ts` | `inspection.api.ts` |
| **Query files** | `camelCase` + `.queries.ts` | `inspection.queries.ts` |
| **Types** | `camelCase` + `.types.ts` | `qc.types.ts` |
| **Schemas** | `camelCase` + `.schema.ts` | `driver.schema.ts` |
| **Constants** | `camelCase` + `.constants.ts` | `wizard.constants.ts` |
| **Permissions** | `camelCase` + `.permissions.ts` | `qc.permissions.ts` |
| **Config** | `camelCase` + `.config.ts` | `query.config.ts` |
| **Services** | `camelCase` + `.service.ts` | `auth.service.ts` |
| **Slices** | `camelCase` + `Slice.ts` | `authSlice.ts` |
| **Utils** | `camelCase` + `.util.ts` | `tokenRefresh.util.ts` |
| **Tests** | Mirror source + `.test.ts(x)` | `inspection.api.test.ts` |
| **Module config** | Always `module.config.tsx` | — |
| **Barrel files** | Always `index.ts` | — |

### Folder Naming

| Pattern | Example |
|---|---|
| Sub-feature pages | `rawmaterialpages/`, `constructionpages/` |
| API domains | `arrivalSlip/`, `inspection/`, `po/` |
| Shared page templates | `pages/shared/` |
| Form components | `components/forms/` |

---

## 12. Testing Architecture

Tests mirror the source tree under `__tests__/` at each layer:

```
src/
├── modules/qc/
│   ├── api/inspection/inspection.api.ts
│   └── __tests__/api/inspection/inspection.api.test.ts   ← mirrors source
├── shared/hooks/useDebounce.ts
│   └── __tests__/hooks/useDebounce.test.ts
└── core/auth/store/authSlice.ts
    └── __tests__/auth/store/authSlice.test.ts
```

### Testing Tooling

| Tool | Purpose |
|---|---|
| **Vitest** | Test runner (Vite-native, fast) |
| **jsdom** | Browser environment simulation |
| **vi.mock()** | Module mocking |

### Coverage: 100% of source files (300/300)

---

## 13. Configuration Management

### Path Alias

```typescript
// vite.config.ts
resolve: { alias: { '@': path.resolve(__dirname, './src') } }

// tsconfig.json
"paths": { "@/*": ["./src/*"] }
```

All imports use `@/` prefix:
```typescript
import { apiClient } from '@/core/api';
import { QC_PERMISSIONS } from '@/config/permissions';
import { Button } from '@/shared/components/ui';
```

### Environment Configuration

```
.env                 → VITE_API_BASE_URL, VITE_APP_ENV
.env.development     → Dev overrides
.env.production      → Prod overrides
```

Accessed through typed `env` config:
```typescript
import { env } from '@/config/env.config';
env.apiBaseUrl  // string — type-safe
env.isDev       // boolean
```

---

## 14. How to Add a New Module

### Step 1: Create the module folder

```
src/modules/inventory/
├── api/
│   └── index.ts
├── components/
│   └── index.ts
├── pages/
│   ├── InventoryDashboardPage.tsx
│   └── index.ts
├── types/
│   ├── inventory.types.ts
│   └── index.ts
├── constants/
│   └── index.ts
├── module.config.tsx
└── index.ts
```

### Step 2: Define permissions

```typescript
// config/permissions/inventory.permissions.ts
export const INVENTORY_PERMISSIONS = {
  VIEW: 'inventory.view_inventory',
  MANAGE: 'inventory.change_inventory',
} as const;
```

### Step 3: Create module.config.tsx

```typescript
import { Package } from 'lucide-react';
import { lazy } from 'react';
import type { ModuleConfig } from '@/core/types';
import { INVENTORY_PERMISSIONS } from '@/config/permissions';

const InventoryDashboardPage = lazy(() => import('./pages/InventoryDashboardPage'));

export const inventoryModuleConfig: ModuleConfig = {
  name: 'inventory',
  routes: [
    {
      path: '/inventory',
      element: <InventoryDashboardPage />,
      layout: 'main',
      permissions: [INVENTORY_PERMISSIONS.VIEW],
    },
  ],
  navigation: [
    {
      path: '/inventory',
      title: 'Inventory',
      icon: Package,
      showInSidebar: true,
      permissions: [INVENTORY_PERMISSIONS.VIEW],
    },
  ],
};
```

### Step 4: Register in the registry

```typescript
// app/registry/index.ts
import { inventoryModuleConfig } from '@/modules/inventory/module.config';

export const moduleRegistry: ModuleConfig[] = [
  // ...existing modules
  inventoryModuleConfig,  // ← Add this line
];
```

**Done.** Routes, sidebar navigation, and permissions work automatically.

---

## Summary of Key Design Decisions

| Decision | Rationale |
|---|---|
| Module-based architecture | Teams can work on modules independently |
| Strict layer boundaries | Prevents circular dependencies |
| API + Queries split | Raw functions testable without React; hooks handle caching |
| Query key factories | Precise cache invalidation without over-invalidating |
| Centralized API endpoints | Single source of truth, no scattered strings |
| Lazy-loaded pages | Smaller initial bundle, faster first load |
| Module registry pattern | Adding modules requires minimal boilerplate |
| IndexedDB for tokens | Async, secure, large capacity |
| Permission constants | Type-safe, matches Django backend exactly |
| Barrel exports | Clean imports, encapsulated internals |
| Dual-state (Redux + RQ) | Right tool for each state type |
| Proactive token refresh | Zero 401s during normal usage |
