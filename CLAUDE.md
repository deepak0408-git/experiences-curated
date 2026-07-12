# CLAUDE.md

> **Next.js 16:** `params` is a `Promise` — always `await params` before accessing properties.
> **Middleware:** Keep named `middleware.ts` — renaming breaks Turbopack cache. Wrap Supabase calls in try-catch.
> **Experience lists:** Every event pack has a confirmed experience list saved in memory (`project_belgian_gp_experiences.md` etc.). At the start of any content session, read the relevant memory file and work strictly from that list — never propose, add, or swap experiences without user confirmation. If no memory file exists for an event, ask the user to confirm the full list before writing anything, then save it immediately.
> **Day-trip rule:** Any sporting event within ~30-45 min of a major city MUST include one experience covering that city as a day trip / sightseeing anchor (e.g. London for Wimbledon, Liverpool for the Open, Spa town for Belgian GP, Budapest for Hungarian GP). Check for this explicitly when drafting a new event's experience list — caught missing for Hungarian GP (added as experience #18, 11 Jul 2026) and retroactively flagged as missing for Italian GP (Milan day trip still to be added).
> **Content writing:** Use the `experience-researcher` skill to research, write, humanize, and present experience copy; use `experience-seeder` to seed to DB. Always output each field as a clearly labelled, copyable block in this order: Title, Subtitle, Body, Why it's special, Practical info (address, website, how to get there), How to Book / Access (public, short), How to Book Pro (Pro-gated, tactical detail — lead times, contacts), Worth knowing tip 1, Worth knowing tip 2, Avoid 1, Avoid 2, Hero image (3 options — user chooses before seeding).
> **Video content:** Use the `video-script-creator` skill for any Instagram/YouTube/TikTok video script — founder appears in no video (no face, no voice). Produces narration script + honesty-gated visual asset list (real hero images > verified generic B-roll > text/stat card — never AI-generated footage of a real venue). Stops at script; narration via ElevenLabs, assembly via Canva/InVideo.
> **Brand name:** "Experiences | Curated" — never "ExperiencesCurated". Title template: `"%s — Experiences | Curated"`.
> **Nav auth state:** HomepageNav is a server component — pass `email` as prop from the page. Never use `useEffect` to read auth in navs (bfcache freezes client components on back-navigation).
> **Magic links:** always redirect to `/auth/confirm?next=<path>` — never `/auth/callback`.
> **Internal links:** always use Next.js `<Link>` — never plain `<a href>` for internal paths. Plain anchors cause full page loads, making pages bfcache-eligible and breaking back-navigation.
> **Design system:** Dark canvas + fluorescent green. Merged to `main` 21 Jun 2026 (commit 135bec7 = validated baseline). Rollback: `git reset --hard 135bec7`. Full token set in memory `project_design_system.md`. Full-site overhaul not yet started — Tier 3 (experience detail, event-pack, curator) pending.
> **Third-party platform setup:** Before proposing any hands-on setup on a third-party platform (analytics, verification, embeds, integrations) — search for that platform's documented plan/tier limitations first, before touching anything. Stop and re-search after one failed attempt, not three. See memory `feedback_third_party_platform_limits.md` for the incident this came from (Substack free-tier + Google Search Console, 10 Jul 2026 — an hour lost to GA4/GTM setup that a single upfront search would have shown was futile).

---

## Design System — Dark Canvas + Fluorescent Green

Established Jun 2026 on `redesign/homepage`. Applied to homepage; full-site overhaul pending.

### Colour tokens
| Token | Hex | Usage |
|---|---|---|
| Background | `#0A0A0A` | Page base, receding sections |
| Surface | `#141414` | Cards, raised sections |
| Surface-2 | `#1A1A1A` | Nested panels, inputs |
| Border | `#2A2A2A` | All borders and dividers |
| Muted | `#A3A3A3` | Body copy, secondary text |
| Foreground | `#FFFFFF` | Headings, primary text |
| Accent | `#AAFF00` | CTAs, labels, bullets, hover — NEVER large bg fill |
| Accent hover | `#BBFF33` | Hover on filled accent buttons |
| Dim text | `#6A6A6A` | Nav/footer links (non-overlay) |

