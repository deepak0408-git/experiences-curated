import { db } from "@/lib/db";
import {
  sportingEvents,
  experiences,
  sportingEventExperiences,
  plannerHotelTierCost,
  plannerTicketTierCost,
  plannerDestinationBands,
  plannerFlightCost,
  plannerOriginMarkets,
  purchases,
} from "@/schema/database";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProDetails } from "@/lib/pro";
import { grantFreeAccess } from "../../actions";
import { SPOKES_BY_EVENT } from "./spokeConfig";

// Shared data fetch for the hub + all 12 spokes of any hub_and_spoke-format
// event. Slug-driven — no hardcoded event constant — so a new hub-and-spoke
// event only needs a new SPOKES_BY_EVENT entry, not a new copy of this file.
// Built per the hub-and-spoke-event-pack skill; ported from the per-event
// static-folder pilot (Bahrain GP, Italian GP) to this dynamic route 29 Jul 2026.
//
// Cached 19 Aug 2026 (Supabase egress fix) — this function carries no
// per-user data (purchase/auth state is fetched separately via
// getPurchaseStatus below), so it's safe to cache per-slug. Every spoke
// component and HubPage call this on every render with zero caching
// previously — across ~70 routes (5 live events × ~14 pages each), this was
// almost certainly the single largest Postgres egress driver. 1-hour
// revalidate matches the same pattern already used on the classic
// experience page (app/experience/[slug]/page.tsx).
export const getSpokeData = unstable_cache(
  async (slug: string) => getSpokeDataUncached(slug),
  ["hub-and-spoke-spoke-data"],
  { revalidate: 3600 }
);

