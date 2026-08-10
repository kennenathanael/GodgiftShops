# GodGiftShop — Next.js Edition (Vercel-ready)

Contact: +237 655 957 734 · nonopascalcaleb@gmail.com

## Tech Stack
- Next.js 14 (React + TypeScript, App Router)
- Tailwind CSS
- Prisma ORM + PostgreSQL (Vercel Postgres / Neon)
- Vercel Blob (image uploads)
- JWT cookies for admin & customer sessions (no external auth service needed)

## Project Structure
```
app/
  (shop)/        ← storefront pages (home, products, cart, checkout, etc.)
  admin/         ← admin panel pages
components/      ← Header, Footer, ProductCard, AdminShell
lib/
  actions/       ← server actions (all business logic: auth, cart, CRUD, orders)
  prisma.ts, auth.ts, cart.ts, i18n.ts, utils.ts
  dictionaries/  ← en.ts / fr.ts translations
prisma/
  schema.prisma  ← database schema
  seed.ts        ← initial categories + settings
```

---

## Part A — Test locally first (recommended)

1. Install [Node.js](https://nodejs.org) (v18 or later) if you don't have it.
2. Unzip this project, open a terminal inside the folder, and run:
   ```
   npm install
   ```
3. Create a free PostgreSQL database to test with — the fastest option is [Neon](https://neon.tech) (free tier, no card required):
   - Sign up → Create a project → copy the **connection string** (starts with `postgres://`)
4. Copy `.env.example` to `.env` and fill in:
   ```
   DATABASE_URL="postgres://...your Neon connection string..."
   AUTH_SECRET="any-long-random-string-here"
   BLOB_READ_WRITE_TOKEN="leave empty for now, added in Part B"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
5. Push the database schema and seed initial data:
   ```
   npx prisma db push
   npx prisma db seed
   ```
6. Run the site locally:
   ```
   npm run dev
   ```
7. Visit `http://localhost:3000/admin/setup` to create your first Super Admin account, then `http://localhost:3000` to see the storefront.

(Image upload won't work locally until Vercel Blob is connected in Part B — everything else works.)

---

## Part B — Deploy to Vercel

### Step 1: Push your code to GitHub
1. Create a free account at [github.com](https://github.com) if needed
2. Create a new repository (e.g. `godgiftshop`)
3. Upload this project to it (via GitHub's web upload, or `git init / git add . / git commit / git push` if you're comfortable with Git)

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) → sign up/log in **with your GitHub account**
2. Click **Add New → Project**
3. Select your `godgiftshop` repository → Click **Import**
4. Don't click Deploy yet — first add the environment variables (Step 4)

### Step 3: Create your production database
1. In your Vercel project → tab **Storage** → **Create Database**
2. Choose **Postgres** (powered by Neon) → create it → it auto-connects and adds `DATABASE_URL` to your project's environment variables automatically 🎉

### Step 4: Add the remaining environment variables
Still in **Storage**, click **Create Database** again → choose **Blob** → create it. This automatically adds `BLOB_READ_WRITE_TOKEN` too.

Then go to **Settings → Environment Variables** and add manually:
| Name | Value |
|---|---|
| `AUTH_SECRET` | any long random string (e.g. generate one at [randomkeygen.com](https://randomkeygen.com)) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project-name.vercel.app` (you'll get the exact URL after first deploy — update this after) |

### Step 5: Deploy
Click **Deploy**. Vercel will install dependencies, run `prisma generate`, and build the app.

### Step 6: Set up the database schema on production
After the first deploy succeeds, you need to create the tables in your new production database. Easiest way — from your local terminal, temporarily point at the production database:
```
# Copy the DATABASE_URL from Vercel's Storage tab into your local .env, then:
npx prisma db push
npx prisma db seed
```
(Or use Vercel's built-in terminal / a one-off deployment hook — ask me if you'd like help automating this.)

### Step 7: Create your Super Admin account
Visit `https://your-project-name.vercel.app/admin/setup` and create your account. This page automatically locks itself after the first admin is created.

### Step 8: You're live! 🎉
- Storefront: `https://your-project-name.vercel.app`
- Admin panel: `https://your-project-name.vercel.app/admin/login`

### Step 9 (optional): Connect your own domain
In Vercel → **Settings → Domains** → add `godgiftshop.com` (or whatever you bought) and follow the DNS instructions shown.

---

## How "New" and "Sold Out" work
- **New**: shows for 7 days after a product is added (editable via the `Setting` table, key `new_badge_days`). Can be forced on/off per product from the admin panel.
- **Sold Out**: automatic when stock quantity reaches 0 — disables "Add to Cart" but keeps the product visible.

## Roles
- **SUPER_ADMIN**: full access, including managing other admin/staff accounts
- **STAFF**: can manage products, categories, and orders (admin account management is restricted to super admin)

## Payment
Cash on Delivery only. Order status flow: `PENDING → CONFIRMED → SHIPPED → DELIVERED` (or `CANCELLED`).

## Languages
English / French toggle in the header (storefront only). Translations live in `lib/dictionaries/en.ts` and `fr.ts` — add a key there and use `dict.your_key` in any page to extend it.