### Rules
- `rounded-sm` everywhere — no pill shapes
- Zone separation via background shade only — never `border-t`/`border-b` between zones (causes visible lines)
- `font-black` for all headings; `font-mono font-black` for category tags and pack headers
- Tailwind dynamic classes in ternaries get purged by Turbopack — always use static JSX branches

### Nav dual-context pattern
HomepageNav and SignInLink accept `overlay` prop:
- `overlay=true` (over hero): `text-white/80 hover:text-[#AAFF00]`, `bg-black/40 backdrop-blur-sm`
- `overlay=false` (solid bg): `text-[#6A6A6A] hover:text-[#AAFF00]`, `bg-[#0A0A0A] border-b border-[#2A2A2A]`

---

## Commands

```bash
npm run dev / build / lint
npm run db:generate / db:push / db:migrate / db:studio
node --experimental-strip-types scripts/sync-algolia.mjs   # re-index all published
node --experimental-strip-types scripts/seed-<name>.mjs
```
**After any direct DB update to a searchable field on a published experience, run `sync-algolia.mjs`.**

---

## Key IDs
```
London destination:          75758888-28b9-4e09-82ba-f05681ecc904
New York destination:        fb782de2-bbe6-410f-b466-2a4e628cda10
Belgian Ardennes destination: 101b815a-ba64-4484-aad6-63721a44ed85
Liverpool destination:       2bd85c65-fbf9-4888-a081-a6be0b48a225
Liverpool, England dest:     263faaad-ceed-4355-acb7-9f2073cb1028
Open Championship 2026 event: ccb585a6-3cdb-40ce-999e-a1d455854301
India in England 2026 event: 2bab697d-9d2b-45ff-9b46-9fbfc3a0a40b
Wimbledon 2026 event:        8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf
US Open 2026 event:          91f298a3-ca22-49c3-9c8e-5a200f0026c9
Belgian GP 2026 event:       b1816396-6d71-4693-a53f-05bccb2d8a8e
Milan destination:           0b0d8f9a-911d-4cc7-8049-50e4685958ca
Italian GP 2026 event:       b93770c0-3d96-4e81-b3d0-c1e3a788fd8e
Surrey/Virginia Water dest:  0b015fab-26a0-48b4-a8ff-ef7c7ed977a7
BMW PGA Championship 2026:   ea035967-b5d7-47e6-ad44-7cf4db07e70b
Budapest destination:        0d01105a-1e01-40a7-91af-89299939389b
Hungarian GP 2026 event:      a767ae5f-de6c-48a1-b6fb-fec941f3ad86
```

**Live event dates — always match `sporting_events.start_date/end_date` in the DB, and the Content Calendar (`C:\Users\HP\.claude\docs\Content Calendar.txt`) is the single source of truth. If any date below ever conflicts with the Calendar or the DB, trust the DB, fix the Calendar, then fix this list — never the reverse.**
```
Wimbledon 2026:            29 Jun – 12 Jul 2026
India in England 2026:     1 – 19 Jul 2026
Open Championship 2026:    16 – 19 Jul 2026
Belgian GP 2026:           17 – 19 Jul 2026
US Open 2026:              30 Aug – 13 Sep 2026 (Fan Week free-admission period 23-29 Aug precedes main draw)
Italian GP 2026:           4 – 6 Sep 2026
BMW PGA Championship 2026: 17 – 20 Sep 2026
```

---

## Project Structure

