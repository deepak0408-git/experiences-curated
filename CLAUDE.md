# CLAUDE.md

> **Next.js 16:** `params` is a `Promise` — always `await params` before accessing properties.
> **Middleware:** Keep named `middleware.ts` — renaming breaks Turbopack cache. Wrap Supabase calls in try-catch.
> **Content writing:** ALWAYS invoke the humanizer skill when writing any experience copy.
> **Brand name:** "Experiences | Curated" — never "ExperiencesCurated". Title template: `"%s — Experiences | Curated"`.
> **Nav auth state:** HomepageNav is a server component — pass `email` as prop from the page. Never use `useEffect` to read auth in navs (bfcache freezes client components on back-navigation).
> **Magic links:** always redirect to `/auth/confirm?next=<path>` — never `/auth/callback`.
> **Internal links:** always use Next.js `<Link>` — never plain `<a href>` for internal paths. Plain anchors cause full page loads, making pages bfcache-eligible and breaking back-navigation.

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
India in England 2026 event: 2bab697d-9d2b-45ff-9b46-9fbfc3a0a40b
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

app/_components/
  HomepageNav.tsx   # Server component — email passed as prop; SignOutButton + SignInLink are client
  SignOutButton.tsx  # "use client" — only interactive piece of the nav
  SignInLink.tsx     # "use client" — reads pathname to build /sign-in?next=<path>
  SearchForm.tsx     # "use client" — uses router.push() not form submit (avoids bfcache)
  SiteFooter.tsx     # Global footer — Privacy, Terms, Contact; max-w-5xl
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

- `PRE_TRIP_BRIEF` — set `live: true` + fresh `lines` ~1 week before event, redeploy. `live: false` = grey placeholder.
- `ARCHETYPE_SECTION_ORDER` — reorders the 5 pack sections per archetype (Connoisseur: stays+dining first; Immersionist: neighbourhood+dining first).
- Tailwind dynamic classes in ternaries get purged by Turbopack — always use static JSX branches.
- Magic links must redirect to `/auth/confirm?next=<path>` not `/auth/callback` (implicit hash-fragment flow).
- `purchases` table: `userId` nullable, `email + sportingEventId` unique, webhook idempotent via `onConflictDoNothing`.
- `PACK_PRICING`, `PACK_SECTIONS_BY_EVENT`, `INSIDER_TIPS`, `PACK_EDITORIAL`, `TOURNAMENT_RHYTHM` — all keyed by event slug. Add new event entries to all five when adding a pack.
- **PackView large object edits:** always Read 10–15 lines around the insertion point to confirm brace depth before editing `INSIDER_TIPS` or `PACK_EDITORIAL`. Misplaced entries break the function definitions that follow.
- `LocalCurrencyHint` — client component at `event-pack/[slug]/_components/LocalCurrencyHint.tsx`. Detects locale via `navigator.languages`, fetches rate via `/api/fx?currency=XXX` (proxied to frankfurter.app to avoid CORS in dev).
- Hero image upload: `node --experimental-strip-types scripts/seed-<name>.mjs` or direct R2 upload + DB update. R2 key: `sporting-events/hero/<slug>.jpg`.

**Purchase flow:** Paddle → `transaction.completed` webhook → purchases row + Supabase user → `/welcome` magic link → `/auth/confirm` → pack view.

---

## Pro Subscription
`pro_subscriptions` table. Check via `hasProSubscription(email)`. Gates: experience reads (3 free / unlimited Pro), PackView HowToBook, Trip Board (1 board free / unlimited Pro + Move to).

**Archetype quiz:** 12 questions → pilgrim | first_pilgrim | connoisseur | immersionist. Stored in `user_profiles.archetype`. Quiz at `/pro/onboarding?retake=true`.

**Paddle customer portal:** `app/profile/actions.ts` → `openPaddlePortal(paddleCustomerId)` — POST to portal-sessions API, redirect to hosted URL. Tokens expire; generate fresh each time.

---

## Trip Board
`trip_boards` + `saved_items.tripBoardId`. Default board auto-created + orphans backfilled via `getOrCreateDefaultBoard(userId)`. Active board via `?board=<id>`. Share URL includes `?board=<id>`. Clear board scoped to active board only. Card uses `overflow-visible` so Move-to dropdown isn't clipped; notes section uses `overflow-hidden rounded-b-xl`.

---

## My Travels Log
`travel_logs` table — `(userId, experienceId)` unique. `visitedAt` (date), `rating` (1–5), `moodTags` (text[], max 3). `logVisit` returns saved entry for optimistic UI. Public avg rating shown on experience pages when `ratingCount >= 3`. "You've been here" badge takes priority over archetype badge.

---

## Auth — magic links without email
```js
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
supabase.auth.admin.generateLink({
  type: 'magiclink', email: 'user@example.com',
  options: { redirectTo: 'http://localhost:3000/auth/confirm?next=/' }
}).then(({ data }) => console.log(data.properties.action_link));
```

---

## Image Uploads
`ImageUploader`: JPEG/PNG/WebP/AVIF ≤15MB → GET `/api/upload/presign` → PUT to R2.
R2 keys: `experiences/hero/<name>.jpg` · `sporting-events/hero/<name>.jpg`

---

## SPEC Quality
`spec_score_specificity` · `spec_score_provenance` · `spec_score_exceptionalism` · `spec_score_currency`
Body 500–1500 words · `why_its_special` 200–300 words.
