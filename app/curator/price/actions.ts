"use server";

import { eq, gte, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { getAuthUser } from "@/lib/supabase/server";
import { PACK_PRICING_CONFIG } from "@/lib/packPricing";

// "US$10", "US$0", "US$9.50" — matches the format enforced site-wide by the
// USD-only currency migration (CLAUDE.md). A typo here silently breaks that
// rule on the live pack/homepage pages, so it's rejected before it's saved.
const US_DOLLAR_DISPLAY = /^US\$\d+(\.\d{2})?$/;

export async function getEventsForPriceEditor() {
  const today = new Date().toISOString().split("T")[0];

  const rows = await db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      slug: sportingEvents.slug,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      earlyBirdDisplay: sportingEvents.earlyBirdDisplay,
      standardDisplay: sportingEvents.standardDisplay,
      pricingUpdatedAt: sportingEvents.pricingUpdatedAt,
      pricingUpdatedBy: sportingEvents.pricingUpdatedBy,
    })
    .from(sportingEvents)
    .where(gte(sportingEvents.endDate, today))
    .orderBy(asc(sportingEvents.name));

  // Only events with a real PACK_PRICING_CONFIG entry (env-var Dodo price
  // IDs) are actually sellable — a planned/building event with no product
  // yet has nothing to price. earlyBirdCutoff comes from that same
  // env-var-driven config, never from the curator page — the founder's
  // explicit call, 28 Aug 2026 (real checkout-pricing implications; see
  // memory project_curator_driven_pack_pricing_design.md).
  return rows
    .filter((r) => PACK_PRICING_CONFIG[r.slug])
    .map((r) => ({
      ...r,
      earlyBirdCutoff: PACK_PRICING_CONFIG[r.slug].earlyBirdCutoff,
    }));
}

export async function updateEventPackPricing(
  eventId: string,
  input: { earlyBirdDisplay: string; standardDisplay: string }
): Promise<{ success: true } | { error: string }> {
  const { user } = await getAuthUser();
  if (!user?.email) return { error: "Not signed in." };

  if (!US_DOLLAR_DISPLAY.test(input.earlyBirdDisplay)) {
    return { error: `Early-bird price must look like "US$10" — got "${input.earlyBirdDisplay}".` };
  }
  if (!US_DOLLAR_DISPLAY.test(input.standardDisplay)) {
    return { error: `Standard price must look like "US$15" — got "${input.standardDisplay}".` };
  }

  await db
    .update(sportingEvents)
    .set({
      earlyBirdDisplay: input.earlyBirdDisplay,
      standardDisplay: input.standardDisplay,
      pricingUpdatedAt: new Date(),
      pricingUpdatedBy: user.email,
    })
    .where(eq(sportingEvents.id, eventId));

  // Homepage is the only price-displaying page with a static revalidate
  // window (300s) — event-pack/experience pages read live on every request,
  // so they pick up the new value with no cache to clear.
  revalidatePath("/curator/price");
  revalidatePath("/");

  return { success: true };
}