```
app/
  page.tsx                    # Homepage — hero, teasers, Trip Board CTA, sign-up form
  experience/[slug]/          # Detail — free-view gate, "You've been here" badge, avg rating
  search/page.tsx             # Algolia InstantSearch — passes archetype + userEmail to SearchUI
  event-pack/[slug]/          # Dual-state: public landing | authenticated pack view
  trip-board/                 # Multi-board planner — create, rename, delete, move, schedule
  pro/                        # Pro subscription + onboarding quiz + archetype reveal
  profile/                    # Archetype, travel stats, linked packs, Pro status, Paddle portal
  my-travels/                 # Travel log — visits, 1-5 ratings, mood tags
  sign-in/                    # Magic link sign-in — reads ?next= param, redirects to /auth/confirm?next=
  privacy/ terms/ help/       # Static legal + FAQ pages
  curator/review/             # Review queue — publish / return / archive
  curator/submit/             # New + edit experience form
  auth/callback / confirm     # PKCE + implicit auth flows
  api/webhooks/paddle         # Purchase webhook → purchases row + Supabase user
  api/webhooks/dodo           # Dodo webhook → purchases / pro_subscriptions + Supabase user
  api/checkout/dodo           # Server-side Dodo checkout session creation (event packs)
  api/checkout/dodo-pro       # Server-side Dodo checkout session creation (Pro subscription)
  api/pack-feedback           # GET: saves pack star rating, redirects to /pack-feedback/thanks
  api/pack-feedback/comment   # POST: saves comment + consent, sends single curator notification
  api/cron/post-trip-feedback # Daily 04:30 UTC — fires 2 days after event endDate; magic link + pack rating email
  pack-feedback/thanks        # Thank-you page — comment box + consent toggle for 4-5 star ratings

app/_components/
  HomepageNav.tsx   # Server component — email passed as prop; SignOutButton + SignInLink are client
  SignOutButton.tsx  # "use client" — only interactive piece of the nav
  SignInLink.tsx     # "use client" — reads pathname to build /sign-in?next=<path>
  SearchForm.tsx     # "use client" — uses router.push() not form submit (avoids bfcache)
  HeroCarousel.tsx  # "use client" — 2-slide rotating carousel; pill top-8, title top-[15%], CTA/dots/hint bottom; pointer-events guard for mobile pause
  SiteFooter.tsx     # Global footer — Privacy, Terms, Contact, affiliate disclosure; max-w-5xl
  CookieBanner.tsx   # Cookie consent

lib/db.ts          # Drizzle singleton — always import from here
lib/pro.ts         # hasProSubscription(email)
lib/trip-boards.ts # getOrCreateDefaultBoard, getUserBoards, getBoardCount, createBoard
lib/quiz.ts        # QUIZ_QUESTIONS, ARCHETYPE_DETAILS, scoreQuiz
schema/database.ts # All tables and relations
```

---

## Database
`DATABASE_URL` (transaction pooler :6543) for app runtime. `DIRECT_URL` (session :5432) for drizzle-kit only. Never instantiate postgres directly — always `import { db } from "@/lib/db"`.

---

## Key Enums
```
status:         draft | in_review | published | archived | flagged
experienceType: activity | dining | accommodation | transit | cultural_site |
                natural_wonder | event | neighborhood | day_trip | multi_day |
                sports_venue | fan_experience
budgetTier:     free | budget | moderate | splurge | luxury
curationTier:   editorial | local_expert | community
sport:          tennis | cricket | football | rugby | golf | formula_one | cycling | athletics | other
```

---

## Experience Lifecycle
`draft` → `in_review` → `published` | `archived` | `flagged`
- `publishExperience` → calls `indexExperience()` · `unpublishExperience` / `archiveExperience` → calls `removeFromIndex()`
- Edit page only loads `draft` or `in_review` — returns `notFound()` otherwise.
- Seed scripts: always use status `in_review`, set `lastVerifiedDate` + `editorialNote` + `curationTier`. Subtitle hard limit: 120 chars.

**Algolia ranking:** `eventBoost` → `curationTierRank` → `hasHeroImage` → `lastVerifiedTimestamp` → `saveCount` → `publishedAt`

---

## Event Pack
`/event-pack/[slug]` — dual-state. Public landing for non-purchasers; pack view (`PackView.tsx`) for authenticated purchasers.

