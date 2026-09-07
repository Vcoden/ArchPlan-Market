# ArchPlan Market

**Find the perfect plan. Build with confidence.**

A two-sided house plan marketplace: architects upload and sell digital plans, homeowners browse, purchase, and download files, and the platform records a commission on every successful sale.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase (Auth, Postgres, Storage, RLS)
- Payment provider abstraction (`mock` now; Stripe / Paystack / Flutterwave later)

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The marketplace persists accounts, orders, reviews, payouts, and listings in `.data/marketplace.json` until Supabase is connected.

Local admin:

- Email: `admin@archplan.market`
- Password: `Admin1234!`

Sign up as a homeowner to buy plans, or as an architect to apply, wait for admin approval, then submit listings.

## Supabase setup

1. Create a project and copy the URL, anon key, and service role key into `.env.local`.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor. This creates tables, indexes, triggers, RLS, storage buckets, and the default `platform_commission` setting (15%).
3. Enable email authentication. Google OAuth can be added later in the same Auth settings.
4. Create the first admin by setting `profiles.role = 'admin'` for your user.

## Marketplace rules

1. Only approved architects can publish plans.
2. Only published plans appear in the marketplace.
3. Buyers cannot access original files before payment.
4. Only verified purchasers can review a plan.
5. Architects cannot review their own plans.
6. Architects can only edit their own listings.
7. Admins can remove or suspend listings.
8. Commission values are stored on each order and order item.
9. Purchased files are delivered with short-lived signed URLs.
10. Deleted or suspended plans stay attached to historical orders.

## Branding

Edit `lib/brand.ts` and the CSS variables in `app/globals.css` to change the name, tagline, and palette.

## Payments

`lib/payments` defines a provider interface. `PAYMENT_PROVIDER=mock` completes checkout in development. Replace the mock with Stripe, Paystack, or Flutterwave without changing the order or commission flow.
