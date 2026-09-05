// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/CostSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
// Nothing DB-computed is duplicated here; see the "DB-derived data" comment
// block at the bottom for what the PDF route needs to wire up itself via
// getSpokeData().
//
// TRIP_NIGHTS = 3 (matches the real 3-day Fri-Sun ticket structure this
// event sells). Flight range is North America-only with Toronto,
// Vancouver, and Montreal excluded (source filters flights.region ===
// "North America" && !CANADIAN_MARKETS.includes(f.originMarket) — per
// founder instruction 5 Sep 2026, scoped to domestic US markets since
// that's this event's single largest real fan-travel base; Toronto alone
// would add $1,199 to the high end, nearly $400 above Boston, the next-
// highest genuinely domestic market).

export const usGpCostSpokeContent = {
  h1: "What a real Austin GP weekend costs, by budget",
  eventName: "United States Grand Prix",

  intro:
    "The numbers below cover a real full-trip estimate for the standard 3-day (Friday-Sunday) ticket structure: hotel, food, local transport, and a grandstand ticket.",

  profiles: [
    {
      tier: "Budget",
      ticketTier: "tier1",
      ticketTierLabel: "General Admission",
      hotelNote: "A well-reviewed budget stay, Downtown or South Congress",
    },
    {
      tier: "Moderate",
      ticketTier: "tier2",
      ticketTierLabel: "Turn 4/9/12/15/19 Grandstand",
      hotelNote: "A solid 3-4 star hotel Downtown or on South Congress",
    },
    {
      tier: "Splurge",
      ticketTier: "tier3",
      ticketTierLabel: "Turn 1/Main Grandstand",
      hotelNote: "An upscale hotel with real amenities and a better location",
    },
    {
      tier: "Luxury",
      ticketTier: "tier4",
      ticketTierLabel: "F1 Experiences Hospitality",
      hotelNote: "Ultra-luxury Austin stays",
    },
  ],

  flightsNote:
    "Flying in from Canada or further afield — Europe, Asia-Pacific, or South America — costs meaningfully more, and Austin-Bergstrom (AUS) is the only realistic airport for this trip; there's no useful secondary hub the way some other GP weekends have. Tell the Planner where you're starting from for a real number on your actual route.",

  // Pro-gated verdict content — matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block. The source spoke embeds live ticket-tier
  // prices inline inside its verdict text (e.g. "{tier2 &&
  // formatMoneyRange(...)}") — the PDF route must recompute and
  // interpolate these the same way, not freeze a static figure here.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "For a genuine first Austin GP, the mid-tier grandstands (3-day ticket price) are the strongest all-round pick — Turn 15's stadium section alone puts five corners in one sightline, and every tier here, GA included, comes bundled with the same Germania Insurance Super Stage concert access. If the budget stretches further, Turn 1 or Main Grandstand (3-day ticket price) trades a corner's drama for the full grid-to-podium arc. General Admission (3-day ticket price) is a real, legitimate way to do your first COTA weekend on a budget. The full grandstand-by-grandstand comparison lives in the Ticket Guide.",
        priceInterpolation: "tier1_tier2_tier3", // formatMoneyRange for tier1/tier2/tier3 embedded inline in source
    },
    {
      label: "Buy official, watch the popular stands",
      body:
        "Buy only via the official F1 ticketing site first — Turn 1 and the stadium-section stands are genuinely popular and can sell through their best rows early. F1 Experiences hospitality (from 3-day package price) is a separate product entirely — see the Luxury Guide for the real booking mechanics.",
      priceInterpolation: "tier4", // 3-day package price
      officialTicketingUrl: "https://tickets.formula1.com/en/f1-3320-united-states",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Downtown puts you closest to the Sixth Street/Rainey Street nightlife and a short rideshare from COTA; South Congress trades a few minutes of travel time for genuine Austin character and generally better value at the same star rating. See the Where to Stay guide for the full breakdown of both.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Cost-tier math: hotels/tickets/destinationBand/flights, TRIP_NIGHTS = 3,
//   North America flight filter with CANADIAN_MARKETS = ["Toronto",
//   "Vancouver", "Montreal"] excluded.
// - No linkedExperiences cards rendered directly on this spoke.