- **Pre-trip brief** — DB-driven (not hardcoded). Content in `sporting_events.pre_trip_brief_lines` (text[]); goes live when `pre_trip_brief_live_at` is stamped. Daily cron (`/api/cron/pre-trip-brief-reminder`) fires ≤10 days before event → approval email → one-click activate (`/api/pre-trip-brief/activate`) → buyers notified. No redeploy needed. Grey placeholder shows until activated. Use `pre-trip-brief` skill to write content (3 lines: Weather → Transport → One innovation).
- `ARCHETYPE_SECTION_ORDER` — reorders the 5 pack sections per archetype (Connoisseur: stays+dining first; Immersionist: neighbourhood+dining first).
- Tailwind dynamic classes in ternaries get purged by Turbopack — always use static JSX branches.
- Magic links must redirect to `/auth/confirm?next=<path>` not `/auth/callback` (implicit hash-fragment flow).
- `purchases` table: `userId` nullable, `email + sportingEventId` unique, webhook idempotent via `onConflictDoNothing`.
- **Paddle checkout pre-fills user email** via `customer: { email: userEmail }` in `Paddle.Checkout.open()` — prevents wrong email on purchase. `userEmail` passed as prop to `PaddleCheckout` from the server page.
- `PACK_PRICING`, `PACK_SECTIONS_BY_EVENT`, `INSIDER_TIPS`, `PACK_EDITORIAL`, `TOURNAMENT_RHYTHM` — all keyed by event slug. Add new event entries to all five when adding a pack.
- **PackView large object edits:** always Read 10–15 lines around the insertion point to confirm brace depth before editing `INSIDER_TIPS` or `PACK_EDITORIAL`. Misplaced entries break the function definitions that follow.
- `LocalCurrencyHint` — client component at `event-pack/[slug]/_components/LocalCurrencyHint.tsx`. Detects locale via `navigator.languages`, fetches rate via `/api/fx?currency=XXX` (proxied to frankfurter.app to avoid CORS in dev).
- Hero image upload: `node --experimental-strip-types scripts/seed-<name>.mjs` or direct R2 upload + DB update. R2 key: `sporting-events/hero/<slug>.jpg`.

**Purchase flow (Paddle):** Paddle → `transaction.completed` webhook → purchases row + Supabase user → `/welcome` magic link → `/auth/confirm` → pack view.

**Purchase flow (Dodo):** Dodo checkout session created server-side → overlay opens client-side → `payment.succeeded` webhook → purchases row + Supabase user → redirect to `return_url` (pack view).

**Payment provider switch:** `NEXT_PUBLIC_PAYMENT_PROVIDER=dodo|paddle` — single env var controls which checkout renders on event pack pages and Pro page. Both integrations coexist in codebase. Dodo is current default; flip to paddle if Paddle KYB clears.

**Dodo checkout:** `app/api/checkout/dodo/route.ts` creates session server-side. Pass `customer: { email }` (no `name` — Dodo rejects empty string as fraud signal). Client opens overlay via `DodoPayments.Checkout.open({ checkoutUrl })`. SDK: `dodopayments@2.36.0` (server) + `dodopayments-checkout@1.9.4` (client).

**Dodo environments:** `NEXT_PUBLIC_DODO_MODE=test_mode|live_mode`. Test mode product IDs are separate from live — both sets in `.env.local` (live commented out). Webhook secret differs between test and live.

---

## Pro Subscription
`pro_subscriptions` table. Check via `hasProSubscription(email)` (boolean) or `getProDetails(email)` (returns `{ isPro, isAnnual, currentPeriodEnd }`) in `lib/pro.ts`. Use `getProDetails` on event pack pages — it returns billing cycle in one query. Gates: experience reads (3 free / unlimited Pro), PackView HowToBook, Trip Board (1 board free / unlimited Pro + Move to).

**Annual vs Monthly (27 Jun 2026):**
- Annual Pro: free access to all event packs while `currentPeriodEnd > now` — no purchase needed. Pack page gate: `hasPurchased OR freeEvent OR isAnnualProActive`.
- Monthly Pro: unlimited reads, trip boards, PDF downloads, ask curator, concierge picks — but must buy each event pack individually.
- Gift codes: annual-only (`billingCycle = "annual"` check in `/api/gift-codes/generate/route.ts`).
- New pack notifications (fire from `curator/events/actions.ts` when event is reactivated): annual gets "in your library" email; monthly gets "buy it or upgrade" dual-CTA email.
- **Newsletter announcement — 2 days after activation:** `/api/cron/newsletter-new-pack-announcement` (daily cron) emails every row in `newsletter_subscribers` once `activatedAt` is ≥2 days old and `newsletterAnnouncedAt` is still null. Subject: `New Event Pack: [name] — the full guide is live`. Active Pro subscribers are excluded from this send (case-insensitive email match against `pro_subscriptions` where `currentPeriodEnd > now`) so a subscriber who is both Pro and newsletter-subscribed doesn't get the pack announced twice. Fixed 12 Jul 2026 after this exact duplicate was caught live on Hungarian GP's activation.

