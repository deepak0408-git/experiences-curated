import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";

// Single source of truth for every event pack's real Dodo/Paddle price IDs
// and early-bird cutoff, keyed by event slug. Previously duplicated across
// 3 files (this table, the hub-and-spoke pack's own copy, and app/page.tsx's
// HOMEPAGE_PRICE_BY_EVENT) — collapsed into one here 28 Aug 2026 as part of
// the curator-driven pack pricing design (see memory
// project_curator_driven_pack_pricing_design.md). The hub-and-spoke pack's
// packPricing.ts now delegates to getPackPricing() below instead of keeping
// its own copy of this table.
//
// Display prices (earlyBirdDisplay/standardDisplay) are NOT in this table —
// they live on sportingEvents.earlyBirdDisplay/standardDisplay, curator-
// editable via /curator/price, since a founder repricing in the Dodo
// dashboard was going stale here with no warning (incident 13 Jul 2026,
// Italian GP/BMW PGA). earlyBirdCutoff deliberately stays here (env-var-
// driven, not curator-editable) — it gates which real Dodo product ID gets
// charged at checkout, not just which string displays, so the founder chose
// to keep it change-controlled via Vercel env vars rather than a curator UI.
// currency is read from sportingEvents.packCurrency by callers — this table
// never holds currency, so there's exactly one place it can be wrong.
export const PACK_PRICING_CONFIG: Record<string, {
  earlyBirdPriceId: string;
  standardPriceId: string;
  earlyBirdCutoff: string;
}> = {
  "wimbledon": {
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_WIMBLEDON_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_WIMBLEDON_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_WIMBLEDON_EARLY_BIRD_CUTOFF ?? "2027-06-27",
  },
  "us-open-2026": {
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_US_OPEN_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_US_OPEN_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_US_OPEN_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_US_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_US_OPEN_EARLY_BIRD_CUTOFF ?? "2026-08-01",
  },
  "india-in-england-cricket-2026": {
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_CRICKET_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CRICKET_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_CRICKET_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CRICKET_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_CRICKET_EARLY_BIRD_CUTOFF ?? "2026-06-15",
  },
  "belgian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BELGIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BELGIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-10",
  },
  "hungarian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_HUNGARIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_HUNGARIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_HUNGARIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-17",
  },
  "open-championship-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_OPEN_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_OPEN_EARLY_BIRD_CUTOFF ?? "2026-07-06",
  },
  "italian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ITALIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ITALIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ITALIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-08-25",
  },
  "bmw-pga-championship-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BMW_PGA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BMW_PGA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BMW_PGA_EARLY_BIRD_CUTOFF ?? "2026-09-03",
  },
  "australia-in-south-africa-cricket-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUS_SA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUS_SA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_AUS_SA_EARLY_BIRD_CUTOFF ?? "2026-08-09",
  },
  "bahrain-grand-prix": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BAHRAIN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BAHRAIN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BAHRAIN_GP_EARLY_BIRD_CUTOFF ?? "2026-09-04",
  },
  // Merged in from the hub-and-spoke pack's own packPricing.ts, 28 Aug 2026
  // — these 5 events previously only existed in that duplicate table.
  "singapore-grand-prix": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SINGAPORE_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SINGAPORE_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SINGAPORE_GP_EARLY_BIRD_CUTOFF ?? "2026-09-01",
  },
  "atp-finals": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ATP_FINALS_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ATP_FINALS_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ATP_FINALS_EARLY_BIRD_CUTOFF ?? "2026-10-18",
  },
  "shanghai-masters": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SHANGHAI_MASTERS_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SHANGHAI_MASTERS_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SHANGHAI_MASTERS_EARLY_BIRD_CUTOFF ?? "2026-09-21",
  },
  "new-zealand-in-australia-cricket-2026-27": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_NZ_AUSTRALIA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_NZ_AUSTRALIA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_NZ_AUSTRALIA_EARLY_BIRD_CUTOFF ?? "2026-11-09",
  },
  "australian-open": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUSTRALIAN_OPEN_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUSTRALIAN_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_AUSTRALIAN_OPEN_EARLY_BIRD_CUTOFF ?? "2026-12-01",
  },
};

// Last-resort fallback if a slug is in PACK_PRICING_CONFIG but its
// sporting_events row hasn't been backfilled with real display strings yet
// (should only happen for a brand-new event pack before its first
// /curator/price save). Never silently used for an existing, priced event.
const FALLBACK_DISPLAY = { earlyBird: "US$10", standard: "US$15" };

export async function getPackPricing(slug: string) {
  const config = PACK_PRICING_CONFIG[slug];
  if (!config) return null;

  const [event] = await db
    .select({
      earlyBirdDisplay: sportingEvents.earlyBirdDisplay,
      standardDisplay: sportingEvents.standardDisplay,
      earlyBirdCutoff: sportingEvents.earlyBirdCutoff,
    })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  const earlyBirdDisplay = event?.earlyBirdDisplay ?? FALLBACK_DISPLAY.earlyBird;
  const standardDisplay = event?.standardDisplay ?? FALLBACK_DISPLAY.standard;
  // DB value (curator-set via /curator/price) wins if present; otherwise
  // falls back to PACK_PRICING_CONFIG's env-var-driven value — resolved live
  // from process.env every call, never a copied/hardcoded date (see memory
  // project_curator_driven_pack_pricing_design.md — no backfill was done on
  // purpose, this fallback chain is the only source until a curator saves).
  const earlyBirdCutoff = event?.earlyBirdCutoff ?? config.earlyBirdCutoff;
  const isEarlyBird = new Date() < new Date(earlyBirdCutoff);

  return {
    ...config,
    earlyBirdDisplay,
    standardDisplay,
    earlyBirdCutoff,
    isEarlyBird,
    priceDisplay: isEarlyBird ? earlyBirdDisplay : standardDisplay,
    dodoProductId: isEarlyBird ? config.earlyBirdPriceId : config.standardPriceId,
  };
}
