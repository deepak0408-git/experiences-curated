import { unstable_cache } from "next/cache";
import { getExperienceBySlug, type ExperienceDetail } from "@/lib/queries/experiences";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { experiences, savedItems, users, userProfiles, travelLogs, purchases, sportingEvents } from "@/schema/database";
import { and, eq, ne, inArray, count, sql } from "drizzle-orm";
import { getAuthUser } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import ExperienceViewGate from "./_components/ExperienceViewGate";
import { getPackPricing } from "@/lib/packPricing";
import SaveExperienceCTA from "./_components/SaveExperienceCTA";
import ExperienceTracker from "./_components/ExperienceTracker";

// Hub-and-spoke "back to spoke" link — maps an experience's slug prefix to
// the ONE spoke it's most at home in, per explicit curator sign-off (7 Aug
// 2026). Where an experience is referenced by more than one spoke (e.g.
// atp-finals-luxury-hotels- appears in both Hotels and Luxury), this picks
// its true home, not every spoke that happens to link to it.
//
// Rendering no longer gates on eventPackFormat === "hub_and_spoke" (fixed
// 16 Aug 2026) — that flag is derived from experiences.sportingEventId, a
// single direct FK to the experience's PRIMARY owning event, which doesn't
// see experiences shared into a second event via sporting_event_experiences
// (the real many-to-many join table). Eton and Windsor Castle's
// sportingEventId still points to BMW PGA Championship (packFormat:
// "classic") even though they're also linked into Wimbledon's Day Trips
// spoke — the old gate silently hid their otherwise-correct
// EXPERIENCE_TO_SPOKE entries. getSpokeBackLink() is a pure, static,
// slug-based lookup that already only returns non-null for experiences
// explicitly mapped to a real hub-and-spoke event/spoke, so checking its
// result directly is both sufficient and correct — no separate format
// check needed, and eventPackFormat/eventPackSlug/eventPackName (which
// drive checkout/pricing) are deliberately left untouched, still resolved
// from the experience's primary sportingEventId as before. See memory
// project_shared_experience_backlink_gap for the fuller design context
// (a `?from=` referrer-based fix is still pending for the OPPOSITE case —
// an experience reached from its non-primary event's pack whose target
// spoke should reflect that referring event, not always its EXPERIENCE_TO_SPOKE
// default).
const EXPERIENCE_TO_SPOKE: Record<string, { eventSlug: string; spokeId: string; spokeLabel: string }> = {
  "atp-finals-ticket-guide-": { eventSlug: "atp-finals", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "atp-finals-luxury-hospitality-": { eventSlug: "atp-finals", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "atp-finals-luxury-hotels-": { eventSlug: "atp-finals", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "atp-finals-porta-nuova-neighborhood-": { eventSlug: "atp-finals", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "atp-finals-airport-to-city-": { eventSlug: "atp-finals", spokeId: "getting-there", spokeLabel: "Getting There" },
  "atp-finals-getting-to-inalpi-arena-": { eventSlug: "atp-finals", spokeId: "getting-there", spokeLabel: "Getting There" },
  "atp-finals-aperitivo-vermouth-": { eventSlug: "atp-finals", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "atp-finals-caffe-bicerin-": { eventSlug: "atp-finals", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "atp-finals-gianduja-chocolate-": { eventSlug: "atp-finals", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "atp-finals-piedmontese-dining-": { eventSlug: "atp-finals", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "atp-finals-barolo-langhe-daytrip-": { eventSlug: "atp-finals", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "atp-finals-juventus-museum-": { eventSlug: "atp-finals", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "atp-finals-practice-courts-": { eventSlug: "atp-finals", spokeId: "map", spokeLabel: "Venue Map" },
  "atp-finals-inalpi-arena-": { eventSlug: "atp-finals", spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
  "atp-finals-mole-antonelliana-": { eventSlug: "atp-finals", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "atp-finals-museo-egizio-": { eventSlug: "atp-finals", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "atp-finals-royal-palace-": { eventSlug: "atp-finals", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "atp-finals-piazza-san-carlo-": { eventSlug: "atp-finals", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "atp-finals-turin-cathedral-": { eventSlug: "atp-finals", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "qizhong-forest-sports-city-arena-": { eventSlug: "shanghai-masters", spokeId: "map", spokeLabel: "Venue Map" },
  "getting-to-qizhong-shanghai-masters-": { eventSlug: "shanghai-masters", spokeId: "getting-there", spokeLabel: "Getting There" },
  "where-to-stay-shanghai-masters-": { eventSlug: "shanghai-masters", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "china-visa-apps-payments-guide-": { eventSlug: "shanghai-masters", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "shanghai-masters-ticket-guide-": { eventSlug: "shanghai-masters", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "qizhong-center-court-": { eventSlug: "shanghai-masters", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "the-bund-shanghai-dusk-": { eventSlug: "shanghai-masters", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "yu-garden-old-city-shanghai-": { eventSlug: "shanghai-masters", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "french-concession-tianzifang-shanghai-": { eventSlug: "shanghai-masters", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "xiaolongbao-shanghai-guide-": { eventSlug: "shanghai-masters", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "lujiazui-skyline-shanghai-": { eventSlug: "shanghai-masters", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "hangzhou-west-lake-day-trip-": { eventSlug: "shanghai-masters", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "suzhou-classical-gardens-day-trip-": { eventSlug: "shanghai-masters", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "shanghai-masters-crowds-atmosphere-": { eventSlug: "shanghai-masters", spokeId: "itinerary", spokeLabel: "Trip Schedule" },
  "li-na-zheng-qinwen-generations-": { eventSlug: "shanghai-masters", spokeId: "itinerary", spokeLabel: "Trip Schedule" },
  "french-concession-dining-shanghai-": { eventSlug: "shanghai-masters", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "shanghai-maglev-airport-question-": { eventSlug: "shanghai-masters", spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
  "luxury-shanghai-peninsula-bulgari-": { eventSlug: "shanghai-masters", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "roger-friends-federer-exhibition-": { eventSlug: "shanghai-masters", spokeId: "itinerary", spokeLabel: "Trip Schedule" },
  "main-grandstand-sepang-start-finish": { eventSlug: "bahrain-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "k1-grandstand-sepang-turn-1": { eventSlug: "bahrain-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "grandstand-f-sepang-panoramic": { eventSlug: "bahrain-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "hill-stand-c2-sepang-general-admission": { eventSlug: "bahrain-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "f1-paddock-club-sepang-hospitality": { eventSlug: "bahrain-grand-prix", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "getting-to-sepang-circuit-klia": { eventSlug: "bahrain-grand-prix", spokeId: "getting-there", spokeLabel: "Getting There" },
  "staying-in-kuala-lumpur-klcc-bukit-bintang": { eventSlug: "bahrain-grand-prix", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "sama-sama-hotel-klia-sepang": { eventSlug: "bahrain-grand-prix", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "jalan-alor-night-food-street-kl": { eventSlug: "bahrain-grand-prix", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "old-china-cafe-heritage-nyonya-chinatown": { eventSlug: "bahrain-grand-prix", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "petronas-twin-towers-kl-skybridge": { eventSlug: "bahrain-grand-prix", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "malaysia-f1-fans-nostalgia-2026-return": { eventSlug: "bahrain-grand-prix", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "sepang-circuit-history-f1-return": { eventSlug: "bahrain-grand-prix", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "batu-caves-kuala-lumpur-hindu-shrine": { eventSlug: "bahrain-grand-prix", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "genting-highlands-day-trip-cool-climate": { eventSlug: "bahrain-grand-prix", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "putrajaya-day-trip-pink-mosque-capital": { eventSlug: "bahrain-grand-prix", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "singapore-gp-turn1-grandstand-": { eventSlug: "singapore-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "singapore-gp-stamford-grandstand-": { eventSlug: "singapore-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "singapore-gp-padang-grandstand-": { eventSlug: "singapore-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "singapore-gp-zone4-walkabout-": { eventSlug: "singapore-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "singapore-gp-ticket-guide-": { eventSlug: "singapore-grand-prix", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "singapore-gp-paddock-club-": { eventSlug: "singapore-grand-prix", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "singapore-gp-getting-around-": { eventSlug: "singapore-grand-prix", spokeId: "getting-there", spokeLabel: "Getting There" },
  "singapore-gp-trackside-hotels-": { eventSlug: "singapore-grand-prix", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "singapore-gp-clarke-quay-stay-": { eventSlug: "singapore-grand-prix", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "singapore-gp-chinatown-stay-": { eventSlug: "singapore-grand-prix", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "singapore-gp-lau-pa-sat-": { eventSlug: "singapore-grand-prix", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "singapore-gp-maxwell-food-centre-": { eventSlug: "singapore-grand-prix", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "singapore-gp-bayfront-hawkers-": { eventSlug: "singapore-grand-prix", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "singapore-gp-sentosa-": { eventSlug: "singapore-grand-prix", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "singapore-gp-gardens-by-the-bay-": { eventSlug: "singapore-grand-prix", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "singapore-gp-waterfront-walk-": { eventSlug: "singapore-grand-prix", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "singapore-gp-first-timer-orientation-": { eventSlug: "singapore-grand-prix", spokeId: "arrival", spokeLabel: "Arrival & Gate Guide" },
  "singapore-gp-f1-village-": { eventSlug: "singapore-grand-prix", spokeId: "arrival", spokeLabel: "Arrival & Gate Guide" },
  "singapore-gp-padang-stage-concerts-": { eventSlug: "singapore-grand-prix", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  // Wimbledon — added 14 Aug 2026 for the classic-to-hub-and-spoke
  // conversion. True-home spoke matches where each experience's
  // SpokeExperienceCard actually renders (see spokes/wimbledon/*.tsx) —
  // "wimbledon-cannizaro-house-" appears in both Hotels and Luxury, so its
  // true home here is Hotels, matching the ATP Finals precedent for a
  // dual-appearing experience.
  "wimbledon-centre-court-": { eventSlug: "wimbledon", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "the-hill-wimbledon-": { eventSlug: "wimbledon", spokeId: "map", spokeLabel: "Venue Map" },
  "wimbledon-eating-": { eventSlug: "wimbledon", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "wimbledon-no1-court-": { eventSlug: "wimbledon", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "wimbledon-museum-private-tour-": { eventSlug: "wimbledon", spokeId: "map", spokeLabel: "Venue Map" },
  "wimbledon-practice-courts-": { eventSlug: "wimbledon", spokeId: "map", spokeLabel: "Venue Map" },
  "wimbledon-the-lawn-hospitality-": { eventSlug: "wimbledon", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "the-wimbledon-queue-": { eventSlug: "wimbledon", spokeId: "arrival", spokeLabel: "Arrival & Queue Guide" },
  "dinner-at-the-crooked-billet-": { eventSlug: "wimbledon", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "traveling-to-the-all-england-club-": { eventSlug: "wimbledon", spokeId: "getting-there", spokeLabel: "Getting There" },
  "wimbledon-when-it-rains-": { eventSlug: "wimbledon", spokeId: "weather", spokeLabel: "Weather & What to Pack" },
  "dinner-at-the-black-lamb-": { eventSlug: "wimbledon", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "wimbledon-outer-courts-": { eventSlug: "wimbledon", spokeId: "map", spokeLabel: "Venue Map" },
  "preparing-for-your-wimbledon-visit-": { eventSlug: "wimbledon", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "sw19-during-the-fortnight-": { eventSlug: "wimbledon", spokeId: "itinerary", spokeLabel: "Trip Schedule" },
  "london-rest-day-": { eventSlug: "wimbledon", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "brixton-village-market-row-": { eventSlug: "wimbledon", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "wimbledon-cannizaro-house-": { eventSlug: "wimbledon", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "wimbledon-rose-crown-": { eventSlug: "wimbledon", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "park-plaza-county-hall-london-": { eventSlug: "wimbledon", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "nox-waterloo-": { eventSlug: "wimbledon", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "eton-across-river-windsor-": { eventSlug: "wimbledon", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "windsor-castle-long-walk-": { eventSlug: "wimbledon", spokeId: "day-trips", spokeLabel: "Day Trips" },
  // New Zealand tour of Australia 2026-27 — mapping locked with the curator
  // before seeding (see project_nz_in_australia_experiences memory).
  "perth-stadium-series-opener-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "map", spokeLabel: "Venue Map" },
  "adelaide-oval-most-beautiful-ground-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "map", spokeLabel: "Venue Map" },
  "mcg-boxing-day-test-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "map", spokeLabel: "Venue Map" },
  "scg-fourth-test-sydney-summer-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "map", spokeLabel: "Venue Map" },
  "nz-australia-series-ticket-guide-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "mcg-boxing-day-seating-comparison-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "adelaide-oval-hill-vs-reserve-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "tickets", spokeLabel: "Ticket Guide" },
  "mcg-corporate-boxes-boxing-day-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "adelaide-oval-stadium-club-deck-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "scg-luxury-invincibles-lounge-members-pavilion-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "luxury", spokeLabel: "Luxury Guide" },
  "where-to-stay-perth-first-test-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "where-to-stay-adelaide-city-vs-north-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "where-to-stay-melbourne-boxing-day-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "where-to-stay-sydney-fourth-test-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "hotels", spokeLabel: "Where to Stay" },
  "fremantle-day-trip-from-perth-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "mclaren-vale-adelaide-wine-daytrip-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "yarra-valley-melbourne-wine-daytrip-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "blue-mountains-day-trip-from-sydney-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "melbourne-laneways-coffee-city-day-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "sydney-harbour-beaches-city-day-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "wildlife-down-under-featherdale-phillip-island-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "great-ocean-road-twelve-apostles-daytrip-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "day-trips", spokeLabel: "Day Trips" },
  "beige-brigade-nz-traveling-support-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "first-timer-guide", spokeLabel: "First-Timer's Guide" },
  "where-nz-fans-actually-eat-city-guide-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "where-to-eat", spokeLabel: "Where to Eat" },
  "getting-between-four-cities-flights-not-trains-": { eventSlug: "new-zealand-in-australia-cricket-2026-27", spokeId: "getting-there", spokeLabel: "Getting There" },
};

function getSpokeBackLink(slug: string) {
  const entry = Object.entries(EXPERIENCE_TO_SPOKE).find(([prefix]) => slug.startsWith(prefix));
  return entry ? entry[1] : null;
}

// Real affiliate relationships are Booking.com and GetYourGuide only — see
// feedback_affiliate_link_generation memory. A GetYourGuide link is a direct
// getyourguide.com domain, easy to detect. A Booking.com affiliate link is
// NOT hosted on booking.com itself — it goes through a Commission Junction
// (CJ Affiliate) tracking-redirect domain (tkqlhce.com, anrdoezrs.net,
// kqzyfj.com, and others CJ assigns), with the real booking.com destination
// URL-encoded inside a `url=` query parameter, not visible as the link's own
// hostname. Checking the raw href for a literal "booking.com" substring is
// fragile (works by coincidence when the encoded param happens to contain
// the unescaped string, breaks if a network encodes it differently) — this
// decodes the URL and checks the real destination host instead. A plain
// link to an official site (e.g. wimbledon.com) is not an affiliate link
// and must never carry the disclaimer, even though it legitimately lives in
// the same bookingLinks array.
const CJ_REDIRECT_HOSTS = ["tkqlhce.com", "anrdoezrs.net", "kqzyfj.com", "jdoqocy.com", "dpbolvw.net"];

function isRealAffiliateLink(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "getyourguide.com" || parsed.hostname.endsWith(".getyourguide.com")) return true;
    if (CJ_REDIRECT_HOSTS.some((h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))) {
      const embedded = parsed.searchParams.get("url");
      if (embedded) {
        try {
          const embeddedHost = new URL(embedded).hostname;
          return embeddedHost === "booking.com" || embeddedHost.endsWith(".booking.com");
        } catch {
          return false;
        }
      }
    }
    return parsed.hostname === "booking.com" || parsed.hostname.endsWith(".booking.com");
  } catch {
    return false;
  }
}

// Multi-venue experiences (a hotel comparison, a restaurant roundup) never
// get a single top-line googleMapsRating — see experience-researcher skill
// §2c. Instead the badge-row rating slot becomes a jump-link down to a
// #ratings anchor in bodyContent, where each named venue's real rating is
// written inline. venueCount is display-only ("all 3 hotels").
const MULTI_VENUE_RATINGS: Record<string, { venueCount: number; venueNoun: string }> = {
  "where-to-stay-perth-first-test-": { venueCount: 2, venueNoun: "hotels" },
  "where-to-stay-adelaide-city-vs-north-": { venueCount: 2, venueNoun: "hotels" },
  "where-to-stay-melbourne-boxing-day-": { venueCount: 2, venueNoun: "hotels" },
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
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com";
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
      if (exp.sportingEventId) {
        const [ev] = await db
          .select({ slug: sportingEvents.slug, name: sportingEvents.name, packFormat: sportingEvents.packFormat })
          .from(sportingEvents)
          .where(eq(sportingEvents.id, exp.sportingEventId))
          .limit(1);
        if (ev) { eventPackSlug = ev.slug; eventPackName = ev.name; eventPackFormat = ev.packFormat; }
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

      return { exp, ratingRow, eventPackSlug, eventPackName, eventPackFormat, related };
    },
    ["experience-page"],
    { revalidate: 3600 }
  );

  const { exp, ratingRow, eventPackSlug, eventPackName, eventPackFormat, related } = await getExperienceData(slug);

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
  const eventPricing = getPackPricing(eventPackSlug);
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
              slug.startsWith("staying-in-milan-city-base-strategy-") ? "object-[center_20%]" :
              slug.startsWith("alfa-romeo-museum-arese-") ? "object-[center_15%]" :
              slug.startsWith("paddock-club-champions-club-hospitality-") ? "object-[center_10%]" :
              slug.startsWith("7th-wentworth-grandstand-green-") ? "object-[center_75%]" :
              slug.startsWith("a-day-in-budapest-") ? "lg:object-[center_20%]" :
              slug.startsWith("szimpla-kert-") ? "lg:object-[center_100%]" :
              slug.startsWith("four-seasons-gresham-palace-") ? "lg:object-[center_25%]" :
              slug.startsWith("newlands-where-to-sit-") ? "lg:object-[center_65%]" :
              slug.startsWith("luxury-shanghai-peninsula-bulgari-") ? "lg:object-[center_65%]" :
              slug.startsWith("durban-bunny-chow-indian-ocean-cuisine-") ? "lg:object-[center_10%]" :
              slug.startsWith("ushaka-marine-world-golden-mile-") ? "lg:object-[center_15%]" :
              slug.startsWith("aus-sa-ticket-guide-") ? "lg:object-[center_70%]" :
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
      <div className="max-w-3xl mx-auto px-6 py-12">

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
            const spokeLink = getSpokeBackLink(exp.slug);
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
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com";

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