**Pro launched 27 Jun 2026.** HIDE_PRO removed from Vercel. All upgrade nudges live:
- Homepage Annual Pro strip (above footer)
- Event pack landing one-liner below checkout — "Or get this + every future pack with Annual Pro"
- PackView monthly→annual upgrade banner (`isPro && !isAnnual`)
- Profile: "Included with Annual Pro" section shows all live packs (excludes already-purchased ones)
- New pack notification emails: subject `New Event Pack: [name] — it's in your library` (annual) / `— buy it or upgrade` (monthly)

**Archetype quiz:** 12 questions → pilgrim | first_pilgrim | connoisseur | immersionist. Stored in `user_profiles.archetype`. Quiz at `/pro/onboarding?retake=true`.

**Paddle customer portal:** `app/profile/actions.ts` → `openPaddlePortal(paddleCustomerId)` — POST to portal-sessions API, redirect to hosted URL. Tokens expire; generate fresh each time.

---

## Trip Board
`trip_boards` + `saved_items.tripBoardId`. Default board auto-created + orphans backfilled via `getOrCreateDefaultBoard(userId)`. Active board via `?board=<id>`. Share URL includes `?board=<id>`. Clear board scoped to active board only. Card uses `overflow-visible` so Move-to dropdown isn't clipped; notes section uses `overflow-hidden rounded-b-xl`.

**Empty board state:** queries `sporting_events` for upcoming events (`endDate >= today`) and renders them dynamically — no hardcoded event slugs. Add new events to the DB and they appear automatically.

---

