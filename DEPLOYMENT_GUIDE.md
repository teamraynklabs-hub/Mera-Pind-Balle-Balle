# Deployment Guide: GitHub to VPS

## Prerequisites
- GitHub account (create at github.com if you don't have one)
- VPS credentials: IP Address, Username, Password
- Git installed on your local machine
- Node.js installed on your VPS

---

## STEP 1: Initialize Git on Your Local Machine

Run these commands in your project root folder:

```bash
# Initialize git repository
git init

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit - Mera Pind Balle Balle project"
```

---

## STEP 2: Create GitHub Repository

1. Go to **github.com** and log in to your account
2. Click the **+** icon (top right) → **New repository**
3. Fill in the details:
   - **Repository name:** `mera-pind-balle-balle` (or any name you prefer)
   - **Description:** (optional) Brief description of your project
   - **Visibility:** Choose **Private** (recommended for production)
   - Click **Create repository**

4. Copy the repository URL from GitHub (should look like: `https://github.com/yourusername/mera-pind-balle-balle.git`)

---

## STEP 3: Connect Local Repository to GitHub

Run these commands in your project root:

```bash
# Add remote repository (replace with your actual GitHub URL)
git remote add origin https://github.com/yourusername/mera-pind-balle-balle.git

# Rename branch to main (if not already)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**If prompted for credentials:**
- Enter your GitHub username
- Instead of password, use a **Personal Access Token**:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens
  2. Click "Generate new token"
  3. Give it permissions: `repo` (full control)
  4. Copy and use this token as your password

---

## STEP 4: Prepare Your .env.local File

**IMPORTANT:** Do NOT push `.env.local` to GitHub (add to `.gitignore` if not already there)

Check that `.gitignore` contains:
```
.env
.env.local
.env.*.local
```

---

## STEP 5: Connect to Your VPS via SSH

Open terminal on your local machine and run:

```bash
# Connect to VPS
ssh username@your-vps-ip-address

# When asked "Are you sure you want to continue?", type: yes
# Then enter your password
```

**Replace:**
- `username` with your actual VPS username
- `your-vps-ip-address` with your actual VPS IP address

---

## STEP 6: Setup Node.js on VPS (if not already installed)

Once connected to VPS, run:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install curl (if not installed)
sudo apt install curl -y

# Install Node.js (version 18 or higher recommended)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node --version
npm --version
```

---

## STEP 7: Clone Your Repository on VPS

```bash
# Go to home directory
cd ~

# Create a directory for your project
mkdir -p app

cd app

# Clone your GitHub repository
git clone https://github.com/yourusername/mera-pind-balle-balle.git

cd mera-pind-balle-balle
```

---

## STEP 8: Setup Environment Variables on VPS

```bash
# Create .env.local file on VPS
nano .env.local
```

1. Copy-paste your environment variables from your local `.env.local`
2. Make sure all important variables are set (DATABASE_URL, API keys, etc.)
3. Press `Ctrl + X`, then `Y`, then `Enter` to save

---

## STEP 9: Install Dependencies and Build

```bash
# Install npm packages
npm install

# Build the Next.js application
npm run build

# This creates optimized production build
```

---

## STEP 10: Setup PM2 for Running Your App (Recommended)

PM2 keeps your application running 24/7:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your Next.js app with PM2
pm2 start npm --name "mpbb" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on system reboot
pm2 startup

# Follow the command it gives you (it will show a command to run with sudo)
```

---

## STEP 11: Setup Nginx as Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config file
sudo nano /etc/nginx/sites-available/mpbb
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Replace `your-domain.com` with your actual domain.

Continue:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/mpbb /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

---

## STEP 12: Verify Your Application is Running

```bash
# Check if PM2 process is running
pm2 list

# Check logs if needed
pm2 logs mpbb

# Check if Nginx is running
sudo systemctl status nginx
```

On your browser, visit:
- `http://your-vps-ip-address` (or your domain if configured)

---

## STEP 13: Future Deployments (Updating Code)

When you need to push new changes:

### On Local Machine:
```bash
# Add changes
git add .

# Commit with message
git commit -m "Your change description"

# Push to GitHub
git push origin main
```

### On VPS (via SSH):
```bash
# Go to project directory
cd ~/app/mera-pind-balle-balle

# Pull latest code from GitHub
git pull origin main

# Install any new dependencies
npm install

# Rebuild application
npm run build

# Restart application
pm2 restart mpbb
```

---

## TROUBLESHOOTING

### Application not running?
```bash
pm2 logs mpbb
```

### Can't connect to VPS?
```bash
ssh -vvv username@your-vps-ip-address
```

### Port 3000 already in use?
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual number)
kill -9 PID
```

### Database connection error?
- Verify `DATABASE_URL` in `.env.local` is correct
- Check if database server is running
- Ensure firewall allows your app to access database

---

## Summary Commands Quick Reference

**First Time Deployment:**
```bash
# Local
git init
git add .
git commit -m "Initial commit"
git remote add origin [YOUR_GITHUB_URL]
git push -u origin main

# VPS (after connecting via SSH)
git clone [YOUR_GITHUB_URL]
cd mera-pind-balle-balle
nano .env.local
npm install
npm run build
pm2 start npm --name "mpbb" -- start
```

**Update Deployment:**
```bash
# Local
git add .
git commit -m "Your message"
git push origin main

# VPS
git pull origin main
npm install
npm run build
pm2 restart mpbb
```

---

## Important Notes

✅ Always use `.gitignore` for sensitive files (`.env.local`, `node_modules`, etc.)
✅ Use SSH keys instead of passwords for better security (can be set up later)
✅ Keep your GitHub repository private
✅ Backup your database regularly
✅ Monitor VPS server resources regularly

