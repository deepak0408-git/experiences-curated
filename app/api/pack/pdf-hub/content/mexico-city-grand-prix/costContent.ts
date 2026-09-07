// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/CostSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
// Nothing DB-computed is duplicated here; see the "DB-derived data" comment
// block at the bottom for what the PDF route needs to wire up itself via
// getSpokeData().
//
// TRIP_NIGHTS = 3 (matches the real 3-day Fri-Sun ticket structure this
// event sells). Flight range is North America-wide with NO exclusions —
// unlike US GP, Mexico City GP is a genuine international fly-in
// destination, so the source applies no market exclusions (see source
// comment at CostSpoke.tsx line 63-67).

export const mexicoCityGpCostSpokeContent = {
  h1: "What a real Mexico City GP weekend costs, by budget",
  eventName: "Mexico City Grand Prix",

  intro:
    "The numbers below cover a real full-trip estimate for the standard 3-day (Friday-Sunday) ticket structure: hotel, food, local transport, and a grandstand ticket.",

  profiles: [
    { tier: "Budget", ticketTier: "tier1", ticketTierLabel: "General Admission", hotelNote: "A well-reviewed budget stay in Roma Norte or Condesa" },
    { tier: "Moderate", ticketTier: "tier2", ticketTierLabel: "Grandstand 15/14/5A", hotelNote: "A solid 3-4 star hotel in Roma Norte, Condesa, or Polanco" },
    { tier: "Splurge", ticketTier: "tier3", ticketTierLabel: "Main Grandstand / 10 / 11", hotelNote: "An upscale hotel with real amenities and a better location" },
    { tier: "Luxury", ticketTier: "tier4", ticketTierLabel: "Paddock Club / House 44", hotelNote: "Ultra-luxury Polanco or Roma Norte stays" },
  ],

  flightsNote:
    "Flying in from Europe, Asia-Pacific, South America, or Africa costs meaningfully more — Mexico City International (MEX) is the arrival airport for this trip. Tell the Planner where you're starting from for a real number on your actual route.",

  bookingTimingCallout: {
    label: "Buy official, book early — this year specifically",
    body:
      "Buy only via the official F1 ticketing site first — this race has genuinely sold out within a single day of tickets going on sale in recent seasons. Paddock Club and House 44 at F1 Paddock Club™ (from 3-day package price) are a separate hospitality product entirely — see the Luxury Guide for the real booking mechanics.",
  },

  crossLinks: {
    hotels: "Where to Stay guide",
    tickets: "Ticket Guide",
  },

  // Pro-gated verdict content — matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block. Source embeds live ticket-tier prices
  // inline (e.g. "{tier3 && formatMoneyRange(...)}") — the PDF route must
  // recompute and interpolate these the same way, not freeze a static
  // figure here.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "For a genuine first Mexico City GP, Main Grandstand or Grandstand 10/11 (3-day ticket price) are the strongest all-round pick — closest to the main straight and pit lane, with the best sightlines on the circuit. Foro Sol (Grandstands 14/15, 3-day ticket price) trades sightline quality for the loudest, most stadium-like atmosphere on the calendar and the podium ceremony. General Admission (3-day ticket price) is a real, legitimate way to do your first Mexico City GP weekend on a budget — you lose a reserved seat, not the atmosphere. The full grandstand-by-grandstand comparison lives in the Ticket Guide.",
      priceInterpolation: "tier1_tier2_tier3",
    },
    {
      label: "Buy official, book early — this year specifically",
      body:
        "Buy only via the official F1 ticketing site first — this race has genuinely sold out within a single day of tickets going on sale in recent seasons. Paddock Club and House 44 at F1 Paddock Club™ (from 3-day package price) are a separate hospitality product entirely — see the Luxury Guide for the real booking mechanics.",
      priceInterpolation: "tier4",
      officialTicketingUrl: "https://tickets.formula1.com/en/f1-4861-mexico",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Roma Norte is the right default for a genuine first Mexico City GP — walkable, food-forward, and the neighborhood most first-timers end up recommending to the next first-timer. Condesa trades a little of that energy for a quieter, park-adjacent pace; Polanco is the polished, secure option, at the cost of being furthest from the circuit. Book earlier than usual this year specifically — race weekend lands directly on Día de Muertos, one of the busiest tourism weekends in the city's calendar. See the Where to Stay guide for the full breakdown of all three.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Cost-tier math: hotels/tickets/destinationBand/flights, TRIP_NIGHTS = 3,
//   North America flight filter, NO excluded origins (real fly-in market,
//   unlike US GP's domestic-only scoping).
// - No linkedExperiences cards rendered directly on this spoke.
