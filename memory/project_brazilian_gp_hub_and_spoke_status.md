---
name: project_brazilian_gp_hub_and_spoke_status
description: Brazilian GP 2026 — hub-and-spoke pack built 12 Sep 2026, planner cost data not yet seeded
metadata:
  type: project
---

Brazilian Grand Prix 2026 hub-and-spoke pack built 12 Sep 2026 (see
[[project_brazilian_gp_experiences]] for the confirmed experience list this
was built from — originally 24, now 25 after Heineken Village was added in
a separate session, same day). Event ID
`37e82616-34fd-4acb-a4b4-6575b0d674f4`, slug `brazilian-grand-prix`.
`packFormat: hub_and_spoke`, `packStatus: built_hidden`, `isHidden: true` —
all already correct before this session started.

**Experience #25, Heineken Village (fan zone), added in a separate session
after this pack was built — not yet wired into the spoke code.** Tagged to
the **Map (Venue) spoke**, `MapSpoke.tsx`, on founder instruction. Still
needs, once the experience is actually seeded: (1) a real
`<SpokeExperienceCard>` added to
`spokes/brazilian-grand-prix/MapSpoke.tsx`, and (2) a matching
`EXPERIENCE_TO_SPOKE` entry in `app/experience/[slug]/page.tsx` pointing to
`{ eventSlug: "brazilian-grand-prix", spokeId: "map", spokeLabel: "Venue
Map" }` — same pattern already used for Mexico City GP's own Fan Zone
experience (`mexico-city-gp-fan-zone-`) in that same table. Do this in the
same pass as the seed script, not as a separate follow-up.

**All 12 spokes written and live** at `/event-pack/brazilian-grand-prix` +
its 12 spoke pages (Cost, Tickets, Hotels, Getting There, Weather,
First-Timer's Guide, Where to Eat, Day Trips, Itinerary, Arrival, Map,
Luxury) — all verified 200 via curl, `npx tsc --noEmit` clean. Files:
`app/event-pack/[slug]/_hub-and-spoke/spokes/brazilian-grand-prix/*.tsx`,
wired into `spokeConfig.ts`, `spokes/registry.ts` (SPOKE_COMPONENTS +
SPOKE_METADATA), `HubPage.tsx` (INTRO_BY_EVENT + QUICK_REFERENCE_BY_EVENT),
`BrandHero.tsx` SHORT_NAMES ("Brazilian GP 2026"), and
`app/experience/[slug]/page.tsx` EXPERIENCE_TO_SPOKE (all 24 experience-slug
prefixes mapped, matching real `SpokeExperienceCard` placement).

**Day Trips spoke folds in 4 same-city sightseeing experiences** (Ibirapuera
Park, Avenida Paulista & MASP, Beco do Batman, Feira da Liberdade) alongside
the 3 true out-of-city day trips (São Roque, Santos & Guarujá, Campos do
Jordão) — founder's explicit decision, 12 Sep 2026, since São Paulo is the
host city itself, not a satellite town.

**Whole-pack completeness audit run** (§4b-1): all 24 experiences get a real
`SpokeExperienceCard` somewhere (verified by grep), every address is set in
both DB field and body prose, every "no Google rating" case is a legitimate
non-venue piece (route/transit/ticket-tier/multi-day-trip). **Affiliate
links — COMPLETE, 12 Sep 2026.** Hotel Emiliano and Budget & Mid-Range
Stays (Morumbi) both had zero `bookingLinks` — flagged to founder per
[[feedback_affiliate_link_generation]] rather than constructed by Claude.
Founder provided all 3 real Booking.com affiliate URLs directly (CJ
redirects — jdoqocy.com for Emiliano, anrdoezrs.net for Blue Tree Premium
Verbo Divino, kqzyfj.com for Ibis Budget São Paulo Morumbi); Claude
verified each one genuinely resolves to the real named hotel's
booking.com page via `isRealAffiliateLink()`'s own detection logic before
writing it to `bookingLinks`, each with a distinct `label` (hotel name) per
the standing multi-hotel-per-experience rule. Scripts:
`scripts/add-brazilian-gp-emiliano-booking-link.mjs`,
`...-budget-hotel-booking-links.mjs`, `...-ibis-booking-link.mjs`. Not
resynced to Algolia — `bookingLinks` isn't a searchable attribute in
`sync-algolia.mjs`, confirmed by grep before skipping.

