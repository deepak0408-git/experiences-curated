// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/CostSpoke.tsx), for the Full
// Pack PDF build. This is the prose half only — hand-copied out of the
// JSX, not paraphrased. Nothing DB-computed is duplicated here; see the
// "DB-derived data" comment block at the bottom for what the PDF route
// needs to wire up itself via getSpokeData().
//
// Note: this event is the relocated Bahrain Grand Prix, run at Sepang
// International Circuit near Kuala Lumpur — TRIP_NIGHTS = 3 (not
// Wimbledon's 4), and the flight-range filter is Asia-Pacific-only with
// NO exclusion list (unlike Wimbledon's Europe exclusion list). The PDF
// route must reproduce this, not reuse Wimbledon's cost-math constants.

export const bahrainGpCostSpokeContent = {
  h1: "How much does a Sepang weekend cost?",
  eventName: "Bahrain Grand Prix",

  bookingTimingCallout: {
    label: "Book your ticket early — demand here is genuinely unusual",
    body:
      "This is Sepang's first Formula 1 race since 2017 — buy only through the official F1 ticketing site, not a reseller.",
  },

  hotelAreaVerdict: {
    label: "Kuala Lumpur vs. the airport — the honest tradeoff",
    // Real content lives in HotelsSpoke.tsx's own verdict — CostSpoke
    // renders the klGuide/samaSama booking cards directly, no separate
    // inline prose block of its own beyond the profiles below.
  },

  profiles: [
    {
      tier: "Budget",
      ticketTier: "tier1",
      ticketTierLabel: "Hill Stand B/C/G",
      hotelNote: "A basic, well-reviewed hotel in Kuala Lumpur",
    },
    {
      tier: "Moderate",
      ticketTier: "tier2",
      ticketTierLabel: "K1/F Grandstand",
      hotelNote: "A solid 3-4 star hotel, good access to KLIA/Sepang transit",
    },
    {
      tier: "Splurge",
      ticketTier: "tier3",
      ticketTierLabel: "Main Grandstand",
      hotelNote: "An upscale hotel with real amenities and a better location",
    },
    {
      tier: "Luxury",
      ticketTier: "tier4",
      ticketTierLabel: "Paddock Club",
      hotelNote: "Top-tier Kuala Lumpur hotels — KLCC, Bukit Bintang",
    },
  ],

  flightsNote:
    "Flight costs are shown for Asia-Pacific departure points only — tell the Planner your real starting point for an accurate range.",

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // CostSpoke.tsx's own {isUnlocked && (...)} block. The source spoke
  // embeds live ticket-tier prices inline inside its verdict text (e.g.
  // "{tier3 && formatMoneyRange(...)}") — the PDF route must recompute
  // and interpolate these the same way, not freeze a static figure here.
  verdicts: [
    {
      label: "Where we'd base ourselves",
      body:
        "Kuala Lumpur for almost everyone — see the Hotels guide for the full reasoning. Sama-Sama at the airport only makes sense for a genuinely tight, circuit-focused trip with little interest in the city itself.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Cost-tier math: hotels/tickets/destinationBand/flights, TRIP_NIGHTS = 3,
//   Asia-Pacific-only flight filter, NO exclusion list.
// - linkedExperiences lookups for cards:
//   - "staying-in-kuala-lumpur" (klGuide)
//   - "sama-sama-hotel" (samaSama)
//   - "main-grandstand-sepang-start-finish" (mainGrandstand)
