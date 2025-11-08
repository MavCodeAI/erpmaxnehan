# 🚀 SUPABASE SETUP - Quick Guide

## ✅ Your Project URL is Already Configured!
Your Supabase URL: `https://qtblryuydfqhushksyyy.supabase.co`

---

## 📝 Step 1: Update Your API Key (2 minutes)

You need to copy your **real anon key** from Supabase:

### Where to Find Your Key:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select project: **erpmaxmain**
3. Go to: **Settings** → **API**
4. Find the **"anon"** **"public"** key
5. Click **Copy** button

### What to Do:
Open file: `lib/supabase.ts` (line 5)

**Replace this line:**
```typescript
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Ymx5cnV5ZGZxaHVzaGtzeXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODU3MzksImV4cCI6MjA3ODE2MTczOX0.9GL6rXgXGJFCfLnRYHQnITNdEm_QfY8mz0NiV7-RKdo'
```

**With:**
```typescript
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'PASTE_YOUR_REAL_ANON_KEY_HERE'
```

Just paste your copied key between the quotes!

---

## 📊 Step 2: Create Database Tables (3 minutes)

### In Supabase Dashboard:
1. Click **SQL Editor** (left sidebar)
2. Click **"+ New query"**
3. Copy the ENTIRE content from file: `supabase/schema.sql`
4. Paste into SQL Editor
5. Click **RUN** button (or press F5)

✅ You should see: "Success. No rows returned"

---

## 🔄 Step 3: Restart Your App

1. Stop the dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open: http://localhost:8001

---

## ✅ How to Verify It's Working

**You should see:**
- ✅ "Data loaded successfully from database" (green toast)
- ❌ No more "Using demo mode" message

**Test:**
1. Create a new customer
2. Refresh the page
3. Customer should still be there!

---

## 🆘 Still Not Working?

Check browser console (F12) for error messages and share them with me!

---

## 📌 Quick Reference

**Your Supabase Project:**
- URL: https://qtblryuydfqhushksyyy.supabase.co
- Project: erpmaxmain
- Dashboard: https://supabase.com/dashboard/project/qtblryuydfqhushksyyy

**Files to Edit:**
- ✏️ `lib/supabase.ts` (line 5) - Paste your anon key here
