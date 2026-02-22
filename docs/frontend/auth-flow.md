# Authentication Flow

## Overview

The system implements a **dual authentication architecture**:

1. **Admin Authentication** — NextAuth.js v5 with JWT session strategy
2. **User Authentication** — Custom JWT with HTTP-only cookies

## Admin Authentication (NextAuth.js)

### Flow

```
Admin Login Page (/admin-login)
    │
    ▼
signIn("credentials", { email, password })
    │
    ▼
NextAuth CredentialsProvider.authorize()
    │
    ├── Compare email against ADMIN_EMAIL env var
    ├── Compare password against ADMIN_PASSWORD env var
    │
    ▼
JWT Token Created (1 hour expiry)
    │
    ├── jwt callback: { id, name, email, role }
    ├── session callback: maps token → session.user
    │
    ▼
Cookie: next-auth.session-token (HTTP-only)
    │
    ▼
Middleware checks session on /admin/* routes
    │
    ├── Valid session + admin role → Allow access
    └── Invalid/missing → Redirect to /admin-login
```

### Configuration Files

| File | Purpose |
|------|---------|
| `src/auth.ts` | NextAuth setup, CredentialsProvider, JWT/session callbacks |
| `src/auth.config.ts` | Edge-safe callbacks for middleware |
| `src/middleware.ts` | Route protection (Edge runtime) |
| `src/types/next-auth.d.ts` | TypeScript augmentation for role field |

### Session Structure

```typescript
interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "editor";
  }
}
```

### Admin API Protection

```typescript
// src/lib/requireAdmin.ts
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
```

## User Authentication (Custom JWT)

### Flow

```
Login Page (/login) or Signup Page (/signup)
    │
    ▼
POST /api/auth/login or POST /api/auth/register
    │
    ├── Validate credentials
    ├── Hash password (signup) or verify password (login)
    ├── Create/find User document
    │
    ▼
signUserToken({ userId, email, name })
    │
    ▼
Set Cookie: mpbb-user-token (HTTP-only, 7 days)
    │
    ▼
UserAuthContext.refreshUser()
    │
    ▼
GET /api/auth/me → Returns user data
    │
    ▼
Context state updated → UI re-renders
```

### Token Management

```typescript
// src/lib/auth/user-jwt.ts

signUserToken(payload: { userId, email, name }): string
// JWT with 7-day expiration, signed with JWT_SECRET

verifyUserToken(token: string): UserPayload | null
// Decodes and validates JWT

getUserFromCookie(): Promise<UserPayload | null>
// Reads mpbb-user-token cookie, verifies, returns payload
```

### Password Hashing

```typescript
// src/lib/auth/hash.ts
hashPassword(password: string): Promise<string>    // bcryptjs, 10 rounds
verifyPassword(plain: string, hashed: string): Promise<boolean>
```

## Logout Flow

### Admin Logout

```
AdminLogoutButton.onClick()
    │
    ▼
signOut({ callbackUrl: "/admin-login" })
    │
    ▼
NextAuth clears session cookie
    │
    ▼
Redirect to /admin-login
```

### User Logout

```
useUserAuth().logout()
    │
    ▼
POST /api/auth/user-logout
    │
    ▼
Server clears mpbb-user-token cookie
    │
    ▼
Context sets user = null
    │
    ▼
Redirect to /login
```

## Protected Operations

| Operation | Auth Required | Method |
|-----------|---------------|--------|
| Browse products | None | Public |
| View cart | None | Client-side |
| Place order | User JWT | Cookie verification |
| Submit contact form | None | Public |
| Apply as distributor | None | Public |
| Admin CRUD operations | Admin session | NextAuth + requireAdmin() |
| File upload | Admin session OR API key | Session or x-admin-key header |

## Security Measures

- Admin credentials stored in environment variables (never in code or docs)
- User passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens in HTTP-only cookies (not accessible via JavaScript)
- Admin session expires after 1 hour
- User tokens expire after 7 days
- Middleware runs at Edge for fast route protection
- CSRF protection via same-origin cookie policy
- Admin API routes double-check session via `requireAdmin()`
