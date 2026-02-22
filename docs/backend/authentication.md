# Authentication

## Overview

The system implements a **dual authentication architecture** with separate flows for admin users and customers.

| Concern | Admin Auth | User Auth |
|---------|-----------|-----------|
| Library | NextAuth.js v5 | Custom JWT |
| Provider | CredentialsProvider | Manual implementation |
| Token Storage | next-auth.session-token cookie | mpbb-user-token cookie |
| Expiry | 1 hour | 7 days |
| Credential Source | Environment variables (.env) | User model (MongoDB) |
| Roles | admin | customer (implicit) |
| Password Verification | Direct env var comparison | bcryptjs (10 rounds) |

## Admin Authentication

### Configuration

**Files**: `src/auth.ts`, `src/auth.config.ts`

Admin credentials are configured via environment variables in `.env.local`:
- `ADMIN_EMAIL` — admin login email
- `ADMIN_PASSWORD` — admin login password

To change admin credentials, update these values in `.env.local` and restart the server.

### Admin Login Flow

```
POST /api/auth/[...nextauth] (via signIn("credentials"))
  → CredentialsProvider.authorize()
    → Compare credentials against ADMIN_EMAIL and ADMIN_PASSWORD env vars
    → Return admin user object or null
  → JWT token created
  → Cookie set: next-auth.session-token
  → Redirect to /admin/dashboard
```

## User Authentication

### Registration

**Endpoint**: `POST /api/auth/register`

```
Request Body: { name, email, phone, password }
  → Validate input
  → Check existing user by email
  → hashPassword(password) — bcryptjs, 10 rounds
  → User.create({ name, email, phone, password: hashed })
  → signUserToken({ userId, email, name })
  → Set cookie: mpbb-user-token (httpOnly, 7 days)
  → Return { success: true, user }
```

### Login

**Endpoint**: `POST /api/auth/login`

```
Request Body: { email, password }
  → User.findOne({ email })
  → verifyPassword(password, user.password)
  → signUserToken({ userId, email, name })
  → Set cookie: mpbb-user-token (httpOnly, 7 days)
  → Return { success: true, user }
```

### Current User

**Endpoint**: `GET /api/auth/me`

```
  → getUserFromCookie()
    → Read mpbb-user-token from cookies
    → verifyUserToken(token)
    → Return user payload or null
  → If valid: User.findById(userId).select("-password")
  → Return { success: true, user }
```

### Logout

**Endpoint**: `POST /api/auth/user-logout`

```
  → Delete mpbb-user-token cookie
  → Return { success: true }
```

## Token Management

### JWT Signing (User)

**File**: `src/lib/auth/user-jwt.ts`

```typescript
signUserToken(payload: { userId, email, name }): string
  → jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })

verifyUserToken(token: string): UserPayload | null
  → jwt.verify(token, JWT_SECRET)

getUserFromCookie(): Promise<UserPayload | null>
  → cookies().get("mpbb-user-token")
  → verifyUserToken(cookie.value)
```

### Password Hashing

**File**: `src/lib/auth/hash.ts`

```typescript
hashPassword(password): Promise<string>
  → bcryptjs.hash(password, 10)

verifyPassword(password, hashed): Promise<boolean>
  → bcryptjs.compare(password, hashed)
```

## Route Protection

### Middleware (Edge)

**File**: `src/middleware.ts`

- Runs on every request matching `/admin/*` and `/api/distributors/*`
- Uses NextAuth's `auth()` to check session
- Admin pages: requires session with `role === "admin"`
- API mutations: requires admin role for POST/PATCH/DELETE

### API Route Protection

**File**: `src/lib/requireAdmin.ts`

```typescript
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
```

Used at the top of every admin API route handler.

## Security Measures

- HTTP-only cookies prevent XSS token theft
- bcryptjs with 10 salt rounds for user password hashing
- JWT tokens are signed, not encrypted (payload is base64, not secret)
- Admin sessions expire after 1 hour for security
- User tokens expire after 7 days for convenience
- Admin credentials stored securely in environment variables (never committed to repo)
- No token refresh mechanism — user must re-login after expiry
