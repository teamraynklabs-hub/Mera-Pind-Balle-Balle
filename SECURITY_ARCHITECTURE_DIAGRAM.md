# 🔐 Admin Session Security - Architecture Diagram

## Security Layers Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL SECURITY                        │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: ENTRY POINT
├─ /admin-login page
├─ Email & Password Required
├─ Verified against AdminUser model
└─ JWT token created on success

LAYER 2: SESSION MANAGEMENT
├─ Strategy: JWT (stateless)
├─ Max Age: 1 hour (3600 seconds)
├─ Token stored in secure cookie
└─ Refreshed on valid requests

LAYER 3: ACTIVITY MONITORING
├─ Listens to: click, keypress, scroll, touch
├─ Inactivity Timeout: 15 minutes
├─ Resets on any user interaction
└─ Auto-logout if no activity

LAYER 4: MIDDLEWARE PROTECTION
├─ All /admin routes checked
├─ Role verification required
├─ Session validation
└─ Redirects to login if invalid

LOGOUT MECHANISM
├─ Manual: User clicks "Logout" button
├─ Automatic: Inactivity (15 mins)
├─ Automatic: Session timeout (1 hour)
└─ Result: Complete session destruction
```

---

## Request Flow Diagram

### 1. LOGIN FLOW
```
┌──────────────────┐
│  User Enters     │
│  Credentials     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  Verify Password     │
│  Against Database    │
└────────┬─────────────┘
         │
    ✓ Valid ✗ Invalid
    │         │
    ▼         ▼
┌────────┐ ┌───────────────────┐
│Create  │ │Show Error Message │
│JWT     │ │ Redirect to login │
│Token   │ └───────────────────┘
└────┬───┘
     │
     ▼
┌──────────────────┐
│ Set Session      │
│ Cookie          │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Redirect to      │
│ /admin           │
└──────────────────┘
```

### 2. LOGOUT FLOW
```
┌──────────────────────┐
│  User Clicks         │
│  "Logout" Button     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Confirmation        │
│  Dialog Shows        │
└────────┬─────────────┘
         │
      Yes│ │No
        ▼ ▼
    ✓   ✗ (Close)
    │   │
    ▼   └─► Continue Session
┌──────────────────────────┐
│  POST /api/auth/logout   │
│  - Destroy JWT token     │
│  - Clear cookies         │
│  - Clear storage         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────┐
│ Redirect to          │
│ /admin-login         │
└──────────────────────┘
```

### 3. INACTIVITY CHECK FLOW
```
┌─────────────────────────┐
│ User Logged In          │
│ Activity Timer: 15 mins │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │ Activity?│
    └────┬────┘
         │
    ✓ Yes✗ No
    │     │
    ▼     │ (Wait more)
┌─────┐  │
│Reset│  │ (15 mins elapsed)
│Timer│  │
└─────┘  ▼
      ┌──────────────────────┐
      │ Auto-Logout          │
      │ - Destroy session    │
      │ - Clear cookies      │
      │ - Redirect to login  │
      └──────────────────────┘
```

### 4. PAGE ACCESS FLOW
```
┌──────────────────────┐
│ Request /admin page  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Check Session in     │
│ Cookie/JWT           │
└────────┬─────────────┘
         │
    ┌────┴─────┐
    │Valid &    │
    │Admin Role?│
    └────┬─────┘
         │
    ✓Yes │ ✗No
    │    │
    ▼    ▼
┌────────┐ ┌──────────────────┐
│ Render │ │ Redirect to      │
│ Page   │ │ /admin-login     │
└────────┘ └──────────────────┘
```

---

## File Structure

```
src/
├── auth.ts                          (JWT config, session timeout)
├── auth.config.ts                   (Auth callbacks)
├── middleware.ts                    (Route protection)
├── app/
│   ├── admin-login/
│   │   └── page.tsx                (Login form, enhanced security)
│   ├── admin/
│   │   └── layout.tsx              (Header + logout button)
│   └── api/
│       └── auth/
│           └── logout/
│               └── route.ts        (Logout endpoint)
├── components/
│   ├── AdminLogoutButton.tsx        (Logout button)
│   └── AdminSessionProvider.tsx     (Activity monitoring)
└── lib/
    └── hooks/
        └── useActivityTimeout.ts    (Inactivity detection)
```

---

## Session Lifecycle Timeline

```
TIME    EVENT                                   STATE
────────────────────────────────────────────────────────
00:00   User logs in                           ✅ LOGGED IN
        JWT token created (1 hour expiry)      ⏱️ Session: 1h
        Activity timer started (15 min reset)  ⏱️ Activity: 15m

05:00   User clicks something                  ✅ LOGGED IN
        Activity timer resets                  ⏱️ Activity: 15m

15:00   User inactive 15 minutes               ❌ AUTO-LOGOUT
        Auto-logout triggered                  🔴 SESSION DESTROYED
        Redirected to login

05:00   User manually clicks logout            ❌ LOGOUT
        Session destroyed immediately          🔴 SESSION DESTROYED
        Redirected to login

45:00   Session timeout (1 hour)               ⏱️ Approaching timeout
        Last activity resets timer             ✅ Session renewed

60:00   No activity in past 15 mins            ❌ AUTO-LOGOUT
        Auto-logout due to inactivity          🔴 SESSION DESTROYED

OR

60:00   User clicks logout button              ❌ MANUAL LOGOUT
        Session destroyed                      🔴 SESSION DESTROYED
```

---

## Security Checkpoints

```
CHECKPOINT 1: Route Protection
  /admin/:path* ──► Middleware ──► Session Valid? ──► Y: Proceed, N: Login

CHECKPOINT 2: Page Load
  Page.tsx ──► auth() ──► Role = admin? ──► Y: Render, N: Redirect

CHECKPOINT 3: Activity Monitoring
  User Action ──► Activity Detected? ──► Y: Reset Timer, N: Wait

CHECKPOINT 4: Session Expiry
  Background ──► 1 hour elapsed? ──► Y: Logout, N: Continue

CHECKPOINT 5: Inactivity
  Background ──► 15 mins no action? ──► Y: Logout, N: Continue
```

---

## Cookie Management

```
ON LOGIN:
├─ Set: next-auth.session-token (secure, httpOnly)
├─ Set: next-auth.csrf-token
└─ Duration: Until logout or expiry

ON LOGOUT:
├─ Clear: next-auth.session-token (maxAge: 0)
├─ Clear: next-auth.csrf-token (maxAge: 0)
├─ Clear: next-auth.callback-url (maxAge: 0)
└─ Also clear: localStorage, sessionStorage

ON EXPIRY (1 hour):
├─ JWT token expires
├─ Cookie becomes invalid
└─ Redirect to login on next page request
```

---

## Summary

🔒 **4-Layer Security:**
1. **Entry Layer** - Credentials verified
2. **Session Layer** - JWT with 1-hour timeout
3. **Activity Layer** - 15-minute inactivity timeout
4. **Route Layer** - Middleware protection

✅ **Result:** Secure admin panel with no session persistence issues