**GetYourGuide affiliate sweep — COMPLETE, 12 Sep 2026, final count 5
links across 4 experiences.** Founder asked for an exhaustive check across
every experience in the pack, not just the Day Trips spoke — Claude's
initial audit (all 25 experiences, Heineken Village included) surfaced
only the 3 day trips as GYG-eligible (São Roque, Santos & Guarujá, Campos
do Jordão — each already naming GetYourGuide in `bookingMethod`). **The
founder then supplied 2 more real GYG links Claude's audit had missed** —
a general São Paulo walking tour and a farmers-market/Brazilian food tour
— neither maps to a single existing named experience, so both were
attached to First-Timer's Guide to São Paulo (the city-orientation piece)
on founder decision. **Lesson: an "exhaustive" audit against named
experiences alone can still miss real standalone city-level GYG products
that don't correspond to any single pack experience — worth checking
GetYourGuide's own city listing page directly in addition to auditing
`bookingMethod` mentions, next time this kind of sweep is asked for.**
Final 5 links: São Roque Wine Route & Shopping Tour (São Roque
experience), São Paulo Beaches Day Tour (Santos & Guarujá), Campos do
Jordão Guided Tour (Campos do Jordão), São Paulo Walking Tour + São Paulo
Farmers Market & Brazilian Food Tour (both on First-Timer's Guide). Every
link verified as a genuine getyourguide.com domain before writing, per
`isRealAffiliateLink()`'s own detection logic — none constructed by
Claude, per feedback_affiliate_link_generation. Scripts:
`scripts/add-brazilian-gp-gyg-booking-links.mjs`,
`...-saoroque-gyg-link.mjs`, `...-walkingtour-gyg-link.mjs`,
`...-foodtour-gyg-link.mjs`. **All affiliate opportunities in this pack —
Booking.com (3) + GetYourGuide (5) — are now fully linked.**

**Known open items, deliberately not faked:**
- **Flight cost research — COMPLETE, 12 Sep 2026.** All 49 origin markets
  seeded to `planner_flight_cost` for São Paulo, `seasonalBand: "nov"`, via
  `scripts/seed-brazilian-gp-flight-costs-batch1.mjs` (24 markets,
  Amsterdam–Mexico City) and `...-batch2.mjs` (24 markets, Miami–Zurich, +
  same-city São Paulo $0.00 row). Researched via `_flight-research-tool.mjs`
  (Google Flights + Kayak, combined-dataset density-boundary outlier
  exclusion), presented as Artifact tables per batch, founder-approved as-is
  with no overrides. Manila needed one retry (Google Flights returned 0
  results on first attempt, resolved cleanly on retry). **Moscow is
  single-source** (Kayak returned 0 results — a documented, recurring,
  event-independent gap for this origin, SVO effectively cut off from EU
  routing since 2022) — its narrower $1,674–1,877 range is a real algorithm
  output on a thin one-site sample, not an error; approved by founder as-is.
- **Hotel tier costs — COMPLETE, 12 Sep 2026.** All 4 tiers seeded to
  `planner_hotel_tier_cost` for São Paulo (100% anchor city, no zone split —
  `nextClosestHotelDestinationId` confirmed NULL), `seasonalBand: "nov"`, via
  `scripts/seed-brazilian-gp-hotel-costs.mjs`: budget $42–112/night,
  moderate $127–208/night, splurge $210–311/night, luxury $415–730/night.
  **Real, structural data-quality finding, not a bug:** the standard
  Booking.com search pool (35-37 hotels, `ht_id=204`, ≥50 reviews,
  `order=review_score_and_price`) was dominated by serviced-apartment
  "flats"/hostels with star ratings not predictive of price (same failure
  mode as London/Wimbledon 2027's 2-3★ overlap) — 22 real hotels
  (flats/apartments/hostels excluded) split into 3 equal price-rank groups
  for budget/moderate/splurge instead of star-based bucketing, per that
  precedent. **The search pool also surfaced zero genuine 5★/luxury
  properties at all** — checked candidates individually on their own
  Booking.com pages instead, surfaced via Hotel Emiliano's own "similar
  properties" panel. **Hotel Emiliano itself — the pack's own recommended
  luxury stay — has genuinely NO Booking.com availability for the real
  event dates (4–11 Nov 2026)**, confirmed via its own hotel page (not a
  search-result miss); its price in this memory's earlier draft ($515–
  714/night) came from a 2-weeks-later proxy window and was NOT used in the
  final seeded range. Final luxury tier built from George V Casa Branca,
  Canopy By Hilton São Paulo Jardins, and The Westin São Paulo — all 3 with
  real, confirmed event-date availability. **Hotel Fasano São Paulo**
  ($2,117/night, "1 room left," genuine race-week scarcity pricing) was
  found and verified real but excluded from the seeded range per founder
  decision (too much of an outlier to represent the tier) — worth knowing
  about if Hotel Emiliano's own experience content or a future Luxury spoke
  update needs a real alternative-luxury-stay mention.
- **Ticket tier costs — COMPLETE, 12 Sep 2026.** All 4 tiers seeded to
  `planner_ticket_tier_cost` via `scripts/seed-brazilian-gp-ticket-tiers.mjs`:
  tier1 Grandstand A/G $177–283, tier2 Grandstand M/R $385–640, tier3
  Heineken Village $444–810, tier4 Orange Tree Club/F1 Paddock Experience
  $1,955–2,361. Prices founder-supplied and founder-verified directly — not
  independently cross-checked by Claude, per explicit founder instruction.
  Claude validated the official source URL only (`tickets.formula1.com/
  en/f1-3325-brazil` — HTTP 200, page title "F1® Brazil Tickets", confirmed
  the real Brazilian GP ticket page). **Found and fixed in the same pass:
  `sportingEvents.ticketingUrl` was wrong** (pointed to the general
  `formula1.com/en/racing/2026/brazil` race-info page, not the real tickets
  page) — corrected to the validated URL. **Also found and fixed: both
  CostSpoke.tsx and TicketsSpoke.tsx hardcoded a guessed, never-verified
  ticket URL slug (`f1-4890-brazil`, wrong)** — both now point to the real
  validated `f1-3325-brazil` slug. This was a real, live bug from this
  session's own initial build (the slug was guessed by pattern-matching
  other events' URLs rather than verified, contrary to the hub-and-spoke
  skill's own explicit warning that F1 ticket-site slugs are NOT
  predictable and must be verified per event) — worth remembering to
  actually verify a guessed slug immediately when writing it, not defer
  verification to a later pass.
