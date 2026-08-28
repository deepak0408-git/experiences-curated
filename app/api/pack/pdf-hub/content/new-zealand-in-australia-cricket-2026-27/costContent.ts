// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/CostSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Genuinely different structure from every prior event: real seeded hotel
// data ONLY covers Melbourne (Boxing Day leg) — Perth/Adelaide/Sydney have
// zero plannerHotelTierCost rows as of 16 Aug 2026, a real, explicit
// founder-scoped gap, not an extraction omission. Only 3 profiles (Budget/
// Moderate/Splurge, no Luxury card here — Luxury lives in its own spoke).
// TRIP_NIGHTS = 3, hotels filtered by seasonalBand === "dec". Ticket tiers
// (tier1-3) are event-wide, not city-specific, so apply to any leg.

export const nzAustraliaCostSpokeContent = {
  intro:
    "This is a genuinely uneven trip to cost out — four cities, four different hotel markets, and one of them (Melbourne, Boxing Day week) is the single highest-demand hotel window of the whole series. We've costed Melbourne in full below as a representative example of what a leg of this trip runs, plus the real ticket-tier costs that apply to any of the four Tests, so you can multiply out whichever legs you're actually planning to attend.",

  profiles: [
    { label: "Budget", ticketTier: "tier1", hotelNote: "A basic, well-reviewed Melbourne hotel", ticketNote: "General Admission" },
    { label: "Moderate", ticketTier: "tier1", hotelNote: "A solid 3-4 star hotel, good tram/train access to the MCG", ticketNote: "General Admission" },
    { label: "Splurge", ticketTier: "tier2", hotelNote: "An upscale hotel with real amenities, walking distance to the CBD", ticketNote: "Outdoor Boxes, The Lounge" },
  ],

  otherCitiesNote: {
    label: "Perth, Adelaide, and Sydney — use Melbourne as your guide",
    body:
      "We've costed Melbourne in full above as a representative example of what a leg of this trip runs. If you're planning a Perth, Adelaide, or Sydney leg specifically, use those same hotel-tier ranges as a rough guide and adjust for each city's own market, plus the ticket-tier prices (they apply to every venue) and the Planner for a real flight-cost range from your city.",
  },

  flightsNote:
    "Flight cost genuinely depends on your route — a one-city trip to Melbourne is a very different flight budget from a full four-city Perth-Adelaide-Melbourne-Sydney itinerary, and the domestic legs between the four host cities are a real, separate cost on top of your international flight in. Tell the Planner where you're starting from and which cities you're actually visiting.",

  // Pro-gated verdict content, matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "If you can only pick one leg",
      body:
        "Melbourne's Boxing Day Test is the real answer for most first-time travellers — it's the single biggest date on the Southern Hemisphere cricket calendar, the atmosphere at the 'G' on day one alone justifies the trip, and it's the easiest leg to build a short, self-contained holiday around (a laneway-and-coffee city day, a Yarra Valley day trip, genuine December weather). Adelaide Oval is the pick if character matters more to you than scale — no other ground on this tour pairs a Test match with a cathedral spire in the same sightline. Sydney's Fourth Test in early January closes the series and tends to have the loosest, most end-of-summer atmosphere of the four; Perth as the opener is the pick only if you specifically want to be there for the very first ball of a brand-new era in this rivalry — the first-ever four-Test Trans-Tasman series.",
    },
    {
      label: "Booking timing that actually matters",
      body:
        "Melbourne hotel rates during Boxing Day week run measurably higher than the rest of December — this is the city's single busiest hotel window of the whole summer, not just a cricket-specific spike, since it overlaps with the post-Christmas domestic travel rush too. Book the Melbourne leg's accommodation earliest of all four cities, even if you're still deciding on the others.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug): hotels filtered by seasonalBand ===
// "dec", tickets tier1-3 (event-wide, not per-city).
