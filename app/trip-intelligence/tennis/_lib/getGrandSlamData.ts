import { db } from "@/lib/db";
import { tripIntelligenceTennisGrandSlamProfiles, sportingEvents } from "@/schema/database";
import { inArray } from "drizzle-orm";
import { buildCandidates } from "./buildCandidates";
import type { GrandSlamCandidate } from "./types";
import { hasTennisTicketIntelligence } from "@/app/ticket-intelligence/tennis/[slug]/_lib/getTennisOptionsData";

// Uncached — matches F1's getGrandPrixData.ts deliberate choice. Ratings
// get corrected directly in the DB with no revalidateTag/revalidatePath
// call anywhere, so a time-based cache here would reproduce F1's documented
// staleness incident (Spa ratings fixed in DB but results kept serving the
// old recommendation for up to an hour). This table has only 4 rows —
// a plain uncached read is the correct trade.
export async function getAllGrandSlamCandidates(): Promise<GrandSlamCandidate[]> {
  const rows = await db.select().from(tripIntelligenceTennisGrandSlamProfiles);
  return buildCandidates(rows as never);
}

export interface GrandSlamDisplayInfo {
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

// Same isBuilt formula as F1's getGrandPrixData.ts / Ticket Intelligence's
// "Get the Event Guide" CTA gate.
function isEventGuideBuilt(packStatus: string, isHidden: boolean): boolean {
  return (packStatus === "live" || packStatus === "built_hidden") && !isHidden;
}

// Uncached 24 Nov 2026 — same reasoning as getAllGrandPrixCandidates/
// getGrandPrixDisplayInfoCached in F1's getGrandPrixData.ts and
// getSpokeData.ts's removal: the Supabase egress limit this was added for
// is gone, and revalidateTag was proven unreliable in prod on the
// identical pattern there. Still returns a plain array; callers build the
// Map, same as before.
async function getGrandSlamDisplayInfoCached(sportingEventIds: string[]): Promise<GrandSlamDisplayInfo[]> {
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
        editionYear: sportingEvents.editionYear,
      })
      .from(sportingEvents)
      .where(inArray(sportingEvents.id, sportingEventIds));

    // Same fail-closed gate as the event-pack hub's "Find your seat" card
    // (hasTennisTicketIntelligence — options exist AND activated AND
    // ratified AND edition-year matched), not just row existence, so this
    // never points Trip Intelligence at a quiz that isn't actually live
    // yet. Slug-driven via eventId, no hardcoded per-event Set.
    const ticketIntelligenceFlags = await Promise.all(
      events.map((e) => hasTennisTicketIntelligence(e.id, e.editionYear))
    );

    return events.map((e, i) => ({
      sportingEventId: e.id,
      slug: e.slug,
      name: e.name,
      sport: e.sport,
      heroImageUrl: e.heroImageUrl,
      venueName: e.venueName,
      startDate: e.startDate,
      endDate: e.endDate,
      isEventGuideBuilt: isEventGuideBuilt(e.packStatus, e.isHidden),
      hasTicketIntelligence: ticketIntelligenceFlags[i],
    }));
}

export async function getGrandSlamDisplayInfo(sportingEventIds: string[]): Promise<Map<string, GrandSlamDisplayInfo>> {
  const rows = await getGrandSlamDisplayInfoCached(sportingEventIds);
  return new Map(rows.map((r) => [r.sportingEventId, r]));
}
