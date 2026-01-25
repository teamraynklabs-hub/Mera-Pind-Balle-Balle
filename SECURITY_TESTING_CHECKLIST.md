# ✅ Admin Panel Security - Testing Checklist

## Pre-Deployment Testing

### Test 1: Manual Logout
- [ ] Login to admin panel (/admin-login)
- [ ] Verify logout button visible in top-right header
- [ ] Click logout button
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Redirected to /admin-login
- [ ] Try accessing /admin directly → Should redirect to login
- [ ] Session completely cleared

**Expected Result:** ✅ PASS

---

### Test 2: Login with Different Credentials
- [ ] Login as Admin A (email: admin1@example.com)
- [ ] Logout
- [ ] Login as Admin B (email: admin2@example.com)
- [ ] Verify Admin B is logged in (check email in header)
- [ ] Admin B can access admin panel normally

**Expected Result:** ✅ PASS

---

### Test 3: Invalid Credentials
- [ ] Go to /admin-login
- [ ] Enter wrong email or password
- [ ] Click login
- [ ] Error message appears: "Invalid email or password"
- [ ] Cannot access admin panel
- [ ] Password field clears for security

**Expected Result:** ✅ PASS

---

### Test 4: Session Timeout (1 hour)
**Note:** This requires waiting 1 hour OR temporarily changing config

Option A: Wait 1 hour
- [ ] Login at time T
- [ ] Stay logged in for 60 minutes
- [ ] Try to refresh page after 1 hour
- [ ] Redirected to login

Option B: Modify for quick testing
- [ ] Edit `src/auth.ts`: Change `maxAge: 60 * 60` → `maxAge: 60` (1 minute)
- [ ] Login
- [ ] Wait 60 seconds
- [ ] Try to access /admin page
- [ ] Session expired, redirected to login

**Expected Result:** ✅ PASS

---

### Test 5: Inactivity Timeout (15 minutes)
**Note:** This requires waiting 15 minutes OR temporarily changing config

Option A: Wait 15 minutes
- [ ] Login to admin panel
- [ ] Don't interact (no clicks, keystrokes, scrolls)
- [ ] After 15 minutes of inactivity
- [ ] Auto-logged out
- [ ] Redirected to /admin-login

Option B: Modify for quick testing
- [ ] Edit `src/app/admin/layout.tsx` in AdminSessionProvider
- [ ] Change timeout to 1 minute for testing
- [ ] Login
- [ ] Don't interact for 1 minute
- [ ] Auto-logout should trigger

**Expected Result:** ✅ PASS

---

### Test 6: Activity Resets Inactivity Timer
- [ ] Login to admin panel
- [ ] Wait 10 minutes (no interaction)
- [ ] Click something on page (move mouse, click button)
- [ ] Timer resets
- [ ] Wait another 15 minutes from that point
- [ ] If you don't interact, auto-logout occurs

**Expected Result:** ✅ PASS

---

### Test 7: Multiple Tabs/Windows
- [ ] Open admin panel in Tab 1
- [ ] Open admin panel in Tab 2
- [ ] Logout in Tab 1
- [ ] Go to Tab 2
- [ ] Tab 2 should redirect to login (session destroyed)
- [ ] Cannot access /admin in Tab 2

**Expected Result:** ✅ PASS

---

### Test 8: Logout Cancellation
- [ ] Login to admin panel
- [ ] Click logout button
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" (or close dialog)
- [ ] Remain on admin page
- [ ] Session still active

**Expected Result:** ✅ PASS

---

### Test 9: Browser Back Button After Logout
- [ ] Login to admin page
- [ ] Click logout
- [ ] Redirected to login
- [ ] Try browser back button
- [ ] Should show login page (not admin page from cache)
- [ ] Cannot bypass logout with back button

**Expected Result:** ✅ PASS

---

### Test 10: Closing Browser Without Logout
- [ ] Login to admin panel
- [ ] Close browser completely (all tabs)
- [ ] Reopen browser
- [ ] Go to admin panel URL
- [ ] Session cleared, redirected to login
- [ ] Must re-enter credentials

**Expected Result:** ✅ PASS

---

### Test 11: Cookies Are Cleared
Browser DevTools → Application → Cookies:
- [ ] Login and check cookies exist
- [ ] Logout
- [ ] Check cookies are deleted/cleared
- [ ] `next-auth.session-token` should be gone

**Expected Result:** ✅ PASS

---

### Test 12: Non-Admin User Cannot Access
- [ ] Create a user with role = "user" (not "admin")
- [ ] Try to login with user credentials
- [ ] Cannot access admin panel
- [ ] Redirected to login

**Expected Result:** ✅ PASS

---

### Test 13: Direct URL Access Without Session
- [ ] Don't login
- [ ] Try accessing /admin directly
- [ ] Redirected to /admin-login

**Expected Result:** ✅ PASS

---

### Test 14: Session Validation on Each Page
- [ ] Login to /admin
- [ ] Go to /admin/dashboard
- [ ] Go to /admin/dashboard/products
- [ ] All pages verify session
- [ ] All pages show logout button
- [ ] Can logout from any page

**Expected Result:** ✅ PASS

---

### Test 15: API Calls Require Session
- [ ] Login to admin panel
- [ ] Make an API call (e.g., fetch product)
- [ ] Call succeeds with valid session
- [ ] Logout
- [ ] Try same API call
- [ ] Should fail with 401 Unauthorized

**Expected Result:** ✅ PASS

---

## Security Verification Checklist

- [ ] No session persistence after logout
- [ ] Session destroyed on logout
- [ ] All cookies cleared on logout
- [ ] localStorage cleared on logout
- [ ] Inactivity triggers logout
- [ ] Session timeout works
- [ ] Cannot access /admin without session
- [ ] Cannot use old session credentials
- [ ] Role verification enforced
- [ ] Logout button visible and functional
- [ ] Confirmation dialog on logout
- [ ] Password field clears on failed login
- [ ] Error messages don't reveal user existence
- [ ] Browser back button can't bypass logout
- [ ] Multiple tabs sync logout

---

## Performance Verification

- [ ] Logout completes in < 2 seconds
- [ ] Page redirect is smooth
- [ ] Activity monitoring doesn't lag UI
- [ ] Session validation is fast

---

## Browser Compatibility Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Final Pre-Deployment Checklist

- [ ] All 15 tests PASSED
- [ ] Security verification all checked
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Logout button styled properly
- [ ] Admin header displays correctly
- [ ] Email shown in header
- [ ] ADMIN_SECURITY.md documentation reviewed
- [ ] Team trained on new logout procedure
- [ ] Database has at least one admin user

---

## Rollback Plan (If Issues Found)

If security issue found:
1. Disable logout functionality temporarily
2. Revert `src/auth.ts` and `src/app/admin/layout.tsx`
3. Investigate issue
4. Fix and re-test
5. Re-deploy

---

## Sign-Off

- **Tested By:** _________________________ Date: __________
- **Approved By:** ______________________ Date: __________
- **Deployed:** _________________________ Date: __________

---

## Notes

- Remember to set `AUTH_SECRET` in `.env.local`
- Ensure all new files are deployed
- Inform admin users about logout requirement
- Monitor logs for any auth issues post-deployment

---

**Status:** ⏳ READY FOR TESTING
