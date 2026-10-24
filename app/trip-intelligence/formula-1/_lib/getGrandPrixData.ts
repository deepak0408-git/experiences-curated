import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { tripIntelligenceGrandPrixProfiles, tripIntelligenceFanInsights, sportingEvents, circuitSeatingProfile } from "@/schema/database";
import { eq, inArray } from "drizzle-orm";
import { buildCandidates } from "./buildCandidates";
import type { GrandPrixCandidate } from "./types";
import { CACHE_TAGS } from "@/lib/cacheTags";

// Uncached, unlike the other reads in this file — ratings get corrected
// directly in the DB (scripts or manual edits) with no code path to call
// revalidateTag/revalidatePath, so a 1-hour unstable_cache here served
// stale candidate data for up to an hour after every such edit. Root-caused
// 11 Oct 2026: a Spa C07/C08 rating fix was live in the DB but the results
// page kept recommending Australia because this cache hadn't expired yet.
// The 24-row trip_intelligence_grand_prix_profiles table is small and this
// query is cheap, so a plain uncached read is the correct trade — always
// fresh, no invalidation plumbing needed.
export async function getAllGrandPrixCandidates(): Promise<GrandPrixCandidate[]> {
  const rows = await db.select().from(tripIntelligenceGrandPrixProfiles);
  return buildCandidates(rows as never);
}

export interface GrandPrixDisplayInfo {
  sportingEventId: string;
  slug: string;
  name: string;
  sport: string;
  heroImageUrl: string | null;
  venueName: string | null;
  startDate: string;
  endDate: string;
  isEventGuideBuilt: boolean;
  hasTicketIntelligence: boolean;
}

// Same isBuilt formula Ticket Intelligence uses for its "Get the Event
// Guide" CTA gate (TicketIntelligenceSidebar.tsx / page.tsx).
function isEventGuideBuilt(packStatus: string, isHidden: boolean): boolean {
  return (packStatus === "live" || packStatus === "built_hidden") && !isHidden;
}

// unstable_cache serializes its return value through JSON internally, so a
// Map survives as a plain object on the way back out (or worse — this is
// what caused "displayInfoMap.get is not a function" at runtime, 10 Oct
// 2026). Cached functions return plain arrays; callers build the Map.
const getGrandPrixDisplayInfoCached = unstable_cache(
  async (sportingEventIds: string[]): Promise<GrandPrixDisplayInfo[]> => {
    const events = await db
      .select({
        id: sportingEvents.id,
        slug: sportingEvents.slug,
        name: sportingEvents.name,
        sport: sportingEvents.sport,
        heroImageUrl: sportingEvents.heroImageUrl,
        venueName: sportingEvents.venueName,
        startDate: sportingEvents.startDate,
        endDate: sportingEvents.endDate,
        packStatus: sportingEvents.packStatus,
        isHidden: sportingEvents.isHidden,
      })
      .from(sportingEvents)
      .where(inArray(sportingEvents.id, sportingEventIds));

    const seatingRows = await db
      .select({ sportingEventId: circuitSeatingProfile.sportingEventId })
      .from(circuitSeatingProfile)
      .where(inArray(circuitSeatingProfile.sportingEventId, sportingEventIds));
    const hasSeatingData = new Set(seatingRows.map((r) => r.sportingEventId));

    return events.map((e) => ({
      sportingEventId: e.id,
      slug: e.slug,
      name: e.name,
      sport: e.sport,
      heroImageUrl: e.heroImageUrl,
      venueName: e.venueName,
      startDate: e.startDate,
      endDate: e.endDate,
      isEventGuideBuilt: isEventGuideBuilt(e.packStatus, e.isHidden),
      hasTicketIntelligence: hasSeatingData.has(e.id),
    }));
  },
  ["trip-intelligence-display-info"],
  // tags: tagged + wired to revalidateTag 24 Oct 2026, closing the same gap
  // the "Uncached" comment above describes for getAllGrandPrixCandidates —
  // this function has the identical staleness risk and wasn't fixed at the
  // time (see feedback_unstable_cache_tags_and_revalidation memory).
  { revalidate: 3600, tags: [CACHE_TAGS.TRIP_INTELLIGENCE_F1, CACHE_TAGS.TICKET_INTELLIGENCE_F1] },
);

export async function getGrandPrixDisplayInfo(sportingEventIds: string[]): Promise<Map<string, GrandPrixDisplayInfo>> {
  const rows = await getGrandPrixDisplayInfoCached(sportingEventIds);
  return new Map(rows.map((r) => [r.sportingEventId, r]));
}

export interface FanInsightsData {
  experienceHighlights: string[];
  goodToKnow: string[];
  tradeOffs: string[];
  insiderTip: string | null;
}

const getFanInsightsCached = unstable_cache(
  async (sportingEventIds: string[]): Promise<Array<FanInsightsData & { sportingEventId: string }>> => {
    const rows = await db
      .select()
      .from(tripIntelligenceFanInsights)
      .where(inArray(tripIntelligenceFanInsights.sportingEventId, sportingEventIds));
    return rows
      .filter((r) => r.publishReady)
      .map((r) => ({
        sportingEventId: r.sportingEventId,
        experienceHighlights: r.experienceHighlights,
        goodToKnow: r.goodToKnow,
        tradeOffs: r.tradeOffs,
        insiderTip: r.insiderTip,
      }));
  },
  ["trip-intelligence-fan-insights"],
  { revalidate: 3600, tags: [CACHE_TAGS.TRIP_INTELLIGENCE_F1] },
);

export async function getFanInsights(sportingEventIds: string[]): Promise<Map<string, FanInsightsData>> {
  const rows = await getFanInsightsCached(sportingEventIds);
  return new Map(rows.map((r) => [r.sportingEventId, r]));
}