async function getSpokeDataUncached(slug: string) {
  const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, slug)).limit(1);
  if (!event) notFound();

  const linkedExperiences = await db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      title: experiences.title,
      subtitle: experiences.subtitle,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      heroImageUrl: experiences.heroImageUrl,
      practicalInfo: experiences.practicalInfo,
      whyItsSpecial: experiences.whyItsSpecial,
      insiderTips: experiences.insiderTips,
      whatToAvoid: experiences.whatToAvoid,
      packRank: sportingEventExperiences.packRank,
      googleMapsRating: experiences.googleMapsRating,
      googleMapsReviewCount: experiences.googleMapsReviewCount,
      googleMapsUrl: experiences.googleMapsUrl,
    })
    .from(sportingEventExperiences)
    .innerJoin(experiences, eq(experiences.id, sportingEventExperiences.experienceId))
    .where(
      and(
        eq(sportingEventExperiences.sportingEventId, event.id),
        eq(experiences.status, "published")
      )
    )
    .orderBy(sportingEventExperiences.packRank);

  const hotels = event.destinationId
    ? await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, event.destinationId))
    : [];
  const tickets = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, event.id));
  const [destinationBand] = event.destinationId
    ? await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, event.destinationId))
    : [];
  const flights = event.destinationId
    ? await db
        .select({
          originMarket: plannerFlightCost.originMarket,
          costLow: plannerFlightCost.costLow,
          costHigh: plannerFlightCost.costHigh,
          region: plannerOriginMarkets.region,
        })
        .from(plannerFlightCost)
        .innerJoin(plannerOriginMarkets, eq(plannerOriginMarkets.city, plannerFlightCost.originMarket))
        .where(eq(plannerFlightCost.destinationId, event.destinationId))
    : [];

  return {
    event,
    linkedExperiences,
    hotels,
    tickets,
    destinationBand,
    flights,
    diningExperiences: linkedExperiences.filter((e) => e.experienceType === "dining"),
    accommodationExperiences: linkedExperiences.filter((e) => e.experienceType === "accommodation"),
    transitExperiences: linkedExperiences.filter((e) => e.experienceType === "transit"),
    dayTrips: linkedExperiences.filter((e) => e.experienceType === "day_trip"),
    fanExperiences: linkedExperiences.filter((e) => e.experienceType === "fan_experience"),
    culturalExperiences: linkedExperiences.filter((e) => e.experienceType === "cultural_site"),
    luxuryExperiences: linkedExperiences.filter((e) => e.budgetTier === "splurge" || e.budgetTier === "luxury"),
    dateRange: `${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}–${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    // Oldest lastUpdated across all 3 planner cost tables feeding the Cost
    // spoke — the honest "verified as of" date, not the newest table's date,
    // since the headline price is only as fresh as its stalest input.
    costDataVerifiedAt: (() => {
      const dates = [...hotels, ...tickets, destinationBand]
        .filter((r): r is NonNullable<typeof r> => !!r?.lastUpdated)
        .map((r) => new Date(r.lastUpdated).getTime());
      return dates.length ? new Date(Math.min(...dates)) : null;
    })(),
  };
}

// Shared with getPackPricing (packPricing.ts) so pricing DISPLAY (e.g.
// showing "Free" instead of a price) and purchase-gating (below) read the
// exact same FREE_EVENT_SLUGS state — same helper as the classic pack's
// inline logic (app/event-pack/[slug]/page.tsx, ~line 540-559). Format:
// "slug:YYYY-MM-DD,slug:YYYY-MM-DD,slug" — a slug with no :date is free
// indefinitely; a dated entry grants access through the end of that day
// (UTC).
export function isFreeEventEnabled(slug: string): boolean {
  const freeEventEntries = (process.env.FREE_EVENT_SLUGS ?? "")
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [entrySlug, endDate] = entry.split(":");
      return { slug: entrySlug.trim(), endDate: endDate?.trim() };
    });
  const freeEventEntry = freeEventEntries.find((e) => e.slug === slug);
  return !!freeEventEntry && (!freeEventEntry.endDate || new Date() <= new Date(`${freeEventEntry.endDate}T23:59:59Z`));
}

// How recently a real purchases row must have been created for the
// post-checkout "you're in" banner to show. Deliberately NOT driven by a
// query param (e.g. ?purchased=1) — that would be trivially fakeable by
// anyone hand-editing the URL, since it wouldn't be checked against any
// real state. Instead this compares the real purchases.createdAt
// timestamp (written by our own webhook, not client-controlled) against
// now. 5 minutes covers normal checkout-redirect latency with margin.
const JUST_PURCHASED_WINDOW_MS = 5 * 60 * 1000;

// Real, server-verified purchase check — mirrors the classic pack's exact
// logic (app/event-pack/[slug]/page.tsx, ~line 524) so hub-and-spoke events
// gate content the same way classic events do: purchases table (status
// "active"), then FREE_EVENT_SLUGS env var (auto-grants + records a $0
// purchase row via grantFreeAccess, same as classic), then Annual Pro
// (only when event.isHidden is false — an Annual Pro subscriber must never
// get access to a still-hidden, unactivated event). Added 1 Aug 2026 to
// replace the pilot's `?unlocked=1`-only placeholder, which had no real
// purchase check at all (see hub-and-spoke-event-pack skill's TODO note).
//
// justPurchased is scoped ONLY to a real purchases row (Dodo/Paddle
// checkout or grantFreeAccess) created within JUST_PURCHASED_WINDOW_MS —
// never true for the Annual Pro branch, since that subscriber may have
// had access for months and showing a "you're in" banner on every visit
// would be wrong, not just redundant.
export async function getPurchaseStatus(slug: string, eventId: string, isHidden: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasPurchased = false;
  let justPurchased = false;

  // isPro is computed unconditionally, once, regardless of purchase status —
  // mirrors the classic pack (app/event-pack/[slug]/page.tsx, ~line 479-481).
  // Previously this only ran inside the "not yet purchased" branch below (to
  // check Annual Pro auto-unlock), so a real purchaser's isPro was never
  // computed at all — every spoke's <HowToBook> gate silently defaulted to
  // isPro=false for every purchaser, Pro or not. Fixed 6 Aug 2026.
  const { isPro, isAnnual, currentPeriodEnd } = user?.email
    ? await getProDetails(user.email)
    : { isPro: false, isAnnual: false, currentPeriodEnd: null };

  if (user?.email) {
    const [purchase] = await db
      .select({ id: purchases.id, createdAt: purchases.createdAt })
      .from(purchases)
      .where(and(eq(purchases.email, user.email), eq(purchases.sportingEventId, eventId), eq(purchases.status, "active")))
      .orderBy(purchases.createdAt)
      .limit(1);
    if (purchase) {
      hasPurchased = true;
      justPurchased = Date.now() - new Date(purchase.createdAt).getTime() < JUST_PURCHASED_WINDOW_MS;
    }
  }

  if (!hasPurchased && isFreeEventEnabled(slug) && user?.email) {
    await grantFreeAccess(user.email, eventId);
    hasPurchased = true;
    justPurchased = true;
  }

  if (!hasPurchased) {
    const isAnnualProActive = isAnnual && currentPeriodEnd != null && currentPeriodEnd > new Date();
    if (isAnnualProActive && !isHidden) {
      hasPurchased = true;
    }
  }

  return { hasPurchased, justPurchased, isPro, userEmail: user?.email ?? null };
}

export type SpokeStatus = "public" | "teaser" | "gated";
export type SpokeConfig = {
  id: string;
  label: string;
  question: string;
  status: SpokeStatus;
  imageSlug: string;
  // Direct image URL, used when a spoke's hero doesn't belong to any single
  // linked experience (e.g. a standalone packing/weather photo) — takes
  // priority over imageSlug matching when present.
  imageOverride?: string;
  // CSS object-position value (e.g. "center 30%"), passed straight through
  // to SpokeShell's <Image style={{ objectPosition }}>. Only needed when
  // the default object-cover crops out something important (a text overlay,
  // a subject near an edge) — most spokes don't need this set.
  heroImagePosition?: string;
};

export function getSpokesForEvent(slug: string): SpokeConfig[] {
  return SPOKES_BY_EVENT[slug] ?? [];
}

export function getSpokeImage(linkedExperiences: { slug: string; heroImageUrl: string | null }[], imageSlug: string): string | null {
  return linkedExperiences.find((e) => e.slug.includes(imageSlug))?.heroImageUrl ?? null;
}
