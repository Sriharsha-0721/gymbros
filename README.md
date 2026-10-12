# GYMCREW — Gym Partner & Availability Tracker

GYMCREW is a modern, mobile-first web application designed for private groups of friends who train together. It helps gym squads coordinate workout schedules, discover matching daily availability, mark intentional rest days, and build consistency streaks together.

Built with **React 19, TypeScript, Vite, Tailwind CSS, Supabase (PostgreSQL, Auth, Realtime)**, and installable as a **Progressive Web App (PWA)**.

---

## ⚡ Core Features

1. **Daily Availability & Rest Days**:
   - 5 explicit statuses: **Morning**, **Evening**, **Night**, **Rest**, and **Not Decided**.
   - Optional preferred workout time (e.g. `06:30 AM`) and workout focus note (e.g. `Chest & Triceps PR attempt`).
   - One-tap quick actions right on the dashboard.
   - Rest days are distinctly tracked to protect consistency without inflating workout counts.

2. **Smart Home Dashboard**:
   - Immediately answers: *Who is lifting today? When are they going? Who can I join?*
   - Real-time time slot breakdown counts (Morning / Evening / Night).
   - "Matching Gym Partners" highlighting squad members going at the same time.
   - Dedicated "Active Recovery & Rest" section.
   - Compact upcoming schedule preview.

3. **Weekly Group Calendar**:
   - 7-day responsive grid (Monday through Sunday) with "TODAY" highlight.
   - Filter by time slots (*Morning, Evening, Night, Rest*) or individual members.
   - Week navigation (Previous / Next / Today).
   - Add/edit plans directly for any upcoming day.

4. **Workout Attendance & Consistency Streaks**:
   - Independent verification: planned availability is strictly distinguished from completed workouts.
   - Workout Check-in modal with focus presets, intensity selector, and celebration confetti.
   - Current consistency streak (with rest day protection).
   - Weekly workout target progress bar (e.g., 4 / 5 days).
   - Complete attendance history log.

5. **Private Gym Groups**:
   - Create private squads with custom names and location descriptions.
   - 1-click invite code and direct link sharing (with WhatsApp shortcut).
   - Role management (Admin vs. Member).
   - Multi-group switcher.

6. **Installable PWA**:
   - Web App Manifest and offline static cache service worker.
   - Custom athletic emblem icon with muscular clasping forearms and electric-lime accents.

---

## 🚀 Quick Start (Local Development)

The application includes an **interactive local engine** out of the box. You can run and test all interactions immediately without setting up cloud accounts first!

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd GYM
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Supabase Cloud & Google OAuth Setup (Phase 2 & 3)

When you are ready to connect to a free Supabase cloud database with Google Sign-in:

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it `gymbros`.
3. Choose a region close to you and set a secure database password.

### Step 2: Run the Database Migration
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Open the file `supabase/schema.sql` in this project and paste its contents into the SQL Editor.
3. Click **Run**. This creates all tables (`profiles`, `gym_groups`, `group_members`, `daily_availability`, `workout_logs`) and enforces strict **Row Level Security (RLS)** policies.

### Step 3: Configure Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project named `GymBros Auth`.
3. Under **APIs & Services → OAuth consent screen**, select **External**, fill in the App Name (`GymBros`) and your user support email.
4. Under **Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Authorized JavaScript origins: `http://localhost:5173` and your future production Vercel URL.
   - Authorized redirect URIs: Copy the Supabase callback URL from Supabase Dashboard (**Authentication → Providers → Google**):
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
5. Copy the generated **Client ID** and **Client Secret** into your Supabase Dashboard under **Authentication → Providers → Google**, and enable the toggle.

### Step 4: Configure Local Environment Variables
Create a file named `.env.local` in the project root:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-public-key
VITE_APP_URL=http://localhost:5173
```
Restart the dev server (`npm run dev`). GymBros will automatically transition from local demo mode to live cloud database synchronization!

---

## 🌐 Free Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete GymBros application"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) using your GitHub account.
3. Click **Add New... → Project**, and select your `gymbros` repository.
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (set to `https://<your-app-name>.vercel.app`)
5. Click **Deploy**. Vercel will build and deploy your application with free automated HTTPS!
6. Add your new Vercel domain (`https://<your-app-name>.vercel.app/**`) to:
   - Supabase Dashboard: **Authentication → URL Configuration → Redirect URLs**.
   - Google Cloud Console: **Authorized JavaScript origins**.

---

## 🛡️ Free Tier Usage & Safeguards

- **Vercel Hobby Tier**: 100 GB bandwidth / month, 100 deployments / day (100% Free).
- **Supabase Free Tier**: Up to 500 MB database storage, 50,000 monthly active users (100% Free).
  - *Note*: Free Supabase projects pause after 7 consecutive days of inactivity. You can unpause them in 60 seconds from the Supabase dashboard.
- **Google OAuth**: Basic user profile and email identity logins are free.

---

## 📱 Mobile PWA Installation

- **iOS Safari**: Tap the **Share** button in Safari → Tap **Add to Home Screen**.
- **Android Chrome**: Tap the three-dot menu → Tap **Install App** or **Add to Home screen**.
- **Desktop Chrome/Edge**: Click the **Install GymBros** icon in the address bar.
