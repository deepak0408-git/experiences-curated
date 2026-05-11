# Production Readiness Checklist — Experiences | Curated

Status markers:
- 🔴 **BLOCKING** — must resolve before accepting real money or going public
- 🟡 **PRE-LAUNCH** — must resolve before making the site publicly accessible
- 🟢 **POST-LAUNCH** — can ship and complete within the first 30 days
- ✅ **DONE** — already handled in the codebase

---

## 1. Hosting & Deployment

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 1.1 | Deploy to Vercel (or equivalent) | 🔴 | Run `npm run build` locally first to catch type/lint errors |
| 1.2 | Set production domain (e.g. experiencescurated.com) | 🔴 | DNS → Vercel; auto SSL |
| 1.3 | Migrate all `.env.local` vars to hosting platform | 🔴 | Never commit `.env.local` |
| 1.4 | Set `NEXT_PUBLIC_SITE_URL` to production domain | 🔴 | Drives all OTP magic link redirects |
| 1.5 | Confirm `npm run build` passes with zero errors | 🟡 | Fix any TypeScript errors before deploying |
| 1.6 | Set up preview deployments for PRs | 🟢 | Vercel does this automatically |
| 1.7 | Configure `next.config` production image domains | 🟡 | Add R2 public URL to `images.remotePatterns` when switching to `next/image` |

---

## 2. Database (Supabase)

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 2.1 | Upgrade Supabase project to Pro tier | 🔴 | Free tier: 500MB storage, 2GB egress, no PITR, limited connections |
| 2.2 | Run all pending DB migrations on production | 🔴 | Use `db:generate` + manual Node script (TTY workaround documented) |
| 2.3 | Verify connection strings: Transaction pooler (6543) for app, Session pooler (5432) for migrations | ✅ | Already split in `.env.local` |
| 2.4 | Enable Point-in-Time Recovery (PITR) | 🟡 | Available on Supabase Pro; essential for a purchases table |
| 2.5 | Review DB indexes — add any missing on hot query paths | 🟡 | `saved_items(user_id)`, `saved_items(experience_id)`, `purchases(email, sporting_event_id)` already have unique constraints |
| 2.6 | Enable Row Level Security (RLS) on sensitive tables | 🟡 | Currently bypassed in app via service role; at minimum lock `purchases` and `users` |
| 2.7 | Set connection pool max to safe limit | ✅ | Singleton `db` import prevents hot-reload pool exhaustion |
| 2.8 | Supabase project region: confirm closest to primary users | 🟢 | Move to EU-West if UK/EU audience is primary |

---

## 3. Authentication (Supabase Auth)

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 3.1 | Configure custom SMTP provider (Resend / Postmark / SendGrid) | 🔴 | Free tier: ~3 OTP emails/hour — unusable in production |
| 3.2 | Add production domain to Supabase Auth → Redirect URLs | 🔴 | Required or all magic links are rejected; add `https://yourdomain.com/**` |
| 3.3 | Verify `localhost:3000/**` is in redirect URLs for dev | ✅ | Pending action per CLAUDE.md — confirm this is done |
| 3.4 | Brand magic link email template in Supabase Auth → Email Templates | 🟡 | Currently barebones; add logo, copy, and footer |
| 3.5 | Configure SPF / DKIM / DMARC for sending domain | 🟡 | Required for delivery to Gmail/Outlook; set up via your SMTP provider |
| 3.6 | Set `From` address to a custom domain (not `supabase.io`) | 🟡 | Done automatically when custom SMTP is configured |
| 3.7 | Review JWT expiry (default 1 hour for access token) | 🟢 | Consider extending refresh token TTL for better UX |
| 3.8 | Protect curator routes (`/curator/*`) with auth middleware | 🔴 | Currently completely unprotected — anyone can access the review queue |
| 3.9 | PKCE callback implemented | ✅ | `/auth/callback/route.ts` |
| 3.10 | Implicit flow handler implemented | ✅ | `/auth/confirm/page.tsx` |