- **Destination bands (local travel/food) — COMPLETE, 12 Sep 2026.** Seeded
  to `planner_destination_bands` via
  `scripts/seed-brazilian-gp-destination-bands.mjs`: local travel $5.97/day,
  food $25.00/day (Budget Your Trip "All travelers" blended figures — the
  only figures BYT publishes for these two categories). Sanity-checked
  against Mexico City ($47/$13) — lower but plausible, no
  Liverpool/Manchester-style implausible reversal, founder-approved as-is.
  Editorial notes written per the skill's fixed 2-sentence structure: local
  travel names Metrô Line 9 + the real, confirmed event-specific perk (F1
  Express/circular shuttle buses run free on Sunday race day per
  f1saopaulo.com.br's official page — the regular Line 9 fare still applies
  all 3 days, a real nuance not glossed over); food names "prato feito"
  (fixed daily lunch plate, ~R$39/US$7, per ANR/Agência Brasil pricing
  data) as the real named budget practice.
  
  **ALL 4 PLANNER COST CATEGORIES NOW SEEDED for Brazilian GP** — flights
  (49 markets), hotels (4 tiers), tickets (4 tiers), destination bands
  (local travel + food). Next real step: update the Cost and Tickets
  spokes' JSX to read this live data instead of their "not live yet"
  placeholder copy (see below).
- No real 2026 ticket-tier pricing published/verified yet (Tickets/Cost
  spokes state this explicitly).
- Luxury spoke's private-transit pricing and off-circuit VIP venues flagged
  as unresearched, left out rather than invented.
- **Venue map — DONE, 12 Sep 2026.** Real circuit map (`Images/Brazilian GP
  - Venue Map.png` — every grandstand letter A/B/D/G/H/M/N/R/S/V plus
  Heineken Village and Orange Tree Club marked) uploaded to R2
  (`sporting-events/hero/brazilian-grand-prix-map.png` via
  `scripts/upload-brazilian-gp-venue-map.mjs`) and wired into `MapSpoke.tsx`
  as the inline "Circuit map" section, replacing the old "coming soon"
  placeholder. The spoke's top-of-page hero banner intentionally stays on
  the Interlagos venue experience's own real hero photo (per founder
  instruction) — `spokeConfig.ts`'s `map` entry has no `imageOverride`, so
  `getSpokeImage()` naturally resolves it via the existing `imageSlug`
  match. Two distinct images, two distinct real purposes, not a
  duplicate.
