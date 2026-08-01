// Single source of truth for every event pack's real Dodo/Paddle price IDs,
// early-bird cutoff, and display prices — keyed by event slug. Previously
// duplicated: app/event-pack/[slug]/page.tsx had its own private
// PACK_PRICING, and app/experience/[slug]/page.tsx didn't use it at all —
// it hardcoded "wimbledon-2026" as a fallback event and read price from
// GLOBAL env vars (NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY, defaulting to a
// GBP figure) regardless of which event an experience actually belonged
// to. Fixed 1 Aug 2026 after this surfaced on a Bahrain GP (USD) experience
// page showing "£25" with no relationship to the real event or currency.
//
// currency is read from sportingEvents.packCurrency at the DB level (see
// getPackPricing below) — this table only holds price IDs/display strings/
// cutoff, never currency, so there is exactly one place currency can be
// wrong.
export const PACK_PRICING: Record<string, {
  earlyBirdPriceId: string;
  standardPriceId: string;
  earlyBirdCutoff: string;
  earlyBirdDisplay: string;
  standardDisplay: string;
}> = {
  "wimbledon-2026": {
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_EARLY_BIRD_CUTOFF ?? "2026-06-01",
    earlyBirdDisplay: process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "US$15",
    standardDisplay: process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "US$25",
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
    earlyBirdDisplay: "US$0",
    standardDisplay: "US$10",
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
    earlyBirdDisplay: "US$9",
    standardDisplay: "US$15",
  },
  "belgian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BELGIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BELGIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-10",
    earlyBirdDisplay: "US$15",
    standardDisplay: "US$25",
  },
  "hungarian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_HUNGARIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_HUNGARIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_HUNGARIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-17",
    earlyBirdDisplay: "US$0",
    standardDisplay: "US$7",
  },
  "open-championship-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_OPEN_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_OPEN_EARLY_BIRD_CUTOFF ?? "2026-07-06",
    earlyBirdDisplay: "US$15",
    standardDisplay: "US$25",
  },
  "italian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ITALIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ITALIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ITALIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-08-25",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  "bmw-pga-championship-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BMW_PGA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BMW_PGA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BMW_PGA_EARLY_BIRD_CUTOFF ?? "2026-09-03",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  "australia-in-south-africa-cricket-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUS_SA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_AUS_SA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_AUS_SA_EARLY_BIRD_CUTOFF ?? "2026-08-09",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
  "bahrain-grand-prix": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BAHRAIN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BAHRAIN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BAHRAIN_GP_EARLY_BIRD_CUTOFF ?? "2026-09-04",
    earlyBirdDisplay: "US$5",
    standardDisplay: "US$10",
  },
};

export function getPackPricing(slug: string) {
  const pricing = PACK_PRICING[slug];
  if (!pricing) return null;
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  return {
    ...pricing,
    isEarlyBird,
    priceDisplay: isEarlyBird ? pricing.earlyBirdDisplay : pricing.standardDisplay,
    dodoProductId: isEarlyBird ? pricing.earlyBirdPriceId : pricing.standardPriceId,
  };
}
