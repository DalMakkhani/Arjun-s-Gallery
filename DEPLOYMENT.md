# Arjun's Gallery - Deployment Guide

## ✅ What's Been Done

### Security & Authentication
- ✅ Signup feature **disabled** - only login works
- ✅ Admin link hidden from regular visitors (only shows when logged in)
- ✅ Login accessible at `/auth` (you'll manually navigate there)
- ✅ One admin account (yours) in Supabase

### Animations
- ✅ Page fade-in on load
- ✅ Scroll-triggered animations on all sections
- ✅ Smooth transitions throughout

## 🚀 Deployment Steps

### Step 1: Create Your Admin Account in Supabase

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project: `ujwyqgzuulqncpgwgroc`
3. Navigate to **Authentication** → **Users**
4. Click **Add User**
5. Enter your email and password
6. Click **Create User**

This is the ONLY account that will exist - no one else can sign up!

### Step 2: Initialize Git Repository

```bash
cd C:\Users\Arjun\Downloads\soft-focus-stories-main\soft-focus-stories-main
git init
git add .
git commit -m "Initial commit - Arjun's Gallery"
```

### Step 3: Push to GitHub

1. Go to [github.com](https://github.com) and create a new repository
2. Name it something like `arjuns-gallery`
3. **Don't** initialize with README (we already have one)
4. Copy the repository URL
5. Run these commands:

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** or **Login** (use GitHub)
3. Click **Add New** → **Project**
4. Import your `arjuns-gallery` repository
5. **IMPORTANT**: Add Environment Variables:
   ```
   VITE_SUPABASE_URL = https://ujwyqgzuulqncpgwgroc.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqd3lxZ3p1dWxxbmNwZ3dncm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzQxNTMsImV4cCI6MjA3OTkxMDE1M30.XcwxBurn5ZA4Mj48MniKTLTK4UAEHz52DBFPaWzoQyQ
   VITE_SUPABASE_PROJECT_ID = ujwyqgzuulqncpgwgroc
   ```
6. Click **Deploy**
7. Wait 2-3 minutes for deployment

### Step 5: Access Your Live Site

1. Vercel will give you a URL like `arjuns-gallery.vercel.app`
2. Visit your site - visitors see the portfolio
3. **To login**: Navigate to `arjuns-gallery.vercel.app/auth`
4. Use the email/password you created in Supabase
5. After login, you'll see the **Admin** link in the header

## 📋 How to Login (Since There's No Button)

**For you (admin):**
- Manually type `/auth` at the end of your URL
- Example: `yourdomain.com/auth`
- Login with your credentials
- You'll be redirected to `/admin`

**For visitors:**
- They never see the login page
- They can't access `/admin` without credentials
- They only see Blog, About, and your portfolio

## 🎨 What Visitors See vs What You See

### Visitors:
- Blog
- About
- Portfolio homepage
- Individual blog posts
- **NO** Admin link
- **NO** Create/Edit/Delete buttons

### You (when logged in):
- Everything visitors see
- **PLUS** Admin link in header
- **PLUS** Dashboard to manage posts
- **PLUS** Create/Edit/Delete functionality
- **PLUS** Logout button

## 🔐 Security Notes

- Signup is completely disabled in the code
- Only existing Supabase users can login
- Create only ONE account (yours) in Supabase
- Row Level Security (RLS) in Supabase protects your data
- `/auth` route exists but is not linked anywhere public

## ✨ Features Live on Your Site

- Rich text editor with image upload
- Drag & drop images
- Video embedding (Joota section)
- Dark/Light theme toggle
- Smooth animations
- Responsive design
- SEO-friendly

## 🛠️ Making Updates After Deployment

```bash
# Make your changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel will auto-deploy in 2-3 minutes
```

## 📱 Test Your Site

1. **As Visitor**: Open incognito window, visit your site
2. **As Admin**: Open normal window, go to `/auth`, login
3. **Create a post**: Go to Admin → New Story
4. **View as visitor**: Open incognito, check Blog page

Your site is now live and secure! 🎉