- **Cost spoke duplicate hero image — fixed, 12 Sep 2026.** Cost and Map
  spokes both used `imageSlug: "interlagos-autodromo-jose-carlos-pace-venue-"`
  with no override on Cost, so both rendered the same hero photo — exactly
  the "several spokes sharing one image" bug class §3 warns about. Real,
  distinct image (`Images/Brazilian GP - Cost Spoke.jpg`, an aerial
  race-action shot) uploaded to R2
  (`sporting-events/hero/brazilian-grand-prix-cost-spoke.jpg` via
  `scripts/upload-brazilian-gp-cost-hero.mjs`) and set as `imageOverride`
  on the `cost` entry in `spokeConfig.ts`. Confirmed `CostSpoke.tsx`
  already used the correct `spoke.imageOverride ?? getSpokeImage(...)`
  pattern before this fix (not a bare `getSpokeImage()` call), so only the
  config needed the change.
- **TicketsSpoke.tsx fixes, 12 Sep 2026:** (1) P1 Travel link was another
  guessed/wrong URL (`p1travel.com/en/organizer/grand-prix-brazil`) —
  fixed to the founder-verified real URL
  (`p1travel.com/en/series/formula-1-2026?organizers=grand-prix-brasil`),
  confirmed HTTP 200 before wiring in. (2) Removed the Price column from
  the "Side by side" comparison table per founder request — real prices
  still shown elsewhere (unlocked verdict prose, "On pricing" section), so
  cleaned up the now-dead `priceLow`/`priceHigh` computed fields rather
  than leaving unused code, renamed `TIERS` back to `TIER_META` throughout
  since the price-augmented version was no longer needed. (3) Removed the
  "The full grandstand-by-grandstand comparison lives in the Venue Map
  guide" cross-reference sentence per founder request.
- **Ticket Guide card moved into the Pro-gated section + CTAs strengthened,
  12 Sep 2026 — applied to BOTH Brazilian GP and Mexico City GP
  TicketsSpoke.tsx per founder instruction ("do the same for Mexican GP").**
  The `SpokeExperienceCard` for the Ticket Guide experience (full
  grandstand-by-grandstand comparison) was sitting in the free section on
  both events — moved to the very start of the `isUnlocked` block, so the
  full comparison is now genuinely Pro-only content, not given away for
  free next to a teaser table. `ctaCopy` on both rewritten per §2h to name
  the specific real content now behind the gate (Brazilian GP: full tier
  comparison including G/R/H/D/B, M-vs-A verdict, buy-before-sellout
  timing; Mexico City GP: full comparison, Main Grandstand-vs-Foro Sol
  verdict, buying-window timing) rather than the prior generic "adds our
  actual verdict... not just a summary" filler on both.
- **Quick Reference "Address" Maps link — fixed, 12 Sep 2026.** Same known
  failure mode as United States GP (`HubPage.tsx`'s
  `VENUE_MAP_LINK_OVERRIDE` comment) — a text-search-built Google Maps URL
  from `venueName`+`venueAddress` doesn't always resolve to the correct
  pin. Founder supplied a real, verified Google Maps link
  (`maps.app.goo.gl/msfgaF4VXueyb4FX8`) for Interlagos; added to the same
  override table alongside US GP's entry.
- **Hotels spoke restructured, 12 Sep 2026 — real gap found: no verdict on
  neighborhood, no Airbnb/hostel opinion anywhere.** The old single "Which
  stay we'd pick" paragraph (Pro-gated) also still recommended Hotel
  Emiliano as "the right call" despite this session's own hotel-tier
  research confirming it has NO real availability for the actual event
  dates — a stale contradiction. Split into 4 distinct gated sections:
  "Which neighborhood we'd pick," "Which specific stay we'd pick" (now
  honestly flags Emiliano's sold-out status and names 2 real fallback
  5-stars — Hotel Fasano and Rosewood São Paulo, both verified real via
  search before naming), "Airbnb, hostels, and other budget formats" (new
  — previously zero coverage anywhere in the pack), "Booking windows &
  timing." `ctaCopy` rewritten to name this new gated content specifically.
  Founder then supplied 2 real Booking.com affiliate links for named
  hostels (Viva Hostel Design via tkqlhce.com, Reserva 69 via
  anrdoezrs.net, both in Vila Madalena) — verified genuine via
  `isRealAffiliateLink()`'s detection logic, added as real `<a>` links
  inside a bordered card (no seeded `experiences` row exists for either
  hostel, so these live as inline spoke-prose links, not `bookingLinks`
  entries — a different mechanism from Hotel Emiliano/Blue Tree/Ibis).
