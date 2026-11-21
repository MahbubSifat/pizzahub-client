# 🍕 PizzaHub — Pizza Ordering & Delivery Platform (Client)

PizzaHub is a role-based pizza ordering platform. **Customers** discover local pizza shops, browse menus and place orders. **Restaurants (vendors)** publish menu items and manage incoming orders. **Admins** manage users, review menu items and monitor platform transactions. Vendors can upgrade to a **Premium** subscription (Stripe) for unlimited items, a Premium badge and featured placement.

This repository is the **client** (Next.js). The API lives in the server repository.

## Links

- **Live site:** <CLIENT_LIVE_URL>
- **Client repository:** <CLIENT_GITHUB_URL>
- **Server repository:** <SERVER_GITHUB_URL>
- **Live API:** <SERVER_LIVE_URL>

> Admin credentials and the Stripe test card are provided in the submission sheet.

## Important Features

**Public**
- Animated home page: hero, 6 featured approved items, 6 category cards, "Why Choose PizzaHub?", "How It Works"
- Browse Menu with **advanced search** (name, description, category), category and location filters, **price sorting (low to high / high to low)**, pagination, loading and empty states

**Authentication (Better Auth)**
- Email/password sign up (name, email, password rules, optional profile photo, role: customer or vendor) and Google sign in
- Role-based redirects, protected routes, blocked-user page
- Admin accounts can **never** be created from public sign up (created only by a seed script)

**Customer**
- Item details with order form (delivery date, address, message)
- My Orders with status tabs, details dialog, **order status timeline**, cancel pending orders
- Overview dashboard

**Vendor**
- Add / edit / delete menu items with ImgBB image upload, availability toggle, approval status
- Customer Orders: accept or reject (pending orders only, once)
- Subscription page: Free vs Premium, Stripe Checkout upgrade, cancel / resume renewal
- Overview dashboard with charts

**Admin**
- Overview with statistics and charts
- Manage Users: search, role filter, details, block / unblock
- Manage Menu Items: review, approve / reject, change status, delete
- Transactions (read-only)

**UI / UX**
- Original warm pizza theme (cream, tomato red, orange), Fraunces + Inter fonts
- Fully responsive, **dark / light mode**, Framer Motion animations (reduced-motion aware)
- Toast notifications everywhere (no `alert()`), loading skeletons, custom 404 and error pages

**Optional requirements implemented:** Dark / light mode toggle, Order status timeline.

## Technology Stack

| Area | Tools |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling / UI | Tailwind CSS, ShadCN UI, lucide-react, class-variance-authority, clsx, tailwind-merge |
| Animation | framer-motion |
| Theme | next-themes |
| Notifications | sonner |
| Authentication | better-auth, @better-auth/mongo-adapter (JWT plugin, Google OAuth) |
| Database driver | mongodb |
| Image hosting | ImgBB (uploaded through a Next.js API route, key stays on the server) |
| Dev tools | tsx (admin seed script), ESLint |

## Project Structure

```
app/
  (site)/            public pages: home, menu, menu/[id], payment success/cancel
  dashboard/         role dashboards (vendor, customer, admin) with role guards
  sign-in, sign-up, onboarding, blocked
  api/auth/          Better Auth handler
  api/upload/        ImgBB upload routes (key never reaches the browser)
components/          reusable UI (menu, dashboard, home, auth, layout)
lib/                 auth config, API helper, types, constants
scripts/             seed-admin.ts
```

## Environment Variables

Create `.env.local` (never commit it). Names are listed in `.env.example`:

```
NEXT_PUBLIC_API_URL=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
MONGODB_URI=
DB_NAME=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
IMGBB_API_KEY=
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

`ADMIN_*` are used only by the local seed script.

## Installation and Running Locally

Prerequisites: Node.js 20+, a MongoDB Atlas database, Google OAuth credentials, an ImgBB API key. The server must be running (see the server README).

```bash
git clone <CLIENT_GITHUB_URL>
cd pizzahub-client
npm install
cp .env.example .env.local      # then fill in the values
npm run dev                      # http://localhost:3000
```

Create the admin account (once):

```bash
npx tsx --env-file=.env.local scripts/seed-admin.ts
```

Build for production:

```bash
npm run build
npm start
```

## Challenge Requirements

1. **Advanced search and sorting.** The Browse Menu page keeps its state in the URL (`?search=&category=&location=&sort=&page=`), so results can be shared and reloaded. Search is debounced. Sorting options: newest, price low to high, price high to low. The server does the filtering (see the server README for the query parameters).
2. **JWT / token verification.** After login the client asks Better Auth for a JWT (`authClient.token()`) and sends it as `Authorization: Bearer <token>` on every protected API call. The Express server verifies it (see the server README for the middleware flow).
3. **Professional appearance.** Consistent design tokens, equal-height cards, dark mode, skeleton loaders, animated home page.

## Security Notes

- All secrets come from environment variables; `.env*` files are git-ignored (only `.env.example` is committed).
- Role and user id are never taken from the request body. The server reads them from the verified token and the database.
- Dashboard pages are guarded on the server and every API route re-checks the role.

## Testing Payments (Stripe test mode)

Use card `4242 4242 4242 4242`, any future expiry, any CVC and any postal code. Premium is activated only after a verified Stripe webhook, never by the success page.