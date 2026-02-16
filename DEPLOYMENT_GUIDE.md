# GitHub + Vercel Auto-Deployment Setup Guide

## 🚀 COMPLETE SETUP INSTRUCTIONS

### Step 1: Create GitHub Repository

**Option A: Using GitHub CLI (if installed)**
```bash
# Install gh CLI if you don't have it:
# https://cli.github.com/

# Login to GitHub
gitHub auth login

# Create repository
cd /home/dhiaa/TrialWatch
gitHub repo create trialwatch --public --source=. --remote=origin --push
```

**Option B: Manual (Recommended)**
1. Go to https://github.com/new
2. Repository name: `trialwatch`
3. Description: `TrialWatch - Never pay for forgotten free trials again`
4. Make it **Public** (for free Vercel deployment)
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### Step 2: Push Code to GitHub

After creating the repo, run these commands:

```bash
cd /home/dhiaa/TrialWatch

# Rename branch to main (GitHub standard)
git branch -m main

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/trialwatch.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Connect to Vercel

**Option A: Vercel CLI (Fastest)**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link and deploy
vercel --prod
```

**Option B: Vercel Dashboard (Easier)**
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `trialwatch` repo from GitHub
4. Framework Preset: **Next.js**
5. Click **"Deploy"**

### Step 4: Configure Auto-Deployment

Vercel automatically:
- ✅ Deploys every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Provides a custom domain (you can add your own later)

**To customize:**
1. Go to your project on Vercel dashboard
2. Click **"Settings"**
3. Under **"Git"**, enable:
   - "Auto-deploy on push" ✓
   - "Deploy Summary Comments" ✓

### Step 5: Custom Domain (Optional)

1. Buy domain: trialwatch.io, trialwatch.app, or gettrialwatch.com
2. In Vercel dashboard: Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions

## 🎯 RESULT

After setup:
- **Live URL**: `https://trialwatch-xyz.vercel.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/trialwatch`
- **Auto-deploy**: Every git push updates the live site!

## 📝 WORKFLOW FOR UPDATES

```bash
# Make changes to your code
# ... edit files ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# 🎉 Vercel automatically deploys the update!
```

## 🔧 TROUBLESHOOTING

**If push fails:**
```bash
git remote -v  # Check remote URL is correct
git status       # Check for uncommitted changes
```

**If Vercel build fails:**
1. Check build logs on Vercel dashboard
2. Common issues: Missing dependencies, TypeScript errors
3. Fix locally, commit, push again

**To force redeploy:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 🚀 NEXT FEATURES TO ADD

Once deployed, you can add:
1. Gmail auto-import API
2. Database (Supabase/Firebase) for user data
3. Authentication (Clerk/NextAuth)
4. Affiliate link tracking
5. Payment integration (Stripe)

---

**Questions?** The app is ready to go live! 🎉