- **F1 Race Guide app added to First-Timer's Guide + Getting There, 12 Sep
  2026.** Founder asked to pull the F1 app from First-Timer's Guide into
  Getting There's "Essential apps" section — but Brazilian GP's
  First-Timer's Guide never actually named it (only Uber/99/Bilhete Único),
  unlike Mexico City GP's version, which does. Flagged to founder; added
  the F1 Race Guide app to BOTH spokes on founder decision, matching Mexico
  City GP's exact copy pattern (interactive circuit maps, real-time
  schedule alerts, geotagged grandstand/food/fan-zone points), adapted for
  Interlagos.
- **Grandstand M + Grandstand A cards converted to 2-column grid, 12 Sep
  2026.** Were stacked single-column in Brazilian GP's TicketsSpoke.tsx
  (separate `mb-6`/`mb-8` divs, no interleaved prose between them) —
  exactly the sibling failure mode the hub-and-spoke skill's mandatory
  grid rule warns about (2+ back-to-back `SpokeExperienceCard`s with no
  prose between them must share one `grid sm:grid-cols-2 gap-4` div, not
  separate stacked divs). Fixed in the isUnlocked section.
- 11/24 hero images still missing (batch scripts exist on disk, unrun —
  deferred to a later session per founder's call at the start of this
  session).
- §4c full pre-launch gate not yet run (packRank curator step, PDF build via
  `build-pro-pdf`, final SHORT_NAMES/pricing re-confirm) — correctly deferred
  until real cost/pricing data exists.

**Cost data tightening pass — COMPLETE, 12 Sep 2026, once all 4 planner
categories were seeded.** Two parts:
1. **CostSpoke.tsx and TicketsSpoke.tsx JSX updated** to actually render
   real seeded data instead of stale "not live yet"/"still finishing
   verified" placeholder copy — `TicketsSpoke.tsx` now shows a real Price
   column in its tier comparison table (pulled live from
   `getSpokeData()`'s `tickets` array) and wires real tier1-4 prices into
   the unlocked verdict prose. **Still blocked on the dev server's
   `unstable_cache` (1hr revalidate, no tag) showing stale empty-state
   pages until the server is restarted** — founder said they'll restart it
   themselves when convenient; verify the live render looks right once
   that happens, don't assume the code fix alone is sufficient.
2. **4 published ticket-related experiences tightened to match the real
   seeded `planner_ticket_tier_cost` figures**, per founder decision to
   treat the seeded tiers as ground truth over each experience's own
   pre-existing secondary-market estimate: Grandstand A (`costRange` →
   $177–283), Grandstand M (→ $385–640), Paddock Club & Champions Club (→
   Orange Tree Club/F1 Paddock Experience $1,955–2,361 — this experience's
   OWN prior body copy had a different, more granular hospitality
   breakdown, $1,956 confirmed + "$6,000-8,000+" for Paddock Club itself;
   the founder's decision was to make the seeded tier ground truth
   regardless, so `costRange` now reflects the seeded figure even though
   it doesn't fully reconcile with the body's own more detailed hospitality
   tier language — worth a closer look if that inconsistency is ever
   raised), Ticket Guide (→ all 4 tiers named with real prices, Heineken
   Village included in prose even though it's experience #25 and not yet
   seeded as its own row). Each experience's `website` field was also
   fixed from the general `formula1.com/en/racing/2026/brazil` page to the
   real, validated `tickets.formula1.com/en/f1-3325-brazil`. Script:
   `scripts/tighten-brazilian-gp-ticket-experiences.mjs`. **All 4 are
   `status: published`, so `sync-algolia.mjs` was re-run immediately after
   per the CLAUDE.md rule** — 382 experiences synced.
3. **7 more experiences with soft "roughly/expect/estimate" cost language
   (dining, tours, hotel budget-tier) were reviewed and deliberately left
   as-is** — founder decision: these are genuine restaurant/tour-operator
   prices not backed by any seeded planner table, so soft language is
   honest here, not sloppy. Includes Bar Brahma's "could not be confirmed
   to a single reliable number" cover-charge line, also left alone.

Next steps in order: (1)-(6) ~~flights/hotels/tickets/bands, spoke JSX +
experience cost tightening, affiliate links~~ ALL DONE, 12 Sep 2026 (dev
server restarted + full `.next/cache` cleared — `unstable_cache` persists
to disk, not just memory, so a process restart alone wasn't enough;
Cost/Tickets spokes now confirmed rendering real live numbers); (7) wire
Heineken Village into MapSpoke.tsx + EXPERIENCE_TO_SPOKE once seeded; (8)
finish remaining 11 hero images; (9) §4c pre-launch gate (now also covers a
25th experience's packRank).
