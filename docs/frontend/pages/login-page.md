# Authentication Pages

## Login Page

### Page Purpose
Allows registered customers to sign in to their account for placing orders and tracking order history.

### Route Path
`/login`

### Required Permissions
None — publicly accessible.

### Layout Used
Public layout (`(public)/layout.tsx`) with Navbar and Footer.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| LoginForm | `src/app/(public)/login/LoginForm.tsx` | Login form with email/password |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Authenticate user credentials |
| `/api/auth/me` | GET | Fetch user data after login |

### Validation Schema

**File**: `src/lib/validations/login.ts`

```typescript
loginSchema = z.object({
  email: z.string().email("Please enter a valid email").trim(),
  password: z.string().min(1, "Password is required"),
});
```

### State Management
- `useForm<LoginFormInput>` with `zodResolver(loginSchema)`
- `useUserAuth()` context for `login()` method
- `isSubmitting` from react-hook-form for loading state

### Loading State
- Submit button shows loading indicator when form is submitting
- Button disabled during submission

### Error Handling
- Zod validation errors displayed inline below each field
- API errors caught and displayed via toast notification
- Invalid credentials show error message

### Edge Cases
- Already logged-in users should be redirected to home
- Network failure shows generic error message
- Empty form submission prevented by Zod validation

---

## Signup Page

### Page Purpose
Allows new customers to create an account.

### Route Path
`/signup`

### Required Permissions
None — publicly accessible.

### Components Used

| Component | File | Purpose |
|-----------|------|---------|
| SignupForm | `src/app/(public)/signup/SignupForm.tsx` | Registration form |

### API Calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/me` | GET | Fetch user data after signup |

### Validation Schema

**File**: `src/lib/validations/signup.ts`

```typescript
signupSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

### State Management
- `useForm<SignupFormInput>` with `zodResolver(signupSchema)`
- `useUserAuth()` context for `signup()` method
- Cross-field validation (password match) via `.refine()`

### Error Handling
- Inline Zod validation errors for each field
- Password mismatch shows error on confirmPassword field
- Duplicate email returns API error
- Toast notification for API errors

### Edge Cases
- Duplicate email registration attempt
- Password/confirmPassword mismatch
- Phone number format validation (exactly 10 digits)
- Already authenticated users

---

## Admin Login Page

### Page Purpose
Separate login portal for admin users. Credentials are configured via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env.local`).

### Route Path
`/admin-login`

### Components Used
- Admin login form with client-side validation (email format, password minimum length)
- Password visibility toggle (eye icon)
- Loading state during authentication

### API Calls
- NextAuth `[...nextauth]` handler for authentication (validates against `.env` credentials)

### Validation
- Email: required, must be valid email format
- Password: required, minimum 6 characters
- Inline error messages on blur and submit

### Error Handling
- Invalid credentials show error message
- Redirects to `/admin/dashboard` on success
- Supports `callbackUrl` query parameter for post-login redirect
