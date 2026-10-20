# 🌐 Complete Guide: Connecting DocFinder to Supabase & Live Backend

This guide enables full end-to-end database persistence so that everything on your live Netlify site (`https://docfinderbdx.netlify.app/`) — booking appointments, doctor approvals, signups, and admin actions — persists permanently in a live cloud database.

---

## 🏗️ Architecture Overview

| Component | Provider | Role | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | Netlify | Next.js 15 UI (`https://docfinderbdx.netlify.app/`) | ✅ Live |
| **Database** | Supabase | Cloud PostgreSQL (Doctors, Appointments, Users) | ⏳ Free Setup (2 mins) |
| **Backend API** | Render / Railway | NestJS API (Prisma ORM, Auth, Business Logic) | ⏳ Free Setup (3 mins) |

---

## ⚡ Step 1: Create Free Supabase Database (2 Minutes)

1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (Sign in with GitHub).
2. Click **New Project**:
   - **Name**: `docfinder-db`
   - **Database Password**: Choose a strong password (remember this!)
   - **Region**: Choose closest to Bangladesh (e.g. `Singapore` or `India (Mumbai)`).
3. Once the database is created, go to **Project Settings** (gear icon) > **Database**:
   - Scroll down to **Connection parameters** or **Connection String** > **URI**.
   - Copy the URI. It looks like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
     ```
   - If using connection pooling (recommended for high traffic), Supabase gives:
     - **Transaction Mode (port 6543)** for `DATABASE_URL`
     - **Session / Direct Mode (port 5432)** for `DIRECT_URL`

---

## ⚡ Step 2: Push Schema & Seed Data to Supabase (1 Command)

In your local terminal inside `e:\DocFinder`:

```bash
# 1. Set your Supabase connection string in Structure Files/packages/db/.env
# Replace [YOUR-PASSWORD] and [PROJECT-REF] with your Supabase credentials:
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 2. Push tables to Supabase
npm run db:push

# 3. Seed all Bangladesh doctors, hospitals, divisions, and admin accounts into Supabase
npm run db:seed
```

🎉 Open your Supabase Dashboard -> **Table Editor**: you will immediately see all tables (`Doctor`, `Hospital`, `User`, `Appointment`, etc.) populated with live data!

---

## ⚡ Step 3: Deploy NestJS API to Render (100% Free, 3 Minutes)

Because Netlify only hosts frontend assets, your NestJS backend (`apps/api`) needs to be online to handle Prisma queries.

1. Go to [https://render.com](https://render.com) and sign in with GitHub.
2. Click **New +** > **Web Service**.
3. Select your `DocFinder` repository.
4. Fill in the service settings:
   - **Name**: `docfinder-api`
   - **Root Directory**: `Structure Files`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd packages/db && npx prisma generate && cd ../.. && npm run build:api`
   - **Start Command**: `node apps/api/dist/main.js`
   - **Instance Type**: `Free`
5. Click **Advanced** > **Add Environment Variable**:
   - `DATABASE_URL`: Your Supabase connection string (from Step 1)
   - `DIRECT_URL`: Your Supabase direct connection string (from Step 1)
   - `JWT_SECRET`: `swastha-bd-super-secret-jwt-key-min-32-chars-change-this`
   - `JWT_REFRESH_SECRET`: `swastha-bd-refresh-token-secret-min-32-chars-change-this`
   - `ALLOWED_ORIGINS`: `https://docfinderbdx.netlify.app`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.
7. Render will build and deploy your API in ~2 minutes and provide a URL like:
   `https://docfinder-api-xxxx.onrender.com`

> 💡 **Verify Health**: Visit `https://docfinder-api-xxxx.onrender.com/api/v1/health/db`. You should see `{"status":"ok","database":"connected"}`!

---

## ⚡ Step 4: Connect Netlify to the Live Backend (1 Minute)

1. Go to your Netlify Dashboard > select your site `docfinderbdx`.
2. Go to **Site configuration** > **Environment variables**.
3. Click **Add a variable**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://docfinder-api-xxxx.onrender.com/api/v1`
4. Go to **Deploys** tab > Click **Trigger deploy** > **Clear cache and deploy site**.

---

## 🎯 Test It Live!

Now open `https://docfinderbdx.netlify.app/`:
1. Book an appointment with any doctor.
2. Sign in as Admin (`admin@swasthabd.com` / `Admin@123456`) and see the pending queue.
3. Open Supabase Dashboard -> Table `Appointment`: you will see the exact row inserted with all patient details in real-time!
