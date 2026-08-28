import { isFreeEventEnabled } from "./getSpokeData";
import { getPackPricing as getSharedPackPricing } from "@/lib/packPricing";

// Delegates to the shared lib/packPricing.ts (single source of truth for
// price IDs, cutoff, and DB-backed display strings) — this file used to
// keep its own duplicate PACK_PRICING table, collapsed into the shared one
// 28 Aug 2026 as part of the curator-driven pack pricing design (see memory
// project_curator_driven_pack_pricing_design.md). Only adds the
// hub-and-spoke-specific layer: free-access override and the event's real
// currency (from sportingEvents.packCurrency, passed in by the caller who
// already has `event` from getSpokeData — no currency guessing lives here).
export async function getPackPricing(slug: string, packCurrency: string | null) {
  const pricing = await getSharedPackPricing(slug);
  if (!pricing) return null;
  const freeAccessEnabled = isFreeEventEnabled(slug);
  return {
    ...pricing,
    freeAccessEnabled,
    currency: packCurrency ?? "USD",
    priceDisplay: freeAccessEnabled ? "Free" : pricing.priceDisplay,
  };
}
