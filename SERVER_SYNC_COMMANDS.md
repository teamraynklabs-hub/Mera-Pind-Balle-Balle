# Server Sync Commands - Admin Credentials Update

## Quick Fix (Run these on VPS)

```bash
# 1. Connect to VPS
ssh username@your-vps-ip-address

# 2. Navigate to project
cd ~/app/mera-pind-balle-balle

# 3. Pull latest changes
git pull origin main

# 4. Install any dependencies that might have changed
npm install

# 5. IMPORTANT: Rebuild the Next.js application
npm run build

# 6. Stop the PM2 process completely
pm2 stop mpbb

# 7. Delete the process
pm2 delete mpbb

# 8. Start fresh
pm2 start npm --name "mpbb" -- start

# 9. Verify it's running
pm2 list

# 10. Check logs for any errors
pm2 logs mpbb
```

---

## If You Changed Admin Credentials in Database

If you updated via database directly, just run steps 3-8 above (pull, build, restart).

---

## If You Changed Admin Credentials Using a Script

If you ran `change-admin-password.ts` or `create-admin.ts`, run on VPS:

```bash
cd ~/app/mera-pind-balle-balle

# Check if you need to run the script on server
ts-node scripts/change-admin-password.ts
# or
npm run build && npm run dev
# (Run the script through your app)
```

---

## Full Troubleshooting Steps

### Step 1: SSH into VPS
```bash
ssh username@your-vps-ip-address
```

### Step 2: Check current status
```bash
pm2 list
pm2 logs mpbb | tail -50
```

### Step 3: Navigate and sync
```bash
cd ~/app/mera-pind-balle-balle
git status
git pull origin main
```

### Step 4: Rebuild and restart
```bash
npm install
npm run build
pm2 stop mpbb
pm2 delete mpbb
pm2 start npm --name "mpbb" -- start
```

### Step 5: Verify
```bash
# Wait 5-10 seconds for app to fully start
sleep 10
pm2 logs mpbb
```

---

## Verify Server is Using New Credentials

1. Go to: `http://your-vps-ip/admin-login`
2. Try logging in with NEW credentials
3. If still failing, check logs:
   ```bash
   pm2 logs mpbb | grep -i "auth\|password\|admin"
   ```

---

## Common Issues & Solutions

### Issue: "Application already running on port 3000"
```bash
pm2 kill
sudo pkill -f "node"
sleep 5
pm2 start npm --name "mpbb" -- start
```

### Issue: Old credentials still cached?
```bash
# Clear browser cache and try incognito/private window
# On server: check .next cache
rm -rf .next
npm run build
pm2 restart mpbb
```

### Issue: Database not updated?
- Verify your database has the new credentials
- Check `.env.local` has correct DATABASE_URL
- Connect to database directly to confirm changes

---

## Verification Commands

```bash
# Check if files were updated
git log --oneline -5

# Check .env.local (make sure it has latest values)
cat .env.local | grep -i admin

# Check if database connection works
curl -X GET http://localhost:3000/api/test-db
```