---

## 4. Payments (Paddle)

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 4.1 | Register company in India (Private Limited or LLP) | 🔴 | **Hard blocker** — required for Paddle KYB before live payments |
| 4.2 | Obtain business PAN | 🔴 | Required for company registration |
| 4.3 | Open business current account | 🔴 | Required for Paddle payouts |
| 4.4 | Complete Paddle KYB (Know Your Business) verification | 🔴 | Submit registration docs, PAN, bank details to Paddle |
| 4.5 | Create production Paddle prices (GBP early bird + standard) | 🔴 | Sandbox price IDs will not work in production |
| 4.6 | Set `NEXT_PUBLIC_PADDLE_ENVIRONMENT=production` | 🔴 | Currently `sandbox` |
| 4.7 | Update all Paddle env vars to production values | 🔴 | API key, webhook secret, client token, price IDs |
| 4.8 | Set `transaction_default_checkout_url` in Paddle Checkout settings to production URL | 🔴 | Required or all checkouts fail |
| 4.9 | Configure production webhook endpoint in Paddle dashboard | 🔴 | Must be public HTTPS URL — not ngrok |
| 4.10 | Test full purchase flow in production Paddle (real card) | 🔴 | Before launch |
| 4.11 | Write refund / cancellation policy | 🟡 | Required by Paddle ToS; link from checkout |
| 4.12 | Purchase confirmation email (Paddle sends one automatically; customise it) | 🟢 | Branding in Paddle dashboard → Notifications |
| 4.13 | Webhook signature verification | ✅ | Implemented in `/api/webhooks/paddle/route.ts` |
| 4.14 | Idempotent webhook (`onConflictDoNothing` on `paddleOrderId`) | ✅ | Implemented |
| 4.15 | VAT handling for UK / EU / AU | ✅ | Paddle is Merchant of Record — handles automatically |
| 4.16 | Razorpay for domestic India customers | 🟢 | Deferred to future phase |

---

## 5. File Storage (Cloudflare R2)

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 5.1 | Add production domain to R2 bucket CORS allowed origins | 🟡 | Currently may be `*`; restrict to your domain |
| 5.2 | Authenticate `/api/upload/presign` endpoint | 🔴 | Currently open — any request gets a presigned upload URL; add Supabase session check |
| 5.3 | Add server-side file type + size validation to presign route | 🟡 | Client validates but server must also validate |
| 5.4 | Review R2 bucket public access policy | 🟡 | Confirm read is public, write is presign-only |
| 5.5 | R2 client and presigned upload pipeline | ✅ | Implemented in `lib/r2.ts` and `/api/upload/presign` |

---

## 6. Search (Algolia)

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 6.1 | Create a separate production Algolia index | 🟡 | Don't use the same index for dev and prod |
| 6.2 | Run `configure-algolia-index.mjs` against production index | 🟡 | Apply searchable attributes, facets, and custom ranking |
| 6.3 | Restrict the `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` by HTTP referrer in Algolia dashboard | 🟡 | Prevents the key being used from other domains |
| 6.4 | Enable Algolia analytics in dashboard | 🟢 | Reveals top queries, zero-result searches |
| 6.5 | Set up cron to run `sync-algolia.mjs` weekly (eventBoost decays) | 🟢 | Or trigger manually before each event window opens |
| 6.6 | Review Algolia quota (free: 10k records, 10k searches/month) | 🟢 | Upgrade plan if needed at scale |
| 6.7 | Custom ranking and index settings | ✅ | `eventBoost`, `curationTierRank`, `hasHeroImage`, `lastVerifiedTimestamp` |

---

