import { isFreeEventEnabled } from "./getSpokeData";

// Same per-event PACK_PRICING pattern as the classic pack
// (app/event-pack/[slug]/page.tsx, ~line 324) — env-var-driven Dodo price
// IDs, keyed by event slug. Shared between HubPage.tsx and SpokeShell.tsx
// so every spoke's own CTA can offer real checkout, not just a link back
// to the hub. Added 1 Aug 2026 alongside real purchase-gating for the
// hub-and-spoke format.
export const PACK_PRICING: Record<string, { earlyBirdPriceId: string; standardPriceId: string; earlyBirdCutoff: string; earlyBirdDisplay: string; standardDisplay: string }> = {
  "bahrain-grand-prix": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BAHRAIN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BAHRAIN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BAHRAIN_GP_EARLY_BIRD_CUTOFF ?? "2026-09-04",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  "singapore-grand-prix": {
    // Real Dodo Live Mode product IDs — env-var only, no hardcoded fallback
    // (removed 4 Aug 2026, see feedback_ask_dodo_ids_upfront memory). Set in
    // .env.local for dev and must also be set in Vercel for production.
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SINGAPORE_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SINGAPORE_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SINGAPORE_GP_EARLY_BIRD_CUTOFF ?? "2026-09-01",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  "atp-finals": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ATP_FINALS_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ATP_FINALS_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ATP_FINALS_EARLY_BIRD_CUTOFF ?? "2026-10-18",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  // Real Dodo product IDs wired 9 Aug 2026: Early Bird pdt_0NkzuzJ3sDd5pcevNllNC
  // (US$5), Standard pdt_0Nkzv4p8BkXFgyrxga0aN (US$10).
  "shanghai-masters": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SHANGHAI_MASTERS_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SHANGHAI_MASTERS_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SHANGHAI_MASTERS_EARLY_BIRD_CUTOFF ?? "2026-09-21",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
};

// freeAccessEnabled mirrors the classic pack's exact behaviour (page.tsx,
// ~line 621): FREE_EVENT_SLUGS overrides priceDisplay to "Free" and hides
// checkout entirely, regardless of login state. Missing here until 1 Aug
// 2026 — HubPage/SpokeShell only checked FREE_EVENT_SLUGS inside
// getPurchaseStatus (which requires a logged-in user), so an anonymous
// visitor to a free-listed event still saw the real price and a live
// checkout button.
//
// packCurrency is the real currency from sportingEvents.packCurrency (the
// DB, not a hardcoded map) — passed in by the caller, who already has
// `event` from getSpokeData. No currency guessing lives in this file.
export function getPackPricing(slug: string, packCurrency: string | null) {
  const pricing = PACK_PRICING[slug];
  if (!pricing) return null;
  const freeAccessEnabled = isFreeEventEnabled(slug);
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  return {
    ...pricing,
    isEarlyBird,
    freeAccessEnabled,
    currency: packCurrency ?? "USD",
    priceDisplay: freeAccessEnabled ? "Free" : isEarlyBird ? pricing.earlyBirdDisplay : pricing.standardDisplay,
    dodoProductId: isEarlyBird ? pricing.earlyBirdPriceId : pricing.standardPriceId,
  };
}
