import { db } from "@/lib/db";
import { plannerDestinationBands } from "@/schema/database";
import { eq } from "drizzle-orm";

// Local Travel and Food commentary for the Tradeoff Engine — same
// principle as the Flights advisory: neither line item has a dollar
// lever, but that doesn't mean no commentary. Short, curated 2-sentence
// notes researched from real published experience content, added 19 Jul
// 2026. Nullable — not every destination has this written yet (Abu Dhabi
// deferred to the production data pass).

export type TripCommentary = {
  localTravelNote: string | null;
  foodNote: string | null;
};

export async function getTripCommentary(destinationId: string): Promise<TripCommentary> {
  try {
    const [band] = await db
      .select({
        localTravelNote: plannerDestinationBands.localTravelNote,
        foodNote: plannerDestinationBands.foodNote,
      })
      .from(plannerDestinationBands)
      .where(eq(plannerDestinationBands.destinationId, destinationId));

    return {
      localTravelNote: band?.localTravelNote ?? null,
      foodNote: band?.foodNote ?? null,
    };
  } catch (err) {
    // Same defensive pattern as getPlannerEvents.ts / getTradeoffOptions.ts —
    // a transient DB blip (e.g. ECONNRESET) here must not crash the whole
    // Tradeoff panel; this is optional commentary, not required data. Caught
    // live 26 Jul 2026 — this was the one function in the tradeoff data
    // pipeline still missing the try/catch its siblings already had.
    console.error("[getTripCommentary] failed, returning no commentary", err);
    return { localTravelNote: null, foodNote: null };
  }
}