## 7. Security

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 7.1 | Protect all `/curator/*` routes with auth check | 🔴 | Currently wide open |
| 7.2 | Rate limit `/api/upload/presign` | 🟡 | Prevent abuse of R2 storage |
| 7.3 | Rate limit `/api/webhooks/paddle` | 🟡 | Signature check is the main guard, but rate limiting adds a layer |
| 7.4 | Add HTTP security headers via `next.config` | 🟡 | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| 7.5 | Audit all `NEXT_PUBLIC_` env vars — ensure no secrets are exposed | 🟡 | Paddle client token and Algolia search key are intentionally public; confirm nothing else leaks |
| 7.6 | Content Security Policy (CSP) | 🟢 | Complex to configure with Paddle.js and Algolia; implement after launch |
| 7.7 | Paddle webhook signature verification | ✅ | Done |
| 7.8 | Form input validation (Zod) | ✅ | Done on curator submit |
| 7.9 | SQL injection protection (Drizzle ORM parameterized queries) | ✅ | Done |

---

## 8. SEO & Discoverability

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 8.1 | Add JSON-LD structured data to experience pages | 🟡 | `TouristAttraction` or `Event` schema; listed as not built |
| 8.2 | Generate `sitemap.xml` | 🟡 | Use `next-sitemap` or build a `/sitemap.xml` route handler |
| 8.3 | Create `robots.txt` | 🟡 | Allow experience/search pages; disallow `/curator/*` and `/api/*` |
| 8.4 | Open Graph meta tags on all public pages | 🟡 | `og:title`, `og:description`, `og:image` (use hero image where available) |
| 8.5 | Twitter/X card meta tags | 🟢 | `twitter:card`, `twitter:image` |
| 8.6 | Canonical URLs on experience pages | 🟡 | Prevents duplicate indexing |
| 8.7 | Google Search Console — verify domain and submit sitemap | 🟢 | After deploy |
| 8.8 | Page title template | ✅ | `"%s — Experiences | Curated"` in `layout.tsx` |

---

## 9. Performance

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 9.1 | Replace `<img>` tags with `next/image` across all pages | 🟡 | Currently using raw `<img>`; loses automatic WebP conversion, lazy loading, and size optimization |
| 9.2 | Confirm hero images are sized appropriately before upload (≤ 1.5MB) | 🟡 | Largest current image is 5.4MB (London day trip); compress before R2 |
| 9.3 | Add loading skeleton states on SearchUI and Trip Board | 🟢 | Improves perceived performance |
| 9.4 | Review N+1 queries in server components | 🟡 | Experience detail page has multiple sequential queries; profile with Supabase dashboard |
| 9.5 | Algolia SearchUI debounce (already provided by InstantSearch by default) | ✅ | Default 200ms |
| 9.6 | `revalidatePath` strategy reviewed | ✅ | Called after every mutation in server actions |

---

## 10. Monitoring & Observability

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 10.1 | Error tracking — Sentry (or similar) | 🟡 | Catches runtime errors in both client and server; install `@sentry/nextjs` |
| 10.2 | Analytics — Plausible or PostHog | 🟡 | Plausible is privacy-first and GDPR-compliant with no cookie consent needed; PostHog for product analytics / session replay |
| 10.3 | Uptime monitoring — Better Uptime / Checkly | 🟡 | Alert on downtime within minutes |
| 10.4 | Paddle webhook failure alerts | 🟡 | Configure in Paddle dashboard → Notifications → failed delivery alerts |
| 10.5 | Vercel log drain to external provider | 🟢 | Default Vercel logs expire quickly; Axiom or Datadog for retention |
| 10.6 | Algolia search analytics | 🟢 | Enable in Algolia dashboard; see what users search for and fail to find |

---

## 11. Legal & Compliance

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 11.1 | Privacy policy page | 🔴 | Required by GDPR, UK GDPR, and Paddle ToS |
| 11.2 | Terms of service page | 🔴 | Required before collecting payment |
| 11.3 | Cookie consent banner | 🟡 | Required for any analytics cookies; `ec_views` (paywall) is functional, likely exempt |
| 11.4 | GDPR: data deletion request flow | 🟡 | Must be able to delete user data on request; Supabase Auth has account deletion |
| 11.5 | Affiliate link disclosure | 🟡 | FTC (US) and ASA (UK) require clear disclosure on pages with affiliate links |
| 11.6 | Image licensing records | ✅ | All images sourced from Pexels under free commercial license; credits stored in `heroImageCredit` field |
| 11.7 | VAT compliance | ✅ | Paddle MoR handles UK / EU / AU VAT automatically |

