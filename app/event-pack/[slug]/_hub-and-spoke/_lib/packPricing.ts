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
    earlyBirdDisplay: "US$10",
    standardDisplay: "US$15",
  },
  // Real Dodo product IDs wired 9 Aug 2026, early-bird price updated 24 Aug 2026:
  // Early Bird pdt_0NkzuzJ3sDd5pcevNllNC (US$3), Standard pdt_0Nkzv4p8BkXFgyrxga0aN (US$10).
  "shanghai-masters": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SHANGHAI_MASTERS_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_SHANGHAI_MASTERS_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SHANGHAI_MASTERS_EARLY_BIRD_CUTOFF ?? "2026-09-21",
    earlyBirdDisplay: "US$10",
    standardDisplay: "US$15",
  },
  // Real Dodo product IDs, same IDs the classic pack has used since launch
  // (see .env.local's "Wimbledon-prefixed aliases" block, added 14 Aug 2026
  // for this conversion) — the founder repriced these same 2 products in
  // the Dodo dashboard on 25 Aug 2026 (Standard pdt_0NgioFcIGNbl0KLr8Ppnw
  // now $10, Early Bird pdt_0NgioNYxUTkRSjpXdeD8o now $5, matching every
  // other event's $5/$10 pattern) — display strings and cutoff updated to
  // match. Cutoff moved to the real 2027 edition's window (28 Jun–11 Jul
  // 2027 tournament, day-before cutoff), replacing the stale 2026 date that
  // had made isEarlyBird permanently false.
  wimbledon: {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_WIMBLEDON_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_WIMBLEDON_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_WIMBLEDON_EARLY_BIRD_CUTOFF ?? "2027-06-27",
    earlyBirdDisplay: "US$10",
    standardDisplay: "US$15",
  },
  // Real Dodo Live Mode product IDs, confirmed by the founder 16 Aug 2026:
  // Early Bird pdt_0NlWmXdcXf1ZbtGSpHOo7 (US$5), Standard
  // pdt_0NlWmcXo9P8VQHymH6fgm (US$10). Cutoff set to 9 Nov 2026, the
  // founder's explicit choice (not the event's own 9 Dec start date).
  "new-zealand-in-australia-cricket-2026-27": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_NZ_AUSTRALIA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_NZ_AUSTRALIA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_NZ_AUSTRALIA_EARLY_BIRD_CUTOFF ?? "2026-11-09",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  // Real Dodo Live Mode product IDs, confirmed by the founder 24 Aug 2026:
  // Early Bird pdt_0Nm6PZ2x7Tzdmq5ef2tVT, Standard pdt_0Nm6PT3uFTugngmY1VcVN.
  // Cutoff 1 Dec 2026, the founder's explicit choice (~6 weeks before the 17
  // Jan 2027 tournament start, matching the Shanghai Masters/ATP Finals
  // early-bird-window pattern). Repriced by the founder 27 Aug 2026 in the
  // Dodo dashboard to US$10/US$15 — display strings below match the live
  // product prices as of that repricing, not the original US$5/US$10 this
  // comment previously (and briefly incorrectly) described.
  "australian-open": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUSTRALIAN_OPEN_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUSTRALIAN_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_AUSTRALIAN_OPEN_EARLY_BIRD_CUTOFF ?? "2026-12-01",
    earlyBirdDisplay: "US$10",
    standardDisplay: "US$15",
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
