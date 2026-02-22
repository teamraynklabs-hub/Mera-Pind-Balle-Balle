# State Management

## Overview

The application uses **React Context API** for global state management. There is no Redux, Zustand, or other external state library. This keeps the bundle size small and the architecture simple.

## State Providers

### 1. CartContext

**File**: `src/context/CartContext.tsx`

**Purpose**: Shopping cart state with localStorage persistence.

```typescript
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

**Persistence**: Cart data is stored in `localStorage` under key `mpbb-cart`. Hydrated on mount to avoid SSR mismatch.

**Usage**:
```tsx
const { items, addToCart, totalPrice } = useCart();
```

### 2. UserAuthContext

**File**: `src/context/UserAuthContext.tsx`

**Purpose**: Customer authentication state (separate from admin NextAuth).

```typescript
interface UserAuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requireAuth: () => boolean;
}
```

**Token flow**: JWT stored in HTTP-only cookie (`mpbb-user-token`). User data fetched from `/api/auth/me` on mount.

**Usage**:
```tsx
const { user, login, logout, requireAuth } = useUserAuth();
```

### 3. AuthSessionProvider (NextAuth)

**File**: `src/components/providers/AuthSessionProvider.tsx`

**Purpose**: Wraps the app with NextAuth `SessionProvider` for admin authentication.

**Usage**: Admin pages access session via `useSession()` hook from `next-auth/react`.

### 4. ThemeProvider

**File**: `src/components/providers/ThemeProvider.tsx`

**Purpose**: Dark/light mode management using `next-themes`.

**Configuration**:
- `attribute="class"` — applies `.dark` class to `<html>`
- `defaultTheme="system"` — follows OS preference
- Theme toggle via `toggleBtn.tsx` component

## Data Fetching Patterns

### Server Components (preferred)

```tsx
// Direct database/API calls in server components
export default async function BlogPage() {
  const res = await fetch(`${baseUrl}/api/blogs`, { cache: "no-store" });
  const { data } = await res.json();
  return <BlogPageClient blogs={data} />;
}
```

### Client-Side Polling

```tsx
// HomePageContent.tsx — periodic refresh
const POLL_INTERVAL = 120_000; // 2 minutes

useEffect(() => {
  fetchData(true); // initial load
  const interval = setInterval(() => fetchData(false), POLL_INTERVAL);
  return () => clearInterval(interval);
}, [fetchData]);
```

### Form Submissions

```tsx
// react-hook-form pattern
const { register, handleSubmit, formState: { errors }, reset } = useForm<Schema>({
  resolver: zodResolver(schema),
});

const onSubmit = async (data: Schema) => {
  await axios.post("/api/endpoint", data);
  reset();
};
```

## State Flow Diagram

```
User Action
    │
    ▼
Context Provider (CartContext / UserAuthContext)
    │
    ├── Updates local state (useState)
    ├── Persists to localStorage (cart) or cookie (auth)
    │
    ▼
Re-render consuming components
    │
    ▼
API call (if needed)
    │
    ▼
Server response → Update state → Re-render
```

## Key Principles

1. **No global state library** — Context API is sufficient for cart + auth
2. **Server-first data fetching** — Server components fetch data; client components receive as props
3. **Minimal client state** — Only interactive state lives in client components
4. **localStorage for persistence** — Cart survives page refreshes
5. **HTTP-only cookies for auth** — Tokens are never accessible to JavaScript
