# 🤖 AGENTS.md - Developer Agent Guide

> **Mandatory pre-flight rule:** Before any Next.js, React, or framework-specific work, **read the relevant docs first** at `node_modules/next/dist/docs/`. Training data is outdated; the bundled docs are the source of truth.

---

## 1. Project Overview & Tech Stack

**Project:** `focal` — a full-featured e-commerce watch store (production at https://focal-mu.vercel.app/).

| Layer | Stack |
|---|---|
| **Core Framework** | Next.js **16.2.9** (App Router, Turbopack, **Cache Components enabled**) |
| **Runtime & Package Manager** | Node.js 20+ · **npm** (uses `package-lock.json`) |
| **Language** | TypeScript 5 (strict mode, `jsx: "react-jsx"`, ES2017 target) |
| **UI Library** | React **19.2.7** + React DOM 19.2.7 |
| **Styling** | Tailwind CSS 3.4 · Shadcn/UI (new-york style) · Radix UI primitives · `tailwindcss-animate` |
| **Auth** | Clerk (`@clerk/nextjs` v7.5.3) — middleware renamed to `proxy.ts` per v7 |
| **Backend / CMS** | Strapi (REST API, `NEXT_PUBLIC_STRAPI_API_URL`) — read-only from this client |
| **Payments** | Stripe (`@stripe/react-stripe-js`, `stripe@18`) — payment intents + payment methods |
| **Email** | Resend (`resend@4`) — order confirmations |
| **Form Validation** | `react-hook-form` + `@hookform/resolvers` + `zod@3` |
| **State Management** | SWR (client cart/orders) · React `useState`/Context (toast) · URL state (`useSearchParams`) |
| **Carousel / UI** | `embla-carousel-react` (with autoplay) · `@fancyapps/ui` (Fancybox) · `lucide-react` (icons) |
| **Target Deployment** | Vercel (production verified at `focal-mu.vercel.app`) |

**Critical pinned versions** (do not auto-bump):
- `next@16.2.9`, `react@19.2.7`, `react-dom@19.2.7`
- `@clerk/nextjs@^7.5.3` (v7 required for Next 16)
- `eslint-config-next@16.2.9`
- `@types/react@19.2.17`, `@types/react-dom@19.2.3` (kept in sync via `overrides`)

---

## 2. Directory Architecture

```
focal/
├── app/                          # Next.js App Router (server-centric)
│   ├── (auth)/                   # Route group for Clerk catch-alls
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── api/                      # Route handlers (server-only)
│   │   ├── create-payment-intent/route.ts
│   │   ├── get-payment-method/route.ts
│   │   ├── revalidate/route.ts   # Strapi webhook entry (POST /api/revalidate)
│   │   └── send/route.ts         # Resend email sender
│   ├── categories/[slug]/        # /categories/men, /categories/women, ...
│   ├── faces/[slug]/             # /faces/1815, /faces/1969, ...
│   ├── products/[slug]/          # /products/[product-slug]
│   ├── orders/[slug]/            # /orders/[order-id] (user-scoped, Suspense)
│   ├── order-confirm/            # Suspense + client component
│   ├── checkout/                 # Authenticated + guest subroute
│   ├── cart/                     # Client-only cart page
│   ├── layout.tsx                # Root layout (ClerkProvider + Suspense)
│   ├── sitemap.ts                # Dynamic sitemap from Strapi
│   ├── robots.ts                 # robots.txt
│   ├── not-found.tsx
│   ├── globals.css               # Tailwind + CSS variables
│   └── [icon|opengraph|apple-icon|manifest].*
│
├── components/
│   ├── ui/                       # Shadcn/UI primitives (accordion, button, sheet, ...)
│   ├── layout/                   # Header, Footer, HeroCarousel, Categories, ...
│   ├── shared/                   # Cross-cutting (FAQ, Preloader, QuickView, SearchDrawer)
│   ├── product/                  # Product details page components
│   ├── order/                    # Order history & details components
│   ├── order-confirm/            # Post-payment client flow
│   ├── cart/                     # Cart UI
│   ├── checkout/                 # Checkout form + summary + skeletons
│   └── email/                    # Email template (server-side render)
│
├── hooks/                        # Client-only React hooks
│   ├── useCart.ts                # SWR-backed cart with localStorage fallback
│   ├── use-toast.ts              # Toast state machine
│   ├── useFancybox.ts            # Fancybox modal binding
│   ├── useProductVisibility.ts   # IntersectionObserver
│   ├── useQuickView.ts
│   ├── useSearchDrawer.tsx
│   └── useRelated.tsx
│
├── lib/                          # Server + shared modules
│   ├── data.ts                   # Strapi data fetchers (cached)
│   ├── actions.ts                # Server Actions (use server) — mutations + updateTag
│   ├── definitions.ts            # Strapi response types
│   ├── schema.ts                 # Zod schemas (checkoutSchema)
│   ├── helper.ts                 # Product transform helpers
│   ├── constants.ts              # Static constants (price range, Egypt states, nav)
│   ├── fonts.ts                  # next/font Jost + Barlow
│   ├── localStorage.ts           # Cart persistence for guest users
│   └── utils.ts                  # cn() = twMerge(clsx(...))
│
├── public/                       # Static assets (images, banners, /categories/*.webp)
├── proxy.ts                      # Clerk middleware (v7 rename; was middleware.ts)
├── next.config.ts                # cacheComponents: true, image remotePatterns
├── tailwind.config.ts            # Color tokens (HSL CSS vars), font families
├── tsconfig.json                 # paths: "@/*" → "./*"
├── components.json               # Shadcn config (new-york, lucide, baseColor: zinc)
├── eslint.config.mjs             # Flat config (eslint 9)
├── postcss.config.mjs
├── .prettierrc                   # trailingComma: "all", singleQuote: false, printWidth: 80
└── .env.example / .env.local     # Strapi, Clerk, Stripe, Resend, Revalidate secret
```

**Server-centric vs client split:**
- `app/**/page.tsx` files: **Server Components by default** (no `"use client"`). They fetch from `lib/data.ts` and pass primitives to client islands.
- `components/layout/*`, `components/product/ProductDetails.tsx`, `components/order/Orders.tsx`, etc.: marked `"use client"` only when they need `useState`, `useEffect`, `useSearchParams`, or browser APIs.
- `hooks/**` are inherently client-side.

---

## 3. Strict Coding Standards & Patterns

### 3.1 Component Patterns

| Rule | Where to apply |
|---|---|
| **Default to Server Components** | Every new `app/**/page.tsx` and `app/**/layout.tsx` is a Server Component unless proven otherwise. |
| **`"use client"` only when required** | Add only for: `useState`/`useEffect`/`useRef`, `useRouter`/`useSearchParams`, browser APIs, event handlers, browser-only libraries (Fancybox, Embla autoplay). |
| **Composition: async outer + cached inner** | Pages that read `params`/`searchParams` MUST be split: outer async component reads runtime data + wraps in `<Suspense>`, inner async component is `"use cache"` and receives primitives as props. |
| **Move `notFound()` out of `"use cache"`** | Calling `notFound()` inside a cached scope causes retry storms. Handle it in the outer (non-cached) page function. |
| **No runtime APIs in cached scopes** | `cookies()`, `headers()`, `searchParams`, `params` are runtime APIs — never call them inside `"use cache"`. Pass as primitives instead. |
| **`CopyrightYear` pattern** | Any time-dependent or non-deterministic value in a server tree → push it to a `"use client"` component with `suppressHydrationWarning` (e.g. `components/shared/CopyrightYear.tsx`). |

### 3.2 Data Fetching (Strapi)

**Pattern:** Server Component → `lib/data.ts` helper → `fetch` with `next: { tags, revalidate }`.

- All Strapi calls go through the private `fetchData` helper in `lib/data.ts`. It sets `Authorization: Bearer ${NEXT_PUBLIC_STRAPI_API_TOKEN}` and forwards `tags`/`revalidate` to `fetch`.
- **Public catalog helpers** are uncached functions — they rely on the underlying `fetch` cache via `next: { revalidate }`. The page-level `"use cache"` is the UI layer that caches *rendering* (see §3.4).
- **User-scoped helpers** (`fetchOrders(email)`, `fetchOrderById(id)`) are **not** wrapped in `"use cache"` — they are read at request time with the user's session.
- **Server Actions** in `lib/actions.ts` use `updateTag("orders")` after a write to invalidate order caches.

### 3.3 Caching & Revalidation (Next.js 16 Cache Components)

`next.config.ts` has `cacheComponents: true`. PPR (Partial Prerendering) is the default.

**Per-route cache profile:**

| Route | `"use cache"` | `cacheLife` | Notes |
|---|---|---|---|
| `app/page.tsx` | yes (function-scope) | `hours` | Homepage |
| `app/products/[slug]/page.tsx` | yes (function-scope on `getProductData` and default export) | `hours` | Per-slug cache key |
| `app/categories/page.tsx` | yes (function-scope on `CategoriesContent`) | `hours` | searchParams-as-props |
| `app/categories/[slug]/page.tsx` | yes (function-scope on `CategoryContent`) | `hours` | notFound in outer |
| `app/faces/[slug]/page.tsx` | yes (function-scope on `FaceContent`) | `hours` | notFound in outer |
| `app/orders/*`, `app/order-confirm`, `app/sign-*` | no | — | Dynamic / runtime-data |

**Invalidation:**
- `lib/actions.ts` uses `updateTag(tag)` (read-your-writes, Server Action only) after mutations like `createOrder`.
- `app/api/revalidate/route.ts` accepts a webhook from Strapi, calls `revalidateTag(tag, "max")` (eventual, Route Handler safe).

**`<Suspense>` boundaries (required for runtime-API pages):**

- All pages that read `searchParams` MUST wrap their cached child in `<Suspense fallback={<Loading />}>`.
- `app/layout.tsx` wraps the entire `<body>` content in `<Suspense fallback={null}>` because `<ClerkProvider>` reads cookies — this is documented v16 behavior, **do not remove**.

### 3.4 Styling & UI Conventions

- **Tailwind utility classes** only. No inline `style` objects except for dynamic SVG/CSS values.
- **`cn()` from `lib/utils.ts`** for conditional classes. Never `clsx` directly.
- **CSS variables** defined in `app/globals.css` (HSL format). Use them via Tailwind tokens: `bg-primary`, `text-foreground`, `border-border`, `bg-muted`, etc.
- **Shadcn/UI components** live in `components/ui/`. To add a new primitive, follow the shadcn flow (do not hand-roll).
- **Fonts:** `barlow` (body, default) and `jost` (available). Use Tailwind `font-barlow` / `font-jost` classes.
- **Breakpoints:** standard Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`). Mobile-first.
- **Container:** `container max-w-screen-xl` (or `-lg`, `-2xl`) is the page width standard.
- **Colors project rules:**
  - Default theme is **light**; dark theme tokens exist in globals.css but no toggle.
  - Brand colors live as HSL CSS vars (`--black`, `--midnight`, `--green`, `--blue-sunray`, `--moonphase`, `--steel-blue`, `--orange`).
- **No emojis in code or UI** unless explicitly asked.

### 3.5 State Management

| State type | Where to put it |
|---|---|
| **Server state (catalog data)** | `lib/data.ts` fetchers, surfaced through Server Components. |
| **Form state** | `react-hook-form` + `zod` resolver (`lib/schema.ts`). |
| **Cart (authenticated user)** | `hooks/useCart.ts` (SWR + Clerk `useUser`). |
| **Cart (guest)** | `lib/localStorage.ts` (`loadFromLocalStorage`, `saveToLocalStorage`, `CART_KEY`). |
| **URL state (filters, sorting)** | `useSearchParams` in Client Components, propagated via `router.push(?, { scroll: false })`. |
| **Toasts** | `hooks/use-toast.ts` (Context-based state machine, see `components/ui/toaster.tsx`). |
| **Modal/drawer open** | Local `useState` in the component owning the UI. |

**Rule:** never duplicate the same data between server (SWR) and localStorage. Cart is the only place where the dual-source pattern exists (guests use localStorage, authed users use SWR → Strapi).

### 3.6 Server Actions (`lib/actions.ts`)

- File has top-of-file `"use server"`. All exports are Server Actions.
- All write paths include error handling and a final `updateTag(...)` for cache invalidation.
- For cart/address/order operations, return typed responses; let the client `try/catch`.

### 3.7 Form Validation

- `lib/schema.ts` exports Zod schemas (e.g. `checkoutSchema`).
- React Hook Form uses `zodResolver(checkoutSchema)` (see `components/checkout/*`).
- Phone validation accepts Egyptian formats (`+2|002|01[0-2,5]xxxxxxxx`).

---

## 4. Known Gotchas & Optimization Rules

### 4.1 `new Date()` and Non-Deterministic Values

Server Components cannot call `new Date()`, `Math.random()`, `crypto.randomUUID()` without first reading runtime data (cookies/headers/fetch). Solution: push to a `"use client"` component with `suppressHydrationWarning` (see `components/shared/CopyrightYear.tsx`).

### 4.2 Scroll Behavior

- **`<Link>` navigations:** no `window.scrollTo` in route transitions. Default browser behavior is correct.
- **Variant changes on product page:** rely on `<Link prefetch>` + `router.push(?, { scroll: false })` to update URL state without jumping.
- **DO NOT** add `useEffect(() => window.scrollTo({ top: 0 }))` on mount — it caused CLS regressions.

### 4.3 Cache & Hydration

- **Cached functions cannot read runtime APIs.** Pass primitives from the outer page to the inner cached component.
- **`generateMetadata` can read `params`** because it runs in the same scope as the page — but it should be the only thing reading them; the default export's `params` reading must be inside `<Suspense>`.
- **Server Actions + `updateTag`:** the action's `updateTag` is the only way to instantly invalidate a cached page after a write. For time-based refresh, rely on `cacheLife`.
- **`<Header />`, `<Footer />`, `<QuickView />` in layout** are inside `<Suspense fallback={null}>` because `<ClerkProvider>` reads cookies at the root. Do not move them out.

### 4.4 Performance

- **Images:** Always `<Image>` from `next/image`. Quality tiers configured: `75, 80, 90` (see `next.config.ts`). Remote pattern: `res.cloudinary.com` (the Strapi media CDN).
- **Format priorities:** `image/avif`, `image/webp`.
- **Carousels:** `embla-carousel-react` with `embla-carousel-autoplay` for Hero. Avoid autoplay on small lists (jank).
- **Preloader:** `components/shared/Preloader.tsx` is the entry-time loader; ensure new heavy page transitions do not flash.
- **Skeletons:** every long-loading page has a sibling `loading.tsx` (e.g. `app/categories/loading.tsx`, `app/orders/loading.tsx`, `app/orders/[slug]/loading.tsx`, `app/products/[slug]/loading.tsx`). Use the existing skeleton components (`<OrderSkeleton>`, `<ProductInfoSkeleton>`, etc.) — do not create new ones for the same shape.

### 4.5 Strapi & API

- The Strapi base URL and read token are public envs (`NEXT_PUBLIC_*`); the proxy/api uses them client-side for SWR. Do not put server secrets in `NEXT_PUBLIC_*`.
- `qs` is used to stringify Strapi's nested populate/filters objects — preserve the existing `encodeValuesOnly: true` and field selection to keep payload sizes down.
- `revalidate` values per data type live in `lib/data.ts` (catalog: 3600s, categories: 7200s, filtered face results: 300s).

### 4.6 Clerk v7 Specifics

- Middleware is at `proxy.ts` (not `middleware.ts`) — this is the v7 rename. `clerkMiddleware()` is invoked as default export.
- `<ClerkProvider afterSignOutUrl="/sign-in">` lives in `app/layout.tsx`.
- Catch-all routes use `[[...sign-in]]` / `[[...sign-up]]` under `app/(auth)/`.

### 4.7 Build & Deploy

- Build: `npm run build` (Turbopack enabled by default in `dev`).
- Dev: `npm run dev` (Turbopack).
- ESLint: `npm run lint`.
- Required env vars (see `.env.example`):
  - `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_STRAPI_API_TOKEN`
  - `NEXT_PUBLIC_BASE_URL` (used in metadata, sitemap, OG)
  - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
  - `RESEND_API_KEY`
  - `REVALIDATE_SECRET` (shared with Strapi webhook)
  - Clerk publishable + secret keys

---

## 5. Step-by-Step Context Gathering Runbook

Before proposing modifications or writing new features, follow this internal checklist:

1. **Check framework versions and peer constraints.**
   - Open `package.json`. Confirm `next`, `react`, `react-dom`, `@clerk/nextjs`, `eslint-config-next` are aligned.
   - Read `node_modules/next/dist/docs/01-app/` for the relevant subsystem (caching, routing, data fetching, etc.). Training data is outdated.
2. **Identify whether the route is server or client, cached or dynamic.**
   - Look for `"use client"` at top of file → client.
   - Look for `"use cache"` and `cacheLife` → cached.
   - Look for `<Suspense>` boundary → dynamic island exists.
   - Look for `params`/`searchParams` props on default export → must be read outside cache.
3. **Search for existing design tokens and components before creating new ones.**
   - Colors: `app/globals.css` (`--background`, `--primary`, `--midnight`, etc.).
   - UI primitives: `components/ui/*` (Shadcn).
   - Layout pieces: `components/layout/*`. Shared: `components/shared/*`.
   - Skeletons: `components/**/*Skeleton.tsx` and `*/loading.tsx` files.
4. **Map the data flow.**
   - Strapi fetchers in `lib/data.ts`. Always go through `fetchData` (private).
   - User-scoped reads bypass `"use cache"` — must run at request time inside the outer page.
5. **Checklist before writing a new page or component:**
   - [ ] Default to Server Component. Add `"use client"` only if needed.
   - [ ] If the page reads `params`/`searchParams`, split into outer (async, Suspense) + inner (cached, primitives).
   - [ ] If cached, pick a `cacheLife` profile (`hours` is the default for catalog).
   - [ ] Add a sibling `loading.tsx` if the page is long-running.
   - [ ] Use existing skeletons — don't create new ones for the same shape.
   - [ ] Add `notFound()` in the **outer** (non-cached) function, not in the cached child.
   - [ ] No inline styles. Use `cn()` for conditional classes.
6. **Pre-commit checks:**
   - `npm run build` (must complete 75/75 pages prerendered; check the build summary).
   - `npm run lint`.
   - Confirm `<ClerkProvider>` runtime-data behavior is preserved (root layout `<Suspense fallback={null}>` must remain).

---

## 6. Quick Reference — Common Tasks

### Add a new public catalog route (e.g. `/collections`)

1. Create `app/collections/page.tsx` and `app/collections/[slug]/page.tsx`.
2. In each default export: read `searchParams`/`params` outside the cached function, run `notFound()` in the outer function, wrap inner cached component in `<Suspense fallback={<Loading />}>`.
3. Inner cached component: `"use cache"; cacheLife("hours"); ...`.
4. Add a sibling `app/collections/loading.tsx` skeleton.
5. Add the Strapi fetcher in `lib/data.ts` using the existing `fetchData` helper.
6. If slugs are enumerable, export `generateStaticParams` calling the slug fetcher.

### Add a mutation (Server Action)

1. Append to `lib/actions.ts` (file is `"use server"`).
2. Add Zod schema in `lib/schema.ts` if user input.
3. Use `updateTag("...")` in a `finally` block for cache invalidation.
4. Throw errors with descriptive messages; let the client toast.

### Add a new UI primitive

1. Run the shadcn CLI (do not hand-roll — it ensures Radix compatibility).
2. Place in `components/ui/`.
3. Style with the existing color tokens (CSS vars) — never hardcode hex.

### Modify a cached page

1. Read the page file. If the cached function reads runtime data, restructure.
2. Update the inner cached component only — keep the outer page as the runtime-data handler.
3. Verify the build summary still shows the route as `◐ (Partial Prerender)` or `○ (Static)`.

---

## 7. Anti-Patterns (Things That Will Get Your PR Reverted)

- ❌ Adding `"use client"` to a page file to "fix" a runtime-API error. Restructure the data flow instead.
- ❌ Calling `cookies()`, `headers()`, `searchParams`, or `connection()` inside a `"use cache"` scope.
- ❌ Calling `notFound()` inside a `"use cache"` scope.
- ❌ Using `new Date()`, `Math.random()`, or `crypto.randomUUID()` in a Server Component without a runtime-API read first.
- ❌ Removing the root layout's `<Suspense fallback={null}>` — ClerkProvider will fail the build.
- ❌ Adding `export const revalidate = N`, `export const dynamic`, or `export const fetchCache` to pages — these are removed in v16. Use `"use cache"` + `cacheLife` instead.
- ❌ Putting `"use cache"` at file scope of a page that has a `params`/`searchParams` reading export. Use function-scope.
- ❌ Hardcoding colors, hex values, or `style={{}}` props. Use Tailwind tokens.
- ❌ Skipping the `updateTag` after a write in a Server Action — user sees stale data.
- ❌ Wrapping `<SignIn />`/`<SignUp />` from Clerk in a new `<ClerkProvider>` — they need the root provider from `app/layout.tsx`.
- ❌ Adding dependencies to `package.json` without verifying they support React 19 and Next 16 (esp. peer-dep mismatches that previously caused the build to fail with `@clerk/nextjs@6.25.1` vs `next@16`).

---

## 8. Reference Links (Verified at Setup Time)

- Next.js Cache Components docs: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md` and `01-app/03-api-reference/01-directives/use-cache-private.md`
- Caching guide: `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md` and `migrating-to-cache-components.md`
- Clerk v7 docs: see `@clerk/nextjs` v7 changelog
- Shadcn/UI: https://ui.shadcn.com (new-york style, baseColor: zinc, lucide icons)
