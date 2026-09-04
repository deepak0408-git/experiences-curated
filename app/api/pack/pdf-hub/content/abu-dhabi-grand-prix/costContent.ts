// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/CostSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. Nothing
// DB-computed is duplicated here; see the "DB-derived data" comment block
// at the bottom for what the PDF route needs to wire up itself via
// getSpokeData().
//
// TRIP_NIGHTS = 4 (matches the real 4-day Thu-Sun ticket structure this
// event sells — not Bahrain's 3). Flight range is Europe-only with Zurich
// excluded (source filters flights.region === "Europe" && f.originMarket
// !== "Zurich" — Zurich's $1,429 high end sits ~$244 above the
// next-highest market and was excluded per founder instruction 4 Sep 2026).

export const abuDhabiGpCostSpokeContent = {
  h1: "What a real Abu Dhabi GP weekend costs, by budget",
  eventName: "Abu Dhabi Grand Prix",

  intro:
    "Abu Dhabi is the calendar's season finale, and pricing reflects it — this isn't the cheapest race weekend on the F1 calendar. The numbers below cover a real full-trip estimate for the standard 4-day (Thursday-Sunday) ticket structure: hotel, food, local transport, and a grandstand ticket.",

  profiles: [
    {
      tier: "Budget",
      ticketTier: "tier1",
      ticketTierLabel: "Abu Dhabi Hill (GA)",
      hotelNote: "A well-reviewed budget stay, Yas Island or off-island",
    },
    {
      tier: "Moderate",
      ticketTier: "tier2",
      ticketTierLabel: "Marina/North/South Grandstands",
      hotelNote: "A solid 3-4 star hotel on or near Yas Island",
    },
    {
      tier: "Splurge",
      ticketTier: "tier3",
      ticketTierLabel: "West/Main Grandstand",
      hotelNote: "An upscale hotel with real amenities and a better location",
    },
    {
      tier: "Luxury",
      ticketTier: "tier4",
      ticketTierLabel: "Hero Seats to Paddock Club",
      hotelNote: "Ultra-luxury Yas Island or Dubai stays",
    },
  ],

  flightsNote:
    "Flying in from further afield — the Americas, or a longer-haul Asia-Pacific route — costs meaningfully more, and remember AUH isn't your only real option: DXB often carries better fares and more direct routes for many origins, at the cost of a longer ground transfer (see the Getting There guide). Tell the Planner where you're starting from for a real number on your actual route.",

  // Pro-gated verdict content — matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block. The source spoke embeds live ticket-tier
  // prices inline inside its verdict text (e.g. "{tier3 &&
  // formatMoneyRange(...)}") — the PDF route must recompute and
  // interpolate these the same way, not freeze a static figure here.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "For a genuine season-finale weekend, the West or Main Grandstand tier is the strongest all-round pick — real racing action or full ceremony, both covered. If the budget doesn't stretch that far, the mid-tier grandstands still put you in a reserved, covered seat for meaningfully less. Abu Dhabi Hill is the honest budget entry — genuinely no shame in it, especially for a first Abu Dhabi GP where the after-race concerts matter as much as the seat itself.",
      priceInterpolation: "tier1_tier2_tier3", // formatMoneyRange for tier1/2/3 embedded inline in source
    },
    {
      label: "Book early — this is the highest-demand weekend of the F1 season",
      body:
        "Buy only via the official F1 ticketing site — avoid resellers, a real risk at the calendar's single highest-demand round. Paddock Club and other top-tier hospitality has historically sold its best packages out months ahead — book that tier first if it's on your list at all.",
      priceInterpolation: "tier4", // 3-day package price
      officialTicketingUrl: "https://tickets.formula1.com/en/f1-3312-abu-dhabi",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "If Yas Island proximity matters to you, put the splurge into a genuine on-island stay (Crowne Plaza is the real mid-range answer, not the ultra-luxury W) rather than a marginal upgrade elsewhere — the walk-to-the-gates convenience across a 4-day weekend is worth more than most other single upgrades. If the trip is really about the wider UAE experience, a Dubai base (~90 minutes via the E11) opens up genuinely better value at every tier, especially at the budget end — see the Where to Stay guide for the full breakdown of both.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Cost-tier math: hotels/tickets/destinationBand/flights, TRIP_NIGHTS = 4,
//   Europe-only flight filter, excludedOrigins: ["Zurich"].
// - No linkedExperiences cards rendered directly on this spoke.
