# Deploying DocFinder to Netlify 🚀

DocFinder is fully configured for seamless, zero-configuration deployment to **Netlify** using `@netlify/plugin-nextjs`.

---

## ⚡ Option 1: Quick 2-Minute Deployment via Netlify UI (Recommended)

1. **Push your code to GitHub**:
   Ensure all changes are pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: configure DocFinder for Netlify deployment"
   git push origin main
   ```

2. **Log in to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com/) and sign in with GitHub.

3. **Add New Site**:
   - Click **Add new site** > **Import an existing project**.
   - Select **GitHub** and authorize access to your `DocFinder` repository.

4. **Verify Build Settings**:
   Netlify will automatically detect `netlify.toml` from the repository root:
   - **Base directory**: `Structure Files` *(or leave blank if Netlify reads root `netlify.toml`)*
   - **Build command**: `npm run build:web`
   - **Publish directory**: `apps/web/.next`

   *(Alternative: If you set Base directory to `Structure Files/apps/web`, set Build command to `npm run build` and Publish directory to `.next`)*.

5. **(Optional) Environment Variables**:
   Under **Site configuration > Environment variables**, you can set:
   - `NEXT_PUBLIC_API_URL`: Your deployed NestJS backend URL (e.g., `https://docfinder-api.up.railway.app/api/v1`).
   
   > 💡 **Standalone Demo Mode:** If you do not have a live backend deployed yet, you can leave `NEXT_PUBLIC_API_URL` empty! DocFinder includes built-in standalone demo mode so all doctor discovery, hospital directories, appointment scheduling, and the Doctor & Admin dashboards work interactively right out of the box!

6. **Click "Deploy Site"**:
   Netlify will build and provide your live URL (e.g. `https://docfinder-bd.netlify.app`).

---

## 🔑 Demo Logins (For Testing & Portfolio Reviews)

Recruiters and evaluators visiting your live Netlify site can test with 1 click using the built-in demo buttons or entering credentials:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@swasthabd.com` | `Admin@123456` | Review doctor queue, approve BMDC verification, manage hospitals & platform stats at `/admin` |
| **Doctor** | `dr.aminul@swasthabd.com` | `Doctor@123456` | Multi-chamber practice console, appointment queues, accept/decline consultations at `/doctor/dashboard` |
| **Patient** | `patient@swasthabd.com` | Any password | Browse doctors, select chamber time slots, and book verified appointments |

---

## 🛠️ Testing the Production Build Locally

Before deploying, you can test the production build locally:
```bash
# In Structure Files/apps/web
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to verify.