---

## 12. Email Deliverability

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 12.1 | Custom SMTP: set up Resend (recommended), Postmark, or SendGrid | 🔴 | Configure in Supabase Auth → SMTP Settings |
| 12.2 | SPF record: `v=spf1 include:[provider] ~all` for sending domain | 🔴 | Without SPF, magic links land in spam |
| 12.3 | DKIM: generate and add DNS record via SMTP provider | 🔴 | Required for Gmail delivery |
| 12.4 | DMARC policy: start with `p=none` monitoring, move to `p=quarantine` | 🟡 | `_dmarc.yourdomain.com TXT "v=DMARC1; p=none; rua=mailto:..."` |
| 12.5 | Test magic link email delivery to Gmail, Outlook, and Apple Mail | 🟡 | Check spam placement and rendering |
| 12.6 | Brand Supabase email templates | 🟡 | Add logo, subject line, and copy matching brand voice |

---

## 13. Content & Editorial

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 13.1 | US Open 2026 event pack — seed event, write 13 experiences, hero image, editorial overview | 🟡 | Next major content build |
| 13.2 | Real affiliate booking links for Rose & Crown and Hotel du Vin | 🟡 | Currently Booking.com search URLs; join Booking.com affiliate programme |
| 13.3 | Source + upload hero images for any experiences missing them | 🟡 | Crooked Billet, Black Lamb, London Day Trip now have images; verify all 18 published |
| 13.4 | Wimbledon day plan itinerary — review for accuracy before live date | 🟡 | Borough Market hours, TfL routes |
| 13.5 | The Black Lamb — verify Wimbledon Season Menu is confirmed for 2026 dates | 🟡 | Contact restaurant to confirm June 29–July 12 menu |
| 13.6 | Run `sync-algolia.mjs` after each batch of new publishes | 🟡 | Direct DB updates don't auto-index |

---

## 14. Pre-Launch Testing Checklist

Run through every flow end-to-end on production before opening to the public.

| # | Flow | Priority |
|---|------|----------|
| 14.1 | Purchase event pack → webhook → magic link → pack view | 🔴 |
| 14.2 | Magic link sign-in from shared Trip Board (friend's device) | 🔴 |
| 14.3 | Curator: submit draft → review → publish → verify in Algolia search | 🟡 |
| 14.4 | Experience page: 3-view paywall gate → pack upsell | 🟡 |
| 14.5 | Save to Trip Board (logged in + OTP sign-in flow) | 🟡 |
| 14.6 | Trip Board: status toggle, notes, share, book link | 🟡 |
| 14.7 | Search: keyword query, facet filters, results ranking | 🟡 |
| 14.8 | Homepage: event state (upcoming / live / past), teasers, search | 🟡 |
| 14.9 | Mobile responsiveness on iPhone and Android (Safari + Chrome) | 🟡 |
| 14.10 | Cross-browser: Chrome, Safari, Firefox | 🟢 |
| 14.11 | Test with a real payment card (Paddle production) | 🔴 |

---

## 15. Launch Sequence (suggested order)

1. Complete company registration and Paddle KYB (weeks — start now)
2. Set up custom SMTP + configure email templates
3. Deploy to Vercel with production env vars
4. Switch Paddle to production and test purchase flow
5. Add security headers and protect `/curator/*`
6. Set up error tracking (Sentry) and uptime monitoring
7. Write and publish Privacy Policy + Terms of Service
8. Submit sitemap to Google Search Console
9. Soft launch (invite-only / share link only) — validate all flows
10. Public launch
