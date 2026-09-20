import { unstable_cache } from "next/cache";
import { getExperienceBySlug, type ExperienceDetail } from "@/lib/queries/experiences";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { experiences, savedItems, users, userProfiles, travelLogs, purchases, sportingEvents, sportingEventExperiences } from "@/schema/database";
import { and, eq, ne, inArray, count, sql } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import ExperienceViewGate from "./_components/ExperienceViewGate";
import { getPackPricing } from "@/lib/packPricing";
import SaveExperienceCTA from "./_components/SaveExperienceCTA";
import ExperienceTracker from "./_components/ExperienceTracker";
import ExperienceActionSidebar from "./_components/ExperienceActionSidebar";
import { isRealAffiliateLink } from "../../event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData";

// Hub-and-spoke "back to spoke" link — maps an experience's slug prefix to
// the spoke it's most at home in for a given event, per explicit curator
// sign-off (7 Aug 2026, restructured by-event 20 Sep 2026). Where an
// experience is referenced by more than one spoke within the SAME event
// (e.g. atp-finals-luxury-hotels- appears in both Hotels and Luxury), this
// picks its true home, not every spoke that happens to link to it.
//
// Rendering no longer gates on eventPackFormat === "hub_and_spoke" (fixed
// 16 Aug 2026) — that flag is derived from experiences.sportingEventId, a
// single direct FK to the experience's PRIMARY owning event, which doesn't
// see experiences shared into a second event via sporting_event_experiences
// (the real many-to-many join table). Eton and Windsor Castle's
// sportingEventId still points to BMW PGA Championship (packFormat:
// "classic") even though they're also linked into Wimbledon's Day Trips
// spoke — the old gate silently hid their otherwise-correct
// EXPERIENCE_TO_SPOKE_BY_EVENT entries. getSpokeBackLink() is a pure,
// static, slug-based lookup that already only returns non-null for
// experiences explicitly mapped to a real hub-and-spoke event/spoke, so
// checking its result directly is both sufficient and correct — no separate
// format check needed.
//
// The OPPOSITE case — an experience reached from its non-default event's
// pack, where the back-link/CTA should reflect that referring event instead
// of always the static table's default — is fixed as of 20 Sep 2026 via the
// page's ?from=<eventSlug> query param (see resolvedFromEventSlug in the
// page component and the referrer-validation query above it). Once
// resolvedFromEventSlug is set, it drives eventPackFormat/eventPackSlug/
// eventPackName/hasLivePack too, not just the spoke lookup — both surfaces
// (breadcrumb + sidebar CTA) must always agree on which event pack is being
// shown. See memory project_shared_experience_backlink_gap for full history.
// Nested by event (Record<eventSlug, Record<slugPrefix, entry>>) — restructured
// 20 Sep 2026 from a flat Record<slug, entry> as part of the shared-experience
// back-link fix (project_shared_experience_backlink_gap memory). A flat table
// could only ever point a shared experience (linked to more than one event via
// sporting_event_experiences) at ONE event, so a visitor reaching it from its
// non-default pack saw a back-link/CTA for the wrong event. getSpokeBackLink()
// now resolves per-event when a validated ?from=<eventSlug> referrer is present,
// falling back to a flat scan (first match across all events) to preserve the
// existing no-referrer default for direct links/search/saved items.
const EXPERIENCE_TO_SPOKE_BY_EVENT: Record<string, Record<string, { spokeId: string; spokeLabel: string }>> = {
  "abu-dhabi-grand-prix": {
    "main-grandstand-yas-marina-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "west-grandstand-yas-marina-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "abu-dhabi-hill-general-admission-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "f1-paddock-club-yas-marina-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "skybridge-terrace-w-abu-dhabi-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "yas-marina-yacht-charter-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "w-abu-dhabi-yas-island-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "atlantis-the-royal-dubai-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "park-regis-business-bay-dubai-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "ibis-deira-creekside-dubai-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "crowne-plaza-yas-island-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "beach-rotana-corniche-abu-dhabi-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "auh-vs-dxb-getting-there-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "getting-around-yas-island-race-day-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "garage-w-abu-dhabi-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "yas-marina-dining-walk-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "yasalam-after-parties-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "twilight-race-packing-guide-": { spokeId: "weather", spokeLabel: "Weather & What to Pack" },
    "first-timer-orientation-abu-dhabi-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "sheikh-zayed-mosque-qasr-al-watan-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "louvre-abu-dhabi-yas-theme-parks-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "burj-khalifa-dubai-day-trip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "dubai-mall-day-trip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "dubai-by-night-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "yas-marina-circuit-facilities-": { spokeId: "map", spokeLabel: "Venue Map" },
    "cheap-shawarma-abu-dhabi-dubai-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  },
  "atp-finals": {
    "atp-finals-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "atp-finals-luxury-hospitality-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "atp-finals-luxury-hotels-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "atp-finals-porta-nuova-neighborhood-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "atp-finals-airport-to-city-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "atp-finals-getting-to-inalpi-arena-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "atp-finals-aperitivo-vermouth-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "atp-finals-caffe-bicerin-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "atp-finals-gianduja-chocolate-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "atp-finals-piedmontese-dining-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "atp-finals-barolo-langhe-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "atp-finals-juventus-museum-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "atp-finals-practice-courts-": { spokeId: "map", spokeLabel: "Venue Map" },
    "atp-finals-inalpi-arena-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "atp-finals-mole-antonelliana-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "atp-finals-museo-egizio-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "atp-finals-royal-palace-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "atp-finals-piazza-san-carlo-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "atp-finals-turin-cathedral-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  },
  "shanghai-masters": {
    "qizhong-forest-sports-city-arena-": { spokeId: "map", spokeLabel: "Venue Map" },
    "getting-to-qizhong-shanghai-masters-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "where-to-stay-shanghai-masters-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "china-visa-apps-payments-guide-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "shanghai-masters-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "qizhong-center-court-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "the-bund-shanghai-dusk-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "yu-garden-old-city-shanghai-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "french-concession-tianzifang-shanghai-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "xiaolongbao-shanghai-guide-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "lujiazui-skyline-shanghai-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "hangzhou-west-lake-day-trip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "suzhou-classical-gardens-day-trip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "shanghai-masters-crowds-atmosphere-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "li-na-zheng-qinwen-generations-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "french-concession-dining-shanghai-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "shanghai-maglev-airport-question-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "luxury-shanghai-peninsula-bulgari-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "roger-friends-federer-exhibition-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
  },
  "las-vegas-grand-prix": {
    "las-vegas-gp-main-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "las-vegas-gp-turn3-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "las-vegas-gp-west-harmon-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "las-vegas-gp-flamingo-ga-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "las-vegas-gp-tmobile-sphere-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "las-vegas-gp-practice-qualifying-tickets-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "las-vegas-gp-paddock-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "las-vegas-gp-getting-around-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "las-vegas-gp-first-timer-orientation-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "las-vegas-gp-race-week-free-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "las-vegas-gp-sportsbook-watch-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "las-vegas-gp-trackside-hotels-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "las-vegas-gp-off-strip-hotels-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "las-vegas-gp-bellagio-caesars-dining-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "las-vegas-gp-fremont-downtown-dining-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "las-vegas-gp-fountains-sphere-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "las-vegas-gp-strip-at-night-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "las-vegas-gp-red-rock-canyon-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "las-vegas-gp-hoover-dam-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "las-vegas-gp-strip-casinos-": { spokeId: "map", spokeLabel: "Venue Map" },
  },
  "bahrain-grand-prix": {
    "main-grandstand-sepang-start-finish": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "k1-grandstand-sepang-turn-1": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "grandstand-f-sepang-panoramic": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "hill-stand-c2-sepang-general-admission": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "f1-paddock-club-sepang-hospitality": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "getting-to-sepang-circuit-klia": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "staying-in-kuala-lumpur-klcc-bukit-bintang": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "sama-sama-hotel-klia-sepang": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "jalan-alor-night-food-street-kl": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "old-china-cafe-heritage-nyonya-chinatown": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "petronas-twin-towers-kl-skybridge": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "malaysia-f1-fans-nostalgia-2026-return": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "sepang-circuit-history-f1-return": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "batu-caves-kuala-lumpur-hindu-shrine": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "genting-highlands-day-trip-cool-climate": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "putrajaya-day-trip-pink-mosque-capital": { spokeId: "day-trips", spokeLabel: "Day Trips" },
  },
  "singapore-grand-prix": {
    "singapore-gp-turn1-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "singapore-gp-stamford-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "singapore-gp-padang-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "singapore-gp-zone4-walkabout-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "singapore-gp-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "singapore-gp-paddock-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "singapore-gp-getting-around-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "singapore-gp-trackside-hotels-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "singapore-gp-clarke-quay-stay-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "singapore-gp-chinatown-stay-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "singapore-gp-lau-pa-sat-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "singapore-gp-maxwell-food-centre-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "singapore-gp-bayfront-hawkers-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "singapore-gp-sentosa-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "singapore-gp-gardens-by-the-bay-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "singapore-gp-waterfront-walk-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "singapore-gp-first-timer-orientation-": { spokeId: "arrival", spokeLabel: "Arrival & Gate Guide" },
    "singapore-gp-f1-village-": { spokeId: "arrival", spokeLabel: "Arrival & Gate Guide" },
    "singapore-gp-padang-stage-concerts-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  },
  "wimbledon": {
  // Wimbledon — added 14 Aug 2026 for the classic-to-hub-and-spoke
  // conversion. True-home spoke matches where each experience's
  // SpokeExperienceCard actually renders (see spokes/wimbledon/*.tsx) —
  // "wimbledon-cannizaro-house-" appears in both Hotels and Luxury, so its
  // true home here is Hotels, matching the ATP Finals precedent for a
  // dual-appearing experience.
    "wimbledon-centre-court-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "the-hill-wimbledon-": { spokeId: "map", spokeLabel: "Venue Map" },
    "wimbledon-eating-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "wimbledon-no1-court-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "wimbledon-museum-private-tour-": { spokeId: "map", spokeLabel: "Venue Map" },
    "wimbledon-practice-courts-": { spokeId: "map", spokeLabel: "Venue Map" },
    "wimbledon-the-lawn-hospitality-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "the-wimbledon-queue-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "dinner-at-the-crooked-billet-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "traveling-to-the-all-england-club-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "wimbledon-when-it-rains-": { spokeId: "weather", spokeLabel: "Weather & What to Pack" },
    "dinner-at-the-black-lamb-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "wimbledon-outer-courts-": { spokeId: "map", spokeLabel: "Venue Map" },
    "preparing-for-your-wimbledon-visit-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "sw19-during-the-fortnight-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "london-rest-day-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brixton-village-market-row-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "wimbledon-cannizaro-house-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "wimbledon-rose-crown-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "park-plaza-county-hall-london-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "nox-waterloo-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "eton-across-river-windsor-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "windsor-castle-long-walk-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
  },
  "new-zealand-in-australia-cricket-2026-27": {
  // New Zealand tour of Australia 2026-27 — mapping locked with the curator
  // before seeding (see project_nz_in_australia_experiences memory).
    "perth-stadium-series-opener-": { spokeId: "map", spokeLabel: "Venue Map" },
    "adelaide-oval-most-beautiful-ground-": { spokeId: "map", spokeLabel: "Venue Map" },
    "mcg-boxing-day-test-": { spokeId: "map", spokeLabel: "Venue Map" },
    "scg-fourth-test-sydney-summer-": { spokeId: "map", spokeLabel: "Venue Map" },
    "nz-australia-series-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "mcg-boxing-day-seating-comparison-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "adelaide-oval-hill-vs-reserve-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "mcg-corporate-boxes-boxing-day-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "adelaide-oval-stadium-club-deck-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "scg-luxury-invincibles-lounge-members-pavilion-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "where-to-stay-perth-first-test-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "where-to-stay-adelaide-city-vs-north-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "where-to-stay-sydney-fourth-test-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "fremantle-day-trip-from-perth-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mclaren-vale-adelaide-wine-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "blue-mountains-day-trip-from-sydney-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "sydney-harbour-beaches-city-day-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "wildlife-down-under-featherdale-phillip-island-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "beige-brigade-nz-traveling-support-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "where-nz-fans-actually-eat-city-guide-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "getting-between-four-cities-flights-not-trains-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    // Added 20 Sep 2026 as part of the shared-experience back-link fix
    // (project_shared_experience_backlink_gap). These 4 are genuinely
    // reused from Australian Open 2027 and actually render in this event's
    // DayTripsSpoke.tsx/HotelsSpoke.tsx (confirmed by reading those files),
    // matching their real sporting_event_experiences join rows to this
    // event — previously this event had NO entries for them here at all,
    // so a ?from=new-zealand-in-australia-cricket-2026-27 referrer fell
    // through to the flat scan and still resolved to Australian Open.
    // where-to-stay-melbourne-boxing-day- already has its OWN top-level
    // entry under "australian-open" above (the curator's explicit no-
    // referrer default) — this is a second, event-scoped entry for the
    // SAME experience slug, which the nested-by-event structure supports.
    "melbourne-laneways-coffee-city-day-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "great-ocean-road-twelve-apostles-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "yarra-valley-melbourne-wine-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "where-to-stay-melbourne-boxing-day-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
  },
  "australian-open": {
  // Tactically pointed at AO2027's hotels spoke instead of the cricket pack,
  // 26 Aug 2026 — the founder's explicit call for this one shared experience
  // for now. Object.entries().find() only returns the first prefix match,
  // so a reader reaching this experience via the CRICKET pack's Hotels spoke
  // will now see a "← Back to Where to Stay" link that goes to AO2027's
  // spoke instead of its own — the same one-directional collision documented
  // in project_shared_experience_backlink_gap, just flipped which event loses
  // its correct backlink. Still not a real fix; the ?from=eventSlug design
  // is the real fix, tracked in Ops Checklist P1 T3 #4.
    "where-to-stay-melbourne-boxing-day-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
  // Australian Open 2027 — added 24 Aug 2026. Only the 16 experiences
  // unique to this event get an entry here — 4 Melbourne experiences are
  // reused from the NZ-in-Australia cricket pack and can only show ONE
  // "← Back to" link today (Object.entries().find() only returns the first
  // match — the exact documented gap in project_shared_experience_backlink_gap
  // memory, Ops Checklist P1 T3 #4). where-to-stay-melbourne-boxing-day- was
  // flipped to AO2027 on creation (see its entry above). The remaining 3
  // (great-ocean-road-twelve-apostles-daytrip-, yarra-valley-melbourne-wine-
  // daytrip-, melbourne-laneways-coffee-city-day-) were flipped to AO2027 on
  // 26 Aug 2026 per founder request — the cricket pack now loses its back-link
  // on these 3 until the real ?from=eventSlug + nested-lookup fix is built.
    "great-ocean-road-twelve-apostles-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "yarra-valley-melbourne-wine-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "melbourne-laneways-coffee-city-day-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "rod-laver-arena-inside-main-court-": { spokeId: "map", spokeLabel: "Venue Map" },
    "margaret-court-john-cain-arenas-": { spokeId: "map", spokeLabel: "Venue Map" },
    "outside-courts-grounds-pass-strategy-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "practice-week-national-tennis-centre-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "grand-slam-oval-food-village-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "ao-ticket-guide-grounds-session-finals-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "rod-laver-arena-seating-comparison-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "corporate-hospitality-premium-suites-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "getting-to-melbourne-park-transit-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "melbourne-january-heat-what-to-pack-": { spokeId: "weather", spokeLabel: "Weather & What to Pack" },
    "first-timers-guide-etiquette-crowd-culture-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "federation-square-cbd-laneways-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "st-kilda-beaches-melbourne-park-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "melbourne-coffee-food-culture-guide-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "late-night-melbourne-park-midnight-finishes-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "grand-slam-oval-party-live-music-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  },
  "french-open": {
  // French Open 2027 — spoke mapping locked with founder 4 Sep 2026.
    "court-philippe-chatrier-suzanne-lenglen": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "roland-garros-grounds-pass-tickets": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "roland-garros-night-sessions": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "roland-garros-official-hospitality": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "hotel-molitor-paris-luxury-stay": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "french-open-luxury-dining-bois-de-boulogne": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "ibis-boulogne-billancourt-midrange-stay": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "boulogne-billancourt-short-let-budget-stay": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "roland-garros-travel-official-packages": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "roland-garros-practice-courts-outside-courts": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "roland-garros-stadium-tour-tenniseum": { spokeId: "map", spokeLabel: "Venue Map" },
    "what-to-eat-inside-roland-garros": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "everyday-parisian-eating-baguette-jambon-beurre": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "versailles-day-trip": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "village-dauteuil-neighborhood": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "montmartre-neighborhood": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "paris-icons-eiffel-tower-seine-arc-de-triomphe": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "paris-landmarks-louvre-notre-dame": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "moulin-rouge-show": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "caveau-de-la-huchette-jazz": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
  },
  "united-states-grand-prix": {
  // United States Grand Prix 2026 — added 5 Sep 2026, matches the agreed
  // spoke-mapping table exactly (see project_us_gp_2026_experiences memory).
    "us-gp-main-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "us-gp-turn-1-big-red-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "us-gp-turn-15-stadium-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "us-gp-general-admission-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "us-gp-paddock-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "us-gp-champions-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "us-gp-where-to-stay-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "us-gp-getting-to-cota-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "us-gp-weather-what-to-pack-": { spokeId: "weather", spokeLabel: "Weather & What to Pack" },
    "us-gp-first-timer-guide-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "us-gp-franklin-barbecue-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "us-gp-bbq-beyond-franklin-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "us-gp-super-stage-concerts-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-south-congress-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-sixth-rainey-street-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-lady-bird-lake-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-zilker-barton-springs-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-hill-country-fredericksburg-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-san-antonio-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "us-gp-austin-live-music-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
  },
  "mexico-city-grand-prix": {
    "foro-sol-mexico-city-gp-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "mexico-city-gp-where-to-sit-": { spokeId: "map", spokeLabel: "Venue Map" },
    "mexico-city-gp-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "mexico-city-gp-paddock-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "mexico-city-gp-fan-zone-": { spokeId: "map", spokeLabel: "Venue Map" },
    "autodromo-hermanos-rodriguez-venue-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "mexico-city-gp-getting-there-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "mexico-city-gp-arrival-queue-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "mexico-city-where-to-stay-roma-norte-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "mexico-city-where-to-stay-condesa-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "mexico-city-where-to-stay-polanco-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "mexico-city-tacos-al-pastor-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "mexico-city-pujol-contramar-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "mexico-city-mercado-roma-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "mexico-city-zocalo-cathedral-templo-mayor-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mexico-city-chapultepec-anthropology-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mexico-city-frida-kahlo-museum-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mexico-city-teotihuacan-day-trip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mexico-city-xochimilco-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mexico-city-dia-de-muertos-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "mexico-city-weather-packing-": { spokeId: "weather", spokeLabel: "Weather & What to Pack" },
  },
  "brazilian-grand-prix": {
    "brazilian-gp-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "brazilian-gp-grandstand-a-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "brazilian-gp-grandstand-m-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "brazilian-gp-hotel-emiliano-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "brazilian-gp-budget-hotels-morumbi-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "brazilian-gp-jardins-itaim-neighborhoods-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "brazilian-gp-getting-to-interlagos-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "brazilian-gp-weather-packing-": { spokeId: "weather", spokeLabel: "Weather & What to Pack" },
    "brazilian-gp-first-timer-guide-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "interlagos-autodromo-jose-carlos-pace-venue-": { spokeId: "map", spokeLabel: "Venue Map" },
    "brazilian-gp-figueira-rubaiyat-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "brazilian-gp-mani-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "brazilian-gp-liberdade-japanese-dining-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "brazilian-gp-vila-madalena-food-crawl-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "brazilian-gp-ibirapuera-park-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-paulista-masp-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-beco-do-batman-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-feira-da-liberdade-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-sao-roque-wine-route-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-santos-guaruja-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-campos-do-jordao-daytrip-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "brazilian-gp-bar-brahma-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "brazilian-gp-arrival-queue-guide-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "brazilian-gp-hospitality-paddock-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "brazilian-gp-heineken-village-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
  },
  "qatar-grand-prix": {
    "qatar-gp-ticket-guide-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "qatar-gp-main-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "qatar-gp-north-grandstand-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "qatar-gp-lusail-hill-general-admission-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "qatar-gp-lusail-hill-lounge-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "qatar-gp-paddock-champions-club-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "qatar-gp-west-bay-hotel-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "qatar-gp-pearl-hotel-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "qatar-gp-lusail-marina-hotels-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "qatar-gp-staybridge-suites-lusail-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "qatar-gp-getting-there-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "qatar-gp-inside-lusail-circuit-": { spokeId: "map", spokeLabel: "Venue Map" },
    "qatar-gp-fan-zone-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "qatar-gp-khor-al-adaid-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "qatar-gp-museum-islamic-art-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "qatar-gp-national-museum-qatar-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "qatar-gp-souq-waqif-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "qatar-gp-pearl-katara-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "qatar-gp-doha-fan-city-tour-": { spokeId: "itinerary", spokeLabel: "Trip Schedule" },
    "qatar-gp-parisa-atmosphere-dining-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "qatar-gp-qatari-cuisine-souq-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "qatar-gp-sawa-by-sanad-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  },
  "italian-grand-prix": {
    "italian-gp-grandstand-1-centrale-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "italian-gp-grandstand-5-piscina-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "italian-gp-ga-lesmo-ascari-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "grandstand-22-parabolica-corner-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "grandstand-26-pit-lane-grid-podium-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "curva-grande-general-admission-": { spokeId: "tickets", spokeLabel: "Ticket Guide" },
    "paddock-club-champions-club-hospitality-": { spokeId: "luxury", spokeLabel: "Luxury Guide" },
    "monza-inside-the-venue-": { spokeId: "map", spokeLabel: "Venue Map" },
    "history-of-monza-walking-old-banking-": { spokeId: "map", spokeLabel: "Venue Map" },
    "italian-gp-first-timer-guide-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "the-tifosi-ferraris-red-army-": { spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
    "italian-gp-arrival-queue-guide-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "the-fan-zone-ascari-to-parabolica-": { spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
    "getting-to-the-circuit-monza-": { spokeId: "getting-there", spokeLabel: "Getting There" },
    "hotel-de-la-ville-monza-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "staying-in-milan-city-base-strategy-": { spokeId: "hotels", spokeLabel: "Where to Stay" },
    "eating-in-milan-serious-italians-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "eating-in-monza-risotto-luganega-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "aperitivo-before-the-race-milan-ritual-": { spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
    "monza-town-royal-villa-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "alfa-romeo-museum-arese-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
    "lake-como-race-weekend-from-the-lake-": { spokeId: "day-trips", spokeLabel: "Day Trips" },
  },
};

// fromEventSlug should already be validated against sporting_event_experiences
// by the caller (getExperienceData) before being passed in here — this function
// trusts it blindly. When present and it has a matching entry, resolution is
// scoped to that event only. Otherwise falls back to a flat scan across every
// event's table (first slug-prefix match wins) — the original, unscoped
// behavior, preserved as the no-referrer default.
function getSpokeBackLink(slug: string, fromEventSlug?: string | null) {
  if (fromEventSlug) {
    const eventTable = EXPERIENCE_TO_SPOKE_BY_EVENT[fromEventSlug];
    if (eventTable) {
      const prefix = Object.keys(eventTable).find((p) => slug.startsWith(p));
      if (prefix) return { eventSlug: fromEventSlug, ...eventTable[prefix] };
    }
  }
  for (const [eventSlug, eventTable] of Object.entries(EXPERIENCE_TO_SPOKE_BY_EVENT)) {
    const prefix = Object.keys(eventTable).find((p) => slug.startsWith(p));
    if (prefix) return { eventSlug, ...eventTable[prefix] };
  }
  return null;
}

// Multi-venue experiences (a hotel comparison, a restaurant roundup) never
// get a single top-line googleMapsRating — see experience-researcher skill
// §2c. Instead the badge-row rating slot becomes a jump-link down to a
// #ratings anchor in bodyContent, where each named venue's real rating is
// written inline. venueCount is display-only ("all 3 hotels").
const MULTI_VENUE_RATINGS: Record<string, { venueCount: number; venueNoun: string }> = {
  "brazilian-gp-jardins-itaim-neighborhoods-": { venueCount: 5, venueNoun: "restaurants" },
  "brazilian-gp-budget-hotels-morumbi-": { venueCount: 2, venueNoun: "hotels" },
  "brazilian-gp-vila-madalena-food-crawl-": { venueCount: 2, venueNoun: "bars" },
  "brazilian-gp-liberdade-japanese-dining-": { venueCount: 2, venueNoun: "ramen shops" },
  "brazilian-gp-sao-roque-wine-route-": { venueCount: 4, venueNoun: "wineries" },
  "brazilian-gp-santos-guaruja-daytrip-": { venueCount: 2, venueNoun: "attractions" },
  "brazilian-gp-campos-do-jordao-daytrip-": { venueCount: 2, venueNoun: "attractions" },
  "us-gp-lady-bird-lake-": { venueCount: 3, venueNoun: "rental operators" },
  "us-gp-san-antonio-daytrip-": { venueCount: 2, venueNoun: "sites" },
  "french-open-luxury-dining-bois-de-boulogne": { venueCount: 3, venueNoun: "restaurants" },
  "paris-icons-eiffel-tower-seine-arc-de-triomphe": { venueCount: 3, venueNoun: "landmarks" },
  "staying-in-milan-city-base-strategy-": { venueCount: 3, venueNoun: "hotels" },
  "eating-in-milan-serious-italians-": { venueCount: 2, venueNoun: "restaurants" },
  "aperitivo-before-the-race-milan-ritual-": { venueCount: 3, venueNoun: "bars" },
  "eating-in-monza-risotto-luganega-": { venueCount: 4, venueNoun: "restaurants" },
  "monza-town-royal-villa-": { venueCount: 4, venueNoun: "sights" },
  "lake-como-race-weekend-from-the-lake-": { venueCount: 3, venueNoun: "hotels" },
  "paris-landmarks-louvre-notre-dame": { venueCount: 2, venueNoun: "landmarks" },
  "where-to-stay-perth-first-test-": { venueCount: 2, venueNoun: "hotels" },
  "where-to-stay-adelaide-city-vs-north-": { venueCount: 2, venueNoun: "hotels" },
  "where-to-stay-melbourne-boxing-day-": { venueCount: 4, venueNoun: "stay options" },
  "qatar-gp-lusail-marina-hotels-": { venueCount: 2, venueNoun: "hotels" },
  "qatar-gp-qatari-cuisine-souq-": { venueCount: 2, venueNoun: "restaurants" },
  "qatar-gp-pearl-katara-": { venueCount: 2, venueNoun: "districts" },
  "where-to-stay-sydney-fourth-test-": { venueCount: 2, venueNoun: "hotels" },
  "fremantle-day-trip-from-perth-": { venueCount: 3, venueNoun: "places" },
  "mclaren-vale-adelaide-wine-daytrip-": { venueCount: 3, venueNoun: "places" },
  "yarra-valley-melbourne-wine-daytrip-": { venueCount: 2, venueNoun: "wineries" },
  "blue-mountains-day-trip-from-sydney-": { venueCount: 2, venueNoun: "places" },
  "melbourne-laneways-coffee-city-day-": { venueCount: 3, venueNoun: "places" },
  "sydney-harbour-beaches-city-day-": { venueCount: 3, venueNoun: "places" },
  "atp-finals-luxury-hotels-": { venueCount: 3, venueNoun: "hotels" },
  "atp-finals-piedmontese-dining-": { venueCount: 3, venueNoun: "restaurants" },
  "atp-finals-gianduja-chocolate-": { venueCount: 2, venueNoun: "places" },
  "atp-finals-porta-nuova-neighborhood-": { venueCount: 2, venueNoun: "hotels" },
  "atp-finals-aperitivo-vermouth-": { venueCount: 2, venueNoun: "cafés" },
  "atp-finals-barolo-langhe-daytrip-": { venueCount: 4, venueNoun: "wineries" },
  "staying-in-kuala-lumpur-klcc-bukit-bintang": { venueCount: 4, venueNoun: "hotels" },
  "singapore-gp-trackside-hotels-": { venueCount: 3, venueNoun: "hotels" },
  "las-vegas-gp-trackside-hotels-": { venueCount: 3, venueNoun: "hotels" },
  "las-vegas-gp-off-strip-hotels-": { venueCount: 2, venueNoun: "hotels" },
  "yas-marina-dining-walk-": { venueCount: 3, venueNoun: "restaurants" },
  "sheikh-zayed-mosque-qasr-al-watan-": { venueCount: 2, venueNoun: "venues" },
  "louvre-abu-dhabi-yas-theme-parks-": { venueCount: 3, venueNoun: "attractions" },
  "cheap-shawarma-abu-dhabi-dubai-": { venueCount: 3, venueNoun: "restaurants" },
  "las-vegas-gp-bellagio-caesars-dining-": { venueCount: 2, venueNoun: "restaurants" },
  "las-vegas-gp-fremont-downtown-dining-": { venueCount: 2, venueNoun: "restaurants" },
  "las-vegas-gp-fountains-sphere-": { venueCount: 2, venueNoun: "landmarks" },
  "las-vegas-gp-strip-casinos-": { venueCount: 3, venueNoun: "casino resorts" },
  "xiaolongbao-shanghai-guide-": { venueCount: 2, venueNoun: "restaurants" },
  "french-concession-dining-shanghai-": { venueCount: 3, venueNoun: "restaurants" },
  "singapore-gp-chinatown-stay-": { venueCount: 2, venueNoun: "hotels" },
  "singapore-gp-clarke-quay-stay-": { venueCount: 2, venueNoun: "hotels" },
  "singapore-gp-bayfront-hawkers-": { venueCount: 2, venueNoun: "hawker spots" },
  "luxury-shanghai-peninsula-bulgari-": { venueCount: 3, venueNoun: "hotels" },
  "where-to-stay-shanghai-masters-": { venueCount: 3, venueNoun: "hotels" },
  "lujiazui-skyline-shanghai-": { venueCount: 3, venueNoun: "towers" },
  "sw19-during-the-fortnight-": { venueCount: 3, venueNoun: "pubs" },
  "brixton-village-market-row-": { venueCount: 3, venueNoun: "vendors" },
  "london-rest-day-": { venueCount: 3, venueNoun: "landmarks" },
  "where-nz-fans-actually-eat-city-guide-": { venueCount: 6, venueNoun: "places" },
  "wildlife-down-under-featherdale-phillip-island-": { venueCount: 2, venueNoun: "places" },
  // Australian Open 2027 — added 25 Aug 2026. yarra-valley-melbourne-wine-
  // daytrip- and where-to-stay-melbourne-boxing-day- already had entries
  // above (shared with the NZ-Australia pack, counts unchanged).
  "great-ocean-road-twelve-apostles-daytrip-": { venueCount: 2, venueNoun: "landmarks" },
  "federation-square-cbd-laneways-": { venueCount: 4, venueNoun: "landmarks" },
  "st-kilda-beaches-melbourne-park-": { venueCount: 2, venueNoun: "places" },
  "melbourne-coffee-food-culture-guide-": { venueCount: 3, venueNoun: "cafés" },
  "margaret-court-john-cain-arenas-": { venueCount: 2, venueNoun: "arenas" },
  "grand-slam-oval-food-village-": { venueCount: 3, venueNoun: "restaurants" },
  // United States GP 2026 — added 5 Sep 2026
  "us-gp-where-to-stay-": { venueCount: 3, venueNoun: "hotels" },
  "us-gp-bbq-beyond-franklin-": { venueCount: 3, venueNoun: "restaurants" },
  "us-gp-south-congress-": { venueCount: 2, venueNoun: "landmarks" },
  "us-gp-sixth-rainey-street-": { venueCount: 2, venueNoun: "bars" },
  "us-gp-hill-country-fredericksburg-": { venueCount: 2, venueNoun: "wineries" },
  "us-gp-austin-live-music-": { venueCount: 2, venueNoun: "venues" },
  // Mexico City Grand Prix 2026 — added 6 Sep 2026
  "mexico-city-where-to-stay-roma-norte-": { venueCount: 2, venueNoun: "hotels" },
  "mexico-city-where-to-stay-condesa-": { venueCount: 2, venueNoun: "hotels" },
  "mexico-city-where-to-stay-polanco-": { venueCount: 2, venueNoun: "hotels" },
  "mexico-city-tacos-al-pastor-": { venueCount: 3, venueNoun: "taquerias" },
  "mexico-city-pujol-contramar-": { venueCount: 2, venueNoun: "restaurants" },
  "mexico-city-zocalo-cathedral-templo-mayor-": { venueCount: 3, venueNoun: "sites" },
  "mexico-city-chapultepec-anthropology-": { venueCount: 2, venueNoun: "places" },
  // French Open 2027 — added 7 Sep 2026
  "everyday-parisian-eating-baguette-jambon-beurre": { venueCount: 2, venueNoun: "boulangeries" },
  "village-dauteuil-neighborhood": { venueCount: 2, venueNoun: "hotels" },
  "montmartre-neighborhood": { venueCount: 2, venueNoun: "landmarks" },
};

function getMultiVenueRatings(slug: string) {
  const entry = Object.entries(MULTI_VENUE_RATINGS).find(([prefix]) => slug.startsWith(prefix));
  return entry ? entry[1] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.experiences-curated.com";
  try {
    const exp = await getExperienceBySlug(slug);
    const description = exp.subtitle ?? exp.whyItsSpecial?.slice(0, 160) ?? "";
    const images = exp.heroImageUrl
      ? [{ url: exp.heroImageUrl, width: 1200, height: 630, alt: exp.heroImageAlt ?? exp.title }]
      : [];
    return {
      title: exp.title,
      description,
      alternates: {
        canonical: `${base}/experience/${exp.slug}`,
      },
      openGraph: {
        title: exp.title,
        description,
        url: `${base}/experience/${exp.slug}`,
        type: "article",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: exp.title,
        description,
        images: exp.heroImageUrl ? [exp.heroImageUrl] : [],
      },
    };
  } catch {
    return { title: "Experience not found" };
  }
}

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity",
  dining: "Dining",
  accommodation: "Stay",
  cultural_site: "Cultural Site",
  natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood",
  day_trip: "Day Trip",
  multi_day: "Multi-day",
  sports_venue: "Sports Venue",
  fan_experience: "Fan Experience",
  transit: "Transit",
  event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};

const PACE_LABELS: Record<string, string> = {
  slow: "Slow",
  moderate: "Moderate",
  active: "Active",
  intense: "Intense",
};

const MONTH_LABELS: Record<string, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr",
  may: "May", jun: "Jun", jul: "Jul", aug: "Aug",
  sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

// Real word count from the two actual prose fields (bodyContent +
// whyItsSpecial), not an estimate — 200 wpm is the standard adult
// silent-reading baseline most reading-time tools use. Added per beta
// feedback 4 Aug 2026.
function estimateReadingTime(bodyContent: string | null, whyItsSpecial: string | null): number {
  const words = `${bodyContent ?? ""} ${whyItsSpecial ?? ""}`.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function ExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from: fromEventSlug } = await searchParams;

  // Cache experience content, ratings, and related for 1 hour — only auth runs per-request
  const getExperienceData = unstable_cache(
    async (s: string) => {
      const exp = await getExperienceBySlug(s);

      const [ratingRow] = await db
        .select({
          avgRating: sql<number>`round(avg(${travelLogs.rating})::numeric, 1)`,
          ratingCount: count(travelLogs.id),
        })
        .from(travelLogs)
        .where(eq(travelLogs.experienceId, exp.id));

      let eventPackSlug = "wimbledon";
      let eventPackName = "Wimbledon";
      let eventPackFormat: string | null = null;
      let hasLivePack = false;
      // The breadcrumb's "← Back to <spoke>" link and the sidebar's "Get the
      // full guide" CTA must always agree — they're both "which event pack
      // does this experience belong to," just two different UI surfaces for
      // the same fact. getSpokeBackLink() (EXPERIENCE_TO_SPOKE_BY_EVENT) is
      // the real source of truth for that whenever an entry exists — it's
      // curator-confirmed per-experience, unlike exp.sportingEventId, which
      // is only the PRIMARY owning event and can disagree for an experience
      // shared into a second event via sporting_event_experiences (see the
      // shared-experience comment block above EXPERIENCE_TO_SPOKE_BY_EVENT).
      // Caught live 19 Sep 2026: Eton/Windsor's sportingEventId points to BMW
      // PGA Championship, but EXPERIENCE_TO_SPOKE correctly maps them to
      // Wimbledon's Day Trips spoke — the sidebar was showing BMW PGA while
      // the breadcrumb correctly showed Wimbledon. Only fall back to
      // sportingEventId when no EXPERIENCE_TO_SPOKE_BY_EVENT entry exists
      // (the common case — most experiences aren't shared). This resolution
      // is deliberately still unaware of any ?from= referrer — that value is
      // per-request and can't live inside this unstable_cache'd function
      // (see resolveReferrerEventPack below, applied to this result after
      // the cache read).
      const spokeBackLinkForEventPack = getSpokeBackLink(s);
      const eventPackLookupSlug = spokeBackLinkForEventPack?.eventSlug;
      if (eventPackLookupSlug) {
        const [ev] = await db
          .select({
            slug: sportingEvents.slug,
            name: sportingEvents.name,
            packFormat: sportingEvents.packFormat,
            packStatus: sportingEvents.packStatus,
            isHidden: sportingEvents.isHidden,
          })
          .from(sportingEvents)
          .where(eq(sportingEvents.slug, eventPackLookupSlug))
          .limit(1);
        if (ev) {
          eventPackSlug = ev.slug;
          eventPackName = ev.name;
          eventPackFormat = ev.packFormat;
          hasLivePack = (ev.packStatus === "live" || ev.packStatus === "built_hidden") && ev.isHidden === false;
        }
      } else if (exp.sportingEventId) {
        const [ev] = await db
          .select({
            slug: sportingEvents.slug,
            name: sportingEvents.name,
            packFormat: sportingEvents.packFormat,
            packStatus: sportingEvents.packStatus,
            isHidden: sportingEvents.isHidden,
          })
          .from(sportingEvents)
          .where(eq(sportingEvents.id, exp.sportingEventId))
          .limit(1);
        if (ev) {
          eventPackSlug = ev.slug;
          eventPackName = ev.name;
          eventPackFormat = ev.packFormat;
          // Live-pack determination mirrors the blog article page's identical
          // logic — reachability, not purchase status.
          hasLivePack = (ev.packStatus === "live" || ev.packStatus === "built_hidden") && ev.isHidden === false;
        }
      }

      const related = await db
        .select({
          id: experiences.id,
          title: experiences.title,
          slug: experiences.slug,
          heroImageUrl: experiences.heroImageUrl,
          experienceType: experiences.experienceType,
          subtitle: experiences.subtitle,
          neighborhood: experiences.neighborhood,
        })
        .from(experiences)
        .where(
          and(
            inArray(experiences.status, ["published", "in_review"]),
            ne(experiences.slug, s),
            exp.sportingEventId
              ? eq(experiences.sportingEventId, exp.sportingEventId)
              : eq(experiences.destinationId, exp.destinationId)
          )
        )
        .limit(3);

      return { exp, ratingRow, eventPackSlug, eventPackName, eventPackFormat, hasLivePack, related };
    },
    ["experience-page"],
    { revalidate: 3600 }
  );

  const cached = await getExperienceData(slug);
  const { exp, ratingRow, related } = cached;
  let { eventPackSlug, eventPackName, eventPackFormat, hasLivePack } = cached;

  // Resolve the referring event pack for a shared experience — per-request,
  // so it can't live inside getExperienceData's unstable_cache. Only trust
  // fromEventSlug once it's confirmed against the real sporting_event_experiences
  // join table (never take an unvalidated query param at face value); on any
  // miss (bad slug, stale link, or an event/experience pair never actually
  // linked) silently keep the cached default resolved above. See
  // project_shared_experience_backlink_gap memory — this is the "?from=" fix.
  let resolvedFromEventSlug: string | null = null;
  let suppressSpokeBackLink = false;
  if (fromEventSlug) {
    const [linkedEvent] = await db
      .select({
        slug: sportingEvents.slug,
        name: sportingEvents.name,
        packFormat: sportingEvents.packFormat,
        packStatus: sportingEvents.packStatus,
        isHidden: sportingEvents.isHidden,
      })
      .from(sportingEventExperiences)
      .innerJoin(sportingEvents, eq(sportingEventExperiences.sportingEventId, sportingEvents.id))
      .where(
        and(
          eq(sportingEventExperiences.experienceId, exp.id),
          eq(sportingEvents.slug, fromEventSlug)
        )
      )
      .limit(1);
    if (linkedEvent) {
      eventPackSlug = linkedEvent.slug;
      eventPackName = linkedEvent.name;
      eventPackFormat = linkedEvent.packFormat;
      hasLivePack = (linkedEvent.packStatus === "live" || linkedEvent.packStatus === "built_hidden") && linkedEvent.isHidden === false;
      // Only feed the referrer into getSpokeBackLink when it's a hub-and-
      // spoke event — a classic pack (e.g. BMW PGA Championship) has no
      // spokes, so there's nothing to link back to. Leaving
      // resolvedFromEventSlug null here means getSpokeBackLink falls through
      // to its flat, all-events scan, which would incorrectly resurface
      // Eton/Windsor's Wimbledon spoke entry for a visitor who actually came
      // from BMW PGA's classic pack. The breadcrumb is hidden instead
      // (see spokeLink render check) rather than showing a spoke link for a
      // pack format that doesn't have spokes.
      if (linkedEvent.packFormat === "hub_and_spoke") {
        resolvedFromEventSlug = linkedEvent.slug;
      } else {
        suppressSpokeBackLink = true;
      }
    }
  }

  const avgRating = ratingRow?.avgRating ?? null;
  const ratingCount = ratingRow?.ratingCount ?? 0;
  const multiVenueRatings = getMultiVenueRatings(exp.slug);

  const practical = exp.practicalInfo as {
    hours?: string;
    costRange?: string;
    bookingMethod?: string;
    reservationsRequired?: boolean;
    website?: string;
  } | null;

  const jsonLd = buildJsonLd(exp, ratingCount >= 3 ? { avgRating, ratingCount } : null);

  // Real per-event pricing from the shared PACK_PRICING table (lib/packPricing.ts)
  // — was previously hardcoded to "wimbledon-2026" as the fallback event and read
  // price from GLOBAL env vars regardless of which event this experience actually
  // belongs to. Fixed 1 Aug 2026 after a Bahrain GP (USD) experience page showed
  // "£25" with no relationship to the real event or currency. If the resolved
  // event has no PACK_PRICING entry yet, priceDisplay is null and the gate falls
  // back to a generic "Get the full pack" CTA with no invented price.
  const eventPricing = await getPackPricing(eventPackSlug);
  // FREE_EVENT_SLUGS format: "slug:YYYY-MM-DD,slug:YYYY-MM-DD,slug" — a slug with
  // no :date is free with no end date; a slug with :date is free through the end
  // of that day (UTC). Must match parsing in app/event-pack/[slug]/page.tsx.
  const isFreeEventSlug = (process.env.FREE_EVENT_SLUGS ?? "")
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [entrySlug, endDate] = entry.split(":");
      return { slug: entrySlug.trim(), endDate: endDate?.trim() };
    })
    .some((e) => e.slug === eventPackSlug && (!e.endDate || new Date() <= new Date(`${e.endDate}T23:59:59Z`)));
  const priceDisplay = isFreeEventSlug ? "Free" : eventPricing?.priceDisplay ?? null;

  // Auth + saved state (always fresh — never cached)
  const { user: authUser } = await getAuthUser();
  const isLoggedIn = !!authUser;
  const isPro = authUser?.email ? await hasProSubscription(authUser.email) : false;

  // Pack purchasers get unlimited reads for experiences in their purchased event
  let hasPurchasedPack = false;
  if (authUser?.email && exp.sportingEventId) {
    const [purchase] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(
        and(
          eq(purchases.email, authUser.email),
          eq(purchases.sportingEventId, exp.sportingEventId),
          eq(purchases.status, "active")
        )
      )
      .limit(1);
    hasPurchasedPack = !!purchase;
  }
  let isSaved = false;
  let hasVisited = false;
  let visitRating: number | null = null;
  let archetype: string | null = null;
  if (authUser) {
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);
    if (dbUser) {
      const [saved] = await db
        .select({ id: savedItems.id })
        .from(savedItems)
        .where(and(eq(savedItems.userId, dbUser.id), eq(savedItems.experienceId, exp.id)))
        .limit(1);
      isSaved = !!saved;

      const [log] = await db
        .select({ rating: travelLogs.rating })
        .from(travelLogs)
        .where(and(eq(travelLogs.userId, dbUser.id), eq(travelLogs.experienceId, exp.id)))
        .limit(1);
      hasVisited = !!log;
      visitRating = log?.rating ?? null;
    }
    if (authUser.email) {
      const [profile] = await db
        .select({ archetype: userProfiles.archetype })
        .from(userProfiles)
        .where(eq(userProfiles.email, authUser.email))
        .limit(1);
      archetype = profile?.archetype ?? null;
    }
  }

  const ARCHETYPE_PREFERRED_TYPES: Record<string, string[]> = {
    pilgrim:       ["sports_venue", "fan_experience", "event"],
    first_pilgrim: ["sports_venue", "fan_experience", "transit"],
    connoisseur:   ["accommodation", "dining", "fan_experience"],
    immersionist:  ["neighborhood", "dining", "activity"],
  };
  const isArchetypeMatch = archetype != null &&
    (ARCHETYPE_PREFERRED_TYPES[archetype] ?? []).includes(exp.experienceType);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ExperienceTracker
        experienceSlug={exp.slug}
        experienceTitle={exp.title}
        eventSlug={eventPackSlug}
        eventName={eventPackName}
      />
      <ExperienceViewGate
        slug={slug}
        eventPackSlug={eventPackSlug}
        eventPackName={eventPackName}
        priceDisplay={priceDisplay}
        isPro={isPro}
        hasPurchasedPack={hasPurchasedPack}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ── */}
      {exp.heroImageUrl ? (
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[#0A0A0A]">
          <Image
            src={exp.heroImageUrl}
            alt={exp.heroImageAlt ?? exp.title}
            fill
            className={`object-cover opacity-90 ${
              slug.startsWith("brazilian-gp-arrival-queue-guide-") ? "lg:object-[center_20%]" :
              slug.startsWith("brazilian-gp-hotel-emiliano-") ? "lg:object-[center_35%]" :
              slug.startsWith("brazilian-gp-budget-hotels-morumbi-") ? "lg:object-[center_20%]" :
              slug.startsWith("brazilian-gp-ibirapuera-park-") ? "lg:object-[center_75%]" :
              slug.startsWith("brazilian-gp-paulista-masp-") ? "lg:object-[center_60%]" :
              slug.startsWith("brazilian-gp-feira-da-liberdade-") ? "lg:object-[center_60%]" :
              slug.startsWith("brazilian-gp-campos-do-jordao-daytrip-") ? "lg:object-[center_10%]" :
              slug.startsWith("us-gp-turn-15-stadium-") ? "lg:object-[center_30%]" :
              slug.startsWith("us-gp-paddock-club-") ? "lg:object-[center_60%]" :
              slug.startsWith("us-gp-general-admission-") ? "lg:object-[center_85%]" :
              slug.startsWith("us-gp-super-stage-concerts-") ? "lg:object-[center_80%]" :
              slug.startsWith("us-gp-weather-what-to-pack-") ? "lg:object-[center_60%]" :
              slug.startsWith("us-gp-franklin-barbecue-") ? "lg:object-[center_30%]" :
              slug === "wimbledon-centre-court-mq4whguq" ? "object-[center_65%]" :
              slug.startsWith("pouhon-corner-silver3-") ? "object-[center_70%]" :
              slug.startsWith("fan-zone-raidillon-") ? "object-[center_80%]" :
              slug.startsWith("spa-francorchamps-track-experiences-") ? "object-[center_92%]" :
              slug.startsWith("open-bold-hotel-") ? "object-[center_40%]" :
              slug.startsWith("open-pub-walk-birkdale-") ? "object-[center_60%]" :
              slug.startsWith("open-lord-street-southport-") ? "object-[center_70%]" :
              slug.startsWith("open-liverpool-day-trip-") ? "object-[center_35%]" :
              slug.startsWith("open-vincent-hotel-") ? "object-[center_70%]" :
              slug.startsWith("grandstand-22-parabolica-corner-") ? "object-[center_80%]" :
              slug.startsWith("monza-inside-the-venue-") ? "lg:object-[center_65%]" :
              slug.startsWith("staying-in-milan-city-base-strategy-") ? "lg:object-[center_75%]" :
              slug.startsWith("alfa-romeo-museum-arese-") ? "object-[center_15%]" :
              slug.startsWith("paddock-club-champions-club-hospitality-") ? "lg:object-[center_40%]" :
              slug.startsWith("7th-wentworth-grandstand-green-") ? "object-[center_75%]" :
              slug.startsWith("a-day-in-budapest-") ? "lg:object-[center_20%]" :
              slug.startsWith("szimpla-kert-") ? "lg:object-[center_100%]" :
              slug.startsWith("four-seasons-gresham-palace-") ? "lg:object-[center_25%]" :
              slug.startsWith("newlands-where-to-sit-") ? "lg:object-[center_65%]" :
              slug.startsWith("luxury-shanghai-peninsula-bulgari-") ? "lg:object-[center_65%]" :
              slug.startsWith("durban-bunny-chow-indian-ocean-cuisine-") ? "lg:object-[center_10%]" :
              slug.startsWith("ushaka-marine-world-golden-mile-") ? "lg:object-[center_15%]" :
              slug.startsWith("aus-sa-ticket-guide-") ? "lg:object-[center_70%]" :
              slug.startsWith("late-night-melbourne-park-midnight-finishes-") ? "lg:object-[center_32%]" :
              slug.startsWith("cape-winelands-stellenbosch-franschhoek-") ? "lg:object-[center_85%]" :
              slug.startsWith("where-to-stay-sandton-") ? "lg:object-[center_25%]" :
              slug.startsWith("soweto-apartheid-museum-") ? "lg:object-[center_15%]" :
              slug.startsWith("putrajaya-day-trip-pink-mosque-capital") ? "lg:object-[center_50%]" :
              slug.startsWith("sama-sama-hotel-klia-sepang") ? "lg:object-[center_65%]" :
              slug.startsWith("hill-stand-c2-sepang-general-admission") ? "object-[center_80%]" :
              slug.startsWith("singapore-gp-ticket-guide-") ? "lg:object-[center_75%]" :
              slug.startsWith("singapore-gp-zone4-walkabout-") ? "object-[center_80%]" :
              slug.startsWith("atp-finals-ticket-guide-") ? "object-[center_30%]" :
              slug.startsWith("atp-finals-piazza-san-carlo-") ? "object-[center_60%]" :
              slug.startsWith("atp-finals-turin-cathedral-") ? "object-[center_82%]" :
              slug.startsWith("atp-finals-caffe-bicerin-") ? "object-[center_42%]" :
              slug.startsWith("atp-finals-luxury-hotels-") ? "object-[center_88%]" :
              slug.startsWith("li-na-zheng-qinwen-generations-") ? "lg:object-[center_25%]" :
              slug.startsWith("getting-to-qizhong-shanghai-masters-") ? "lg:object-[center_75%]" :
              slug.startsWith("where-to-stay-shanghai-masters-") ? "lg:object-[center_25%]" :
              slug.startsWith("the-bund-shanghai-dusk-") ? "lg:object-[center_80%]" :
              slug.startsWith("xiaolongbao-shanghai-guide-") ? "lg:object-[center_70%]" :
              slug.startsWith("china-visa-apps-payments-guide-") ? "lg:object-[center_0%]" :
              slug.startsWith("suzhou-classical-gardens-day-trip-") ? "lg:object-[center_20%]" :
              slug.startsWith("lujiazui-skyline-shanghai-") ? "lg:object-[center_25%]" :
              slug.startsWith("roger-friends-federer-exhibition-") ? "lg:object-[center_10%]" :
              slug.startsWith("adelaide-oval-hill-vs-reserve-") ? "object-[center_80%]" :
              slug.startsWith("mcg-corporate-boxes-boxing-day-") ? "object-[center_25%]" :
              slug.startsWith("blue-mountains-day-trip-from-sydney-") ? "object-[center_40%]" :
              slug.startsWith("sydney-harbour-beaches-city-day-") ? "object-[center_60%]" :
              slug.startsWith("rod-laver-arena-inside-main-court-") ? "lg:object-[center_75%]" :
              slug.startsWith("federation-square-cbd-laneways-") ? "lg:object-[center_68%]" :
              slug.startsWith("las-vegas-gp-fountains-sphere-") ? "lg:object-[center_80%]" :
              slug.startsWith("las-vegas-gp-hoover-dam-") ? "lg:object-[center_30%]" :
              slug.startsWith("las-vegas-gp-sportsbook-watch-") ? "lg:object-[center_85%]" :
              slug.startsWith("las-vegas-gp-strip-casinos-") ? "lg:object-[center_75%]" :
              slug.startsWith("las-vegas-gp-main-grandstand-") ? "lg:object-[center_65%]" :
              slug.startsWith("west-grandstand-yas-marina-") ? "lg:object-[center_100%]" :
              slug.startsWith("w-abu-dhabi-yas-island-") ? "lg:object-[center_20%]" :
              slug.startsWith("park-regis-business-bay-dubai-") ? "lg:object-[center_85%]" :
              slug.startsWith("crowne-plaza-yas-island-") ? "lg:object-[center_35%]" :
              slug.startsWith("beach-rotana-corniche-abu-dhabi-") ? "lg:object-[center_28%]" :
              slug.startsWith("burj-khalifa-dubai-day-trip-") ? "lg:object-[center_15%]" :
              slug.startsWith("mexico-city-gp-paddock-club-") ? "lg:object-[center_70%]" :
              slug.startsWith("autodromo-hermanos-rodriguez-venue-") ? "lg:object-[center_40%]" :
              slug.startsWith("mexico-city-gp-arrival-queue-") ? "lg:object-[center_85%]" :
              slug.startsWith("mexico-city-where-to-stay-condesa-") ? "lg:object-[center_85%]" :
              slug.startsWith("mexico-city-where-to-stay-polanco-") ? "lg:object-[center_30%]" :
              slug.startsWith("mexico-city-pujol-contramar-") ? "lg:object-[center_60%]" :
              slug.startsWith("mexico-city-chapultepec-anthropology-") ? "lg:object-[center_35%]" :
              slug.startsWith("mexico-city-dia-de-muertos-") ? "lg:object-[center_20%]" :
              slug === "court-philippe-chatrier-suzanne-lenglen" ? "lg:object-[center_65%]" :
              slug === "roland-garros-travel-official-packages" ? "lg:object-[center_25%]" :
              slug.startsWith("qatar-gp-north-grandstand-") ? "lg:object-[center_70%]" :
              slug.startsWith("qatar-gp-fan-zone-") ? "lg:object-[center_35%]" :
              slug.startsWith("qatar-gp-getting-there-") ? "lg:object-[center_70%]" :
              slug.startsWith("qatar-gp-parisa-atmosphere-dining-") ? "lg:object-[center_75%]" :
              slug.startsWith("piastri-grandstand-albert-park-") ? "lg:object-[center_20%]" :
              slug.startsWith("albert-park-circuit-inside-the-track-") ? "lg:object-[center_40%]" :
              slug.startsWith("lakeside-festival-albert-park-") ? "lg:object-[center_40%]" :
              ""
            }`}
            sizes="100vw"
            priority
          />
          {exp.heroImageCredit && (
            <p className="absolute bottom-3 right-4 text-xs text-white/50">
              {exp.heroImageCredit}
            </p>
          )}
        </div>
      ) : (
        <div className="h-2 bg-[#141414]" />
      )}

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center justify-between gap-2 text-xs text-[#6A6A6A] mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#AAFF00] transition-colors">Home</Link>
            <span>·</span>
            <span>{exp.destinationName}, {exp.destinationCountry.toUpperCase()}</span>
            {exp.neighborhood && (
              <>
                <span>·</span>
                <span>{exp.neighborhood}</span>
              </>
            )}
          </div>
          {(() => {
            const spokeLink = suppressSpokeBackLink ? null : getSpokeBackLink(exp.slug, resolvedFromEventSlug);
            return spokeLink ? (
              <Link
                href={`/event-pack/${spokeLink.eventSlug}/${spokeLink.spokeId}`}
                className="flex-shrink-0 text-[#AAFF00] hover:text-[#BBFF33] font-semibold underline underline-offset-2 transition-colors"
              >
                ← Back to {spokeLink.spokeLabel}
              </Link>
            ) : null;
          })()}
        </nav>

        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
        <article className="max-w-3xl">

        {/* Type badge */}
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6A6A6A]">
              {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
            </span>
            {hasVisited && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#AAFF00] bg-[#AAFF00]/10 border border-[#AAFF00]/30 rounded-sm px-2 py-0.5">
                ✓ You{`'`}ve been here{visitRating ? ` · ${visitRating}/5` : ""}
              </span>
            )}
            {!hasVisited && isArchetypeMatch && (
              <span className="inline-block text-[10px] font-medium text-[#6A6A6A] border border-[#2A2A2A] rounded-sm px-2 py-0.5">
                Picked for your profile
              </span>
            )}
          </div>
          {exp.googleMapsRating && (
            <a
              href={exp.googleMapsUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 text-xs text-[#A3A3A3] hover:text-[#AAFF00] transition-colors"
            >
              <span className="text-[#AAFF00]">★</span>
              <span className="font-bold text-white">{exp.googleMapsRating}</span>
              {exp.googleMapsReviewCount != null && (
                <span>({exp.googleMapsReviewCount.toLocaleString()} Google reviews)</span>
              )}
            </a>
          )}
          {!exp.googleMapsRating && multiVenueRatings && (
            <a
              href="#ratings"
              className="flex-shrink-0 flex items-center gap-1 text-xs text-[#A3A3A3] hover:text-[#AAFF00] transition-colors"
            >
              <span className="text-[#AAFF00]">★</span>
              <span>Ratings for all {multiVenueRatings.venueCount} {multiVenueRatings.venueNoun}</span>
              <span className="text-[#6A6A6A]">↓</span>
            </a>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#AAFF00] leading-tight tracking-tight">
          {exp.title}
        </h1>

        {exp.subtitle && (
          <p className="mt-3 text-lg text-[#A3A3A3] leading-relaxed">
            {exp.subtitle}
          </p>
        )}

        {ratingCount >= 3 && (
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className={`text-sm ${s <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-[#2A2A2A]"}`}>★</span>
              ))}
            </div>
            <span className="text-xs font-medium text-[#A3A3A3]">{Number(avgRating).toFixed(1)}</span>
            <span className="text-xs text-[#6A6A6A]">· {ratingCount} traveller{ratingCount !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#2A2A2A]">
          {(exp.bodyContent || exp.whyItsSpecial) && (
            <MetaBadge label={`${estimateReadingTime(exp.bodyContent, exp.whyItsSpecial)} min read`} />
          )}
          {exp.budgetTier && (
            <MetaBadge label={BUDGET_LABELS[exp.budgetTier]} />
          )}
          {exp.pace && (
            <MetaBadge label={PACE_LABELS[exp.pace]} />
          )}
          {exp.physicalIntensity && (
            <MetaBadge label={`Intensity ${exp.physicalIntensity}/5`} />
          )}
          {exp.bestSeasons && exp.bestSeasons.length > 0 && (
            <MetaBadge
              label={`Best: ${exp.bestSeasons.map((m) => MONTH_LABELS[m] ?? m).join(", ")}`}
            />
          )}
          {exp.advanceBookingRequired && (
            <MetaBadge label="Book in advance" highlight />
          )}
          {exp.availability === "event_only" && (
            <MetaBadge label="Event only" highlight />
          )}
        </div>

        {/* Body */}
        {exp.bodyContent && (
          <div id={multiVenueRatings ? "ratings" : undefined} className="mt-10 max-w-none scroll-mt-20">
            {slug.startsWith("singapore-gp-trackside-hotels-") && (
              <p className="text-xs text-[#6A6A6A] mb-4">Updated on: 2 August 2026</p>
            )}
            {exp.bodyContent.split("\n\n").map((para, i) => (
              <p key={i} className="text-[#A3A3A3] leading-8 mb-5">
                {renderInline(para)}
              </p>
            ))}
          </div>
        )}

        {/* Why It's Special */}
        {exp.whyItsSpecial && (
          <div className="mt-12 border-l-4 border-[#AAFF00] pl-6 py-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
              Why it&apos;s special
            </p>
            {exp.whyItsSpecial.split("\n\n").map((para, i) => (
              <p key={i} className="text-[#A3A3A3] leading-8 mb-4 italic">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Insider Tips */}
        {exp.insiderTips && exp.insiderTips.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-5">
              Insider tips
            </h2>
            <ol className="space-y-4">
              {exp.insiderTips.filter(Boolean).map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-sm bg-[#AAFF00] text-black text-xs font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[#A3A3A3] leading-7 text-[15px]">{tip}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Practical Info */}
        {practical && (
          <div className="mt-12 rounded-sm bg-[#141414] border border-[#2A2A2A] p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-5">
              Practical info
            </h2>
            <dl className="space-y-3">
              {practical.hours && (
                <PracticalRow label="Hours" value={practical.hours} />
              )}
              {practical.costRange && (
                <PracticalRow label="Cost" value={practical.costRange} />
              )}
              {practical.bookingMethod && (
                <PracticalRow label="Access" value={practical.bookingMethod} />
              )}
              {exp.bookingLinks && (exp.bookingLinks as Array<{ platform: string; label?: string; url: string }>).length > 0 && (
                <div className="flex gap-4">
                  <dt className="w-[30%] flex-shrink-0 text-sm font-medium text-[#6A6A6A]">Book</dt>
                  <dd className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap gap-2">
                      {(exp.bookingLinks as Array<{ platform: string; label?: string; url: string }>).map((link, i) => (
                        <a
                          key={link.url ?? i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                        >
                          {link.label ?? link.platform}
                        </a>
                      ))}
                    </div>
                    {(exp.bookingLinks as Array<{ platform: string; label?: string; url: string }>).some((link) =>
                      isRealAffiliateLink(link.url)
                    ) && (
                      <p className="text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
                    )}
                  </dd>
                </div>
              )}
              {exp.gettingThere && (
                <PracticalRow label="Getting there" value={exp.gettingThere} />
              )}
              {exp.address && (
                <PracticalRow label="Address" value={exp.address} />
              )}
              {practical.website && (
                <div className="flex gap-4">
                  <dt className="w-[30%] flex-shrink-0 text-sm font-medium text-[#6A6A6A]">Website</dt>
                  <dd className="min-w-0 break-all flex flex-col gap-1">
                    {practical.website.split(",").map((url) => {
                      const trimmed = url.trim();
                      const href = trimmed.match(/^https?:\/\//) ? trimmed : `https://${trimmed}`;
                      return (
                        <a
                          key={trimmed}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#AAFF00] underline hover:text-white transition-colors"
                        >
                          {trimmed.replace(/^https?:\/\//, "")}
                        </a>
                      );
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* What to Avoid */}
        {exp.whatToAvoid && (
          <div className="mt-8 rounded-sm bg-[#141414] border border-[#2A2A2A] p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3">
              What to avoid
            </h2>
            <p className="text-[#A3A3A3] text-sm leading-7">{exp.whatToAvoid}</p>
          </div>
        )}

        {/* Curator attribution — only shown when a named curator is assigned */}
        {exp.curatorName && (
          <div className="mt-12 pt-8 border-t border-[#2A2A2A] flex items-start gap-4">
            {exp.curatorImage ? (
              <Image
                src={exp.curatorImage}
                alt={exp.curatorName}
                width={40}
                height={40}
                className="rounded-sm object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0 text-sm font-black text-[#AAFF00]">
                {exp.curatorName[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">{exp.curatorName}</p>
              <p className="text-xs text-[#6A6A6A] mt-0.5">Curator</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {exp.moodTags && exp.moodTags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[#2A2A2A] flex flex-wrap gap-2">
            {exp.moodTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-sm bg-[#141414] border border-[#2A2A2A] text-xs text-[#6A6A6A] capitalize"
              >
                {tag}
              </span>
            ))}
            {exp.interestCategories?.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-sm bg-[#141414] border border-[#2A2A2A] text-xs text-[#6A6A6A] capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Draft watermark */}
        {exp.status === "draft" && (
          <div className="mt-10 text-center text-xs text-[#2A2A2A] font-medium tracking-widest uppercase">
            Draft — not published
          </div>
        )}

        {/* Save CTA */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
          <SaveExperienceCTA
            experienceId={exp.id}
            slug={slug}
            isLoggedIn={isLoggedIn}
            isSaved={isSaved}
          />
        </div>
        </article>

        <div className="lg:sticky lg:top-8 lg:mt-11">
          <ExperienceActionSidebar
            eventPackSlug={eventPackSlug}
            eventPackName={eventPackName}
            hasLivePack={hasLivePack}
            userEmail={authUser?.email ?? null}
          />
        </div>
        </div>
      </div>

      {/* Related experiences */}
      {related.length > 0 && (
        <div className="border-t border-[#2A2A2A] bg-[#141414]">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-6">
              More from this guide
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/experience/${rel.slug}`}
                  className="group rounded-sm border border-[#2A2A2A] overflow-hidden hover:border-[#AAFF00] transition-colors bg-[#0A0A0A]"
                >
                  {rel.heroImageUrl ? (
                    <div className="relative h-32 overflow-hidden bg-[#1A1A1A]">
                      <Image
                        src={rel.heroImageUrl}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-[#1A1A1A]" />
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-1.5">
                      {TYPE_LABELS[rel.experienceType] ?? rel.experienceType}
                    </p>
                    <h3 className="text-sm font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    {rel.neighborhood && (
                      <p className="mt-1.5 text-xs text-[#6A6A6A]">{rel.neighborhood}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildJsonLd(
  exp: ExperienceDetail,
  rating: { avgRating: number; ratingCount: number } | null,
) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.experiences-curated.com";

  const priceRange =
    exp.budgetMinCost && exp.budgetMaxCost
      ? `${exp.budgetCurrency ?? ""}${exp.budgetMinCost}–${exp.budgetCurrency ?? ""}${exp.budgetMaxCost}`
      : exp.budgetMinCost
      ? `${exp.budgetCurrency ?? ""}${exp.budgetMinCost}+`
      : null;

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: exp.title,
    ...(exp.subtitle || exp.whyItsSpecial
      ? { description: exp.subtitle ?? exp.whyItsSpecial?.slice(0, 160) }
      : {}),
    url: `${base}/experience/${exp.slug}`,
    ...(exp.heroImageUrl ? { image: exp.heroImageUrl } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: exp.destinationName,
      addressCountry: exp.destinationCountry.toUpperCase(),
      ...(exp.address ? { streetAddress: exp.address } : {}),
    },
    ...(priceRange ? { priceRange } : {}),
    ...(exp.publishedAt ? { datePublished: new Date(exp.publishedAt).toISOString() } : {}),
    ...(exp.curatorName ? { author: { "@type": "Person", name: exp.curatorName } } : {}),
    ...(rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.avgRating,
            ratingCount: rating.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

function MetaBadge({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-sm text-xs font-medium",
        highlight
          ? "bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/30"
          : "bg-[#141414] text-[#6A6A6A] border border-[#2A2A2A]"
      )}
    >
      {label}
    </span>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:[^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:[^)]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-[#AAFF00] hover:text-white transition-colors"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function linkifyText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    part.startsWith("http") ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#AAFF00] hover:text-white break-all transition-colors">
        {part}
      </a>
    ) : part
  );
}

function PracticalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-[30%] flex-shrink-0 text-sm font-medium text-[#6A6A6A]">{label}</dt>
      <dd className="text-sm text-[#A3A3A3] leading-6 min-w-0 break-words">{linkifyText(value)}</dd>
    </div>
  );
}