## Post-trip Feedback
`event_pack_feedback` table — `(email, sportingEventId)` unique. `rating` (1–5), `comment`, `displayConsent`. Populated via in-email star link → `/api/pack-feedback` → `/pack-feedback/thanks`. Single curator notification email fires from `/api/pack-feedback/comment` (always — sub-4 ratings auto-fire silently from thanks page). Future: display consented testimonials on pack landing pages (Operations #18).

`sporting_event_experiences` join table — links experiences to events with `packRank` (integer, nullable). Top-10 ranked experiences shown in My Travels post-event prompt (`/my-travels?event=<id>`). Ranks set via SQL; curator UI deferred (Operations #20). Backfilled from `experiences.sportingEventId` — that FK kept for compatibility.

**Travel log limitation:** `travel_logs` unique on `(userId, experienceId)` — returning pilgrims can't re-rate same experience for a new event edition. Fix before Wimbledon 2027: add `sportingEventId` to unique constraint (Operations #19).

## My Travels Log
`travel_logs` table — `(userId, experienceId)` unique. `visitedAt` (date), `rating` (1–5), `moodTags` (text[], max 3). `logVisit` returns saved entry for optimistic UI. Public avg rating shown on experience pages when `ratingCount >= 3`. "You've been here" badge takes priority over archetype badge.

---

## Email — magic links via Resend API
Sign-in page POSTs to `/api/auth/magic-link` → generates link via Supabase admin → sends via Resend API.
**Do not use `supabase.auth.signInWithOtp()` on the client** — Supabase free tier SMTP is rate-limited and unreliable.
`RESEND_API_KEY` must be set in env. Sends from `hello@experiences-curated.com`.

For scripts/admin use (generating links without triggering email):
```js
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
supabase.auth.admin.generateLink({
  type: 'magiclink', email: 'user@example.com',
  options: { redirectTo: 'http://localhost:3000/auth/confirm?next=/' }
}).then(({ data }) => console.log(data.properties.action_link));
```

---

## Security
- `/curator/*` protected in `middleware.ts` — unauthenticated users redirected to `/sign-in?next=...`
- `/api/upload/presign` requires authenticated Supabase session — returns 401 otherwise
- HTTP security headers set in `next.config.ts` — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- GDPR account deletion: `deleteAccount()` server action in `app/profile/actions.ts` — deletes all user artefacts in FK-safe order (saved_items → trip_boards → travel_logs → community_flags → taste_profiles → user_profiles → pro_subscriptions → public.users → auth.deleteUser), then anonymises purchases by email (`[deleted]` + NULL customer ID). Purchases matched by email not userId — covers users who bought without ever signing in.
- Dodo webhook creates `public.users` row on purchase — ensures all buyers are counted as users and included in GDPR deletion flow.
- `npm run build` must pass clean before every deploy — last confirmed 17 Jun 2026
- **Hero images — 3 options required:** Always present 3 CC-licensed image options before seeding. Never present fewer. Download to `Images/` folder with descriptive filename before running seed script.
- **Radisson Blu Palace Hotel Spa → rebranded:** Now trades as Van der Valk Hotel Spa (Place Royale 39, Spa) from May 2024. Always verify hotel/venue trading name before writing.
- **Belgian GP experiences:** All 15 published and packRanks set as of 15 Jun 2026. Hero images missing: Van der Valk Hotel Spa (email reception@valkspa.be), Fan Zone at Raidillon (f1media@f1.com or capture at race). Le Val d'Amblève hero image sourced by user — needs uploading to R2 and DB update.
- **Italian GP experiences:** All 16 seeded, published, and packRanked as of 8 Jul 2026. PackView fully wired (PACK_EDITORIAL, TOURNAMENT_RHYTHM, INSIDER_TIPS, PACK_SECTIONS_BY_EVENT, PACK_PRICING). Event hero image set; ticketingUrl set; pre-trip brief lines written (dormant, cron activates ~10 days before 6 Sep). Dodo checkout live in both `.env.local` and Vercel (Early Bird `pdt_0NikYGrrEQD1Fpj2vgLox` €15, Standard `pdt_0NikYMwNSXtnJZKV2Oe8V` €25). Event dates: 4–6 Sep 2026. Milan destination: region = Lombardy, currency = EUR. Event still `isHidden: true` — activate via /curator/events closer to race weekend. Booking.com affiliate links added 10 Jul 2026 for all 7 hotels (Hotel de la Ville, Staying in Milan's 3 hotels, Lake Como's 3 hotels) — partner approval came through. Only 5 of 16 experiences carry Pro-gated `howToBook` content (Grandstand 22, Grandstand 26, Paddock Club, Hotel de la Ville, Alfa Romeo Museum) — see feedback_pro_concierge_scope memory for why the other 11 were declassified. Full detail in memory `project_italian_gp_experiences.md`.
- **Open Championship experiences:** All 15 published, all hero images uploaded, packRanks set, event hero image uploaded to R2. PackView + page.tsx fully wired. Dodo test price IDs in .env.local; live IDs (early bird pdt_0NhBDTdJDrNX32NMvvo0t, standard pdt_0NhBDN4jP7TDTnT8CElua) must be added to Vercel before go-live. Pre-trip brief in DB (dormant) — cron activates ~9 Jul 2026.
- **BMW PGA Championship experiences:** All 17 seeded, published, packRanked, and hero-imaged as of 11 Jul 2026 (built against the Open Championship's golf template, not the F1 template — private-club framing, Festival of Golf angle). PackView fully wired. Event hero image set. Pre-trip brief lines written (dormant, cron activates ~7 days before 17 Sep). Dodo checkout live in both `.env.local` and Vercel (Early Bird `pdt_0NitXmVzWZrQ7edKrq7fk` £15, Standard `pdt_0NitXtHNIzpuzaPezysKC` £25). Event dates: 17–20 Sep 2026. Surrey/Virginia Water destination created (region = Surrey, currency = GBP). Event still `isHidden: true` — activate via /curator/events closer to tournament week. Wentworth Club is fully private (no green fees, no public booking) — do not write any experience implying public course access. Full detail in memory `project_bmw_pga_experiences.md`. Built in ~5 hours end-to-end (research through deployed, tested pack) vs. the 10-day per-event estimate in the Content Calendar.
- **Duplicate pricing table bug fixed 11 Jul 2026:** `app/event-pack/[slug]/page.tsx` had a second undocumented `DODO_PRICING` table separate from `PACK_PRICING`, silently falling back to Wimbledon's Dodo product ID for any event missing from it (Italian GP and BMW PGA both affected). Removed — `PACK_PRICING` is now the single, provider-aware source of truth for both Dodo and Paddle. See `feedback_duplicate_config_tables.md` memory — when wiring a new event, grep for every `Record<string,` per-event object in both PackView.tsx and page.tsx, not just the 5 named in the event-builder skill.
- **R&A media contact:** media@randa.org (confirmed from theopen.com/media-centre). Use for Open Championship hero image requests. Do NOT use mediaenquiries@randa.org — that address was unverified.
- **Hillside Golf Club green fees (2026):** £300 midweek / £335 weekends (summer). Third-party sites show outdated figures — always use official hillside-golfclub.co.uk.
- **Homepage carousel:** 2-slide rotating HeroCarousel (`app/_components/HeroCarousel.tsx`). Featured events controlled via `/curator/events` (radio Slot 1/2 + Deactivate checkbox). `homepage_slot` + `is_hidden` columns on `sporting_events`. Deactivated events hidden from carousel and calendar section. Active events sort first in curator table. Pill pinned `top-8`, title `top-[15%]`, CTA/dots/hint `bottom-0`. Dot indicators: `flex-1 sm:flex-none` for 50-50 mobile / natural desktop split.
- **Pre-trip brief cron window:** fires ≤7 days before event startDate (changed from 10 days, 17 Jun 2026). Open brief dormant (NULL live_at) — cron fires ~9 Jul. Belgian GP brief not yet written — cron fires ~10 Jul. Cricket brief written and activated (live_at = NOW()) 21 Jun 2026.
- **Free event access:** Controlled via `FREE_EVENT_SLUGS` env var (comma-separated slugs) in Vercel. Replaces old `WIMBLEDON_FREE_ACCESS=true` boolean (changed 21 Jun 2026). Add a slug = free; empty = paid. Currently: `wimbledon-2026,india-in-england-cricket-2026`. Free period ends 29 Jun — set to empty string in Vercel. No code change needed.
- **Algolia search:** `searchableAttributes` explicitly set in sync-algolia.mjs — includes `sport`, `neighborhood`. `sportingEventId` registered as facet — required for `freeEventIds` filter in SearchUI. After any neighborhood/sport DB update on a published experience, run sync-algolia.mjs.
- **Search respects event activation state via `eventIsHidden` facet.** Publishing an experience does not make it publicly searchable if its parent sporting event is still `isHidden: true` — sync-algolia.mjs sets `eventIsHidden` on each record (inherits the parent event's `isHidden`; non-event experiences always `false`), and SearchUI's `<Configure>` always applies `filters="eventIsHidden:false"` (ANDed with the free-tier filter when present). This is a query-time filter, not an index-membership gate — hidden-event experiences stay indexed, just excluded from results until the event is activated via `/curator/events`. Fixed 12 Jul 2026 after US Open 2026 (still hidden) showed up in live search results.
- **Activating/deactivating an event auto-syncs its `eventIsHidden` facet in Algolia.** `saveHomepageSlots` (`app/curator/events/actions.ts`) detects any event whose `isHidden` flag actually changed and fire-and-forgets a `partialUpdateObjects` call for just that event's linked experiences — no need to manually rerun `sync-algolia.mjs` after activating an event from `/curator/events`. Added 12 Jul 2026 alongside the `eventIsHidden` filter itself, to prevent search staying stale after activation.
- **`eventName` is a searchable attribute** (the sporting event's full name, e.g. "Hungarian Grand Prix 2026") so typing an event's name reliably surfaces all of its experiences. Without it, a search only matched experiences whose `destinationName` happened to contain the same word — Belgian GP worked by coincidence ("Belgian Ardennes" destination), Hungarian GP didn't ("Budapest" destination, only 3/16 experiences matched via body-text mentions). Fixed 12 Jul 2026.
- **Booking.com affiliate links:** `experiences.bookingLinks` is jsonb, `Array<{ platform, label, url }>` — always set a distinct `label` (hotel name) per entry, since `platform` alone collides when one experience lists multiple hotels on the same platform. Update via a throwaway script matching by title (pattern: `scripts/update-booking-links.mjs`), same as any other direct DB write. **The public experience page caches for 1 hour with no revalidation tag** — a direct DB write to `bookingLinks` on a published experience won't show up until either the cache expires or you re-click Publish on that row in `/curator/review` (calls `revalidatePath`, safe no-op on status, only side effect is `publishedAt` re-stamping). Full detail in memory `feedback_booking_com_affiliate_links.md`.

---

## Image Uploads
`ImageUploader`: JPEG/PNG/WebP/AVIF ≤15MB → GET `/api/upload/presign` (requires auth session) → PUT to R2.
R2 keys: `experiences/hero/<name>.jpg` · `sporting-events/hero/<name>.jpg`

---

## SPEC Quality
`spec_score_specificity` · `spec_score_provenance` · `spec_score_exceptionalism` · `spec_score_currency`
Body 500–1500 words · `why_its_special` 200–300 words.
