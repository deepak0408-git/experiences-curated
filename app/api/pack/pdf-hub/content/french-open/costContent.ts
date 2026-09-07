// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/CostSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased. Nothing DB-computed
// is duplicated here; see the "DB-derived data" comment block at the bottom
// for what the PDF route needs to wire up itself via getSpokeData().
//
// TRIP_NIGHTS = 4 (a real 4-night tennis-trip length, not the 3-day F1
// weekend pattern). Flight range is Europe-only with Paris (same-city, seeded
// $0-$0) and Moscow (seeded $842-$2,232 — Russia-EU airspace closures forcing
// long connecting routes, next-highest Europe market is Milan at $135-$662)
// both excluded — founder decision 7 Sep 2026, same pattern as Wimbledon's
// London-specific outlier exclusion.

export const frenchOpenCostSpokeContent = {
  h1: "Real hotel, ticket, and daily-spend numbers — no estimates",
  eventName: "French Open",

  intro:
    "Roland-Garros runs the same two weeks every late May and early June, so there's no shoulder-season discount to chase here either. The real swing in cost comes from which court tier you buy into — Grounds Pass, Simonne-Mathieu, Philippe Chatrier, Suzanne Lenglen, or official hospitality — and whether you stay in the 16th arrondissement near the venue or take the cheaper trade-off across the Seine in Boulogne-Billancourt.",

  profiles: [
    { tier: "Budget", ticketTier: "tier1", ticketTierLabel: "Grounds Pass", hotelNote: "Boulogne-Billancourt short-let or budget hotel" },
    { tier: "Moderate", ticketTier: "tier2", ticketTierLabel: "Court Simonne-Mathieu ticket", hotelNote: "A mid-range hotel near the venue" },
    { tier: "Splurge", ticketTier: "tier3", ticketTierLabel: "Court Philippe-Chatrier / Suzanne-Lenglen ticket", hotelNote: "A well-located 4-star hotel" },
    { tier: "Luxury", ticketTier: "tier4", ticketTierLabel: "Official hospitality — see the Luxury Guide", hotelNote: "Hôtel Molitor or equivalent" },
  ],

  gettingAroundCheaply: {
    label: "Getting around, cheaply",
    // DB-derived: destinationBand.localTravelNote, rendered only if present.
  },

  moneySavingTrick: {
    label: "A local money-saving trick",
    // DB-derived: destinationBand.foodNote, rendered only if present.
  },

  bookingTimingTrap: {
    label: "The real booking-timing trap",
    body:
      "Roland-Garros tickets run on a ballot, not a first-come sale — registration for the general public draw typically opens in early December for the following May's tournament, with selection notified in February and a second, first-come-first-served sales phase in late March for Opening Week and outside courts. Missing the December ballot window means relying on that narrower March phase or the FFT's own resale marketplace — plan around the ballot date, not the tournament date.",
  },

  flightsNote:
    "Flying in from North America, Asia-Pacific, or further afield costs meaningfully more, so we're not folding every region into one misleading blended number here. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",

  // Pro-gated verdict content — matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block. Four separate labeled blocks, not one.
  verdicts: [
    {
      label: "Which ticket route we'd pick",
      body:
        "A Grounds Pass for most of your trip plus one Chatrier or Lenglen day for a marquee match is the sharpest combination for a first Roland-Garros. The Grounds Pass gets you a full day of tennis across the outside courts and Simonne-Mathieu — often with top seeds warming up close enough to hear the ball off the strings — and one reserved-seat day buys the real show-court atmosphere without paying for it every day. Don't plan a first trip around winning the December ballot for a specific session; enter it, but build your real plan around the March first-come-first-served phase and the official resale marketplace. Full route-by-route detail lives in the Ticket Guide.",
    },
    {
      label: "Time your trip to the ballot, not the tournament",
      body:
        "The two-phase ticket release changes what a budget trip actually looks like. If you miss the December ballot, the March first-come-first-served phase is weighted toward Opening Week and outside-court access for the second week — which is also the cheaper half of the tournament to attend, since the draw hasn't narrowed yet and demand for outside-court tickets is lower than for a specific show-court session. Building a budget trip around that March phase, rather than chasing a specific quarterfinal-or-later ticket, is the single biggest lever on total cost here.",
    },
    {
      label: "Day sessions are the better buy early on",
      body:
        "A Chatrier night session commits the whole evening to one pre-selected match, with no rotation through multiple courts the way a day session runs — so early in the tournament, before the draw has thinned, a day session is the better value on a pure cost-per-hour-of-tennis basis. That relationship flips from the quarterfinals onward, when a night session is reliably built around the best remaining matchup and worth paying up for. If budget is the priority and you're visiting in the first week, buy day sessions.",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Put the money into a hotel genuinely near the venue — Porte d'Auteuil or Michel-Ange–Molitor walking distance — if this is a dedicated tennis trip, since Roland-Garros has very few hotels this close and they sell out first. If the tournament is one day inside a longer Paris trip, Boulogne-Billancourt's short-let and Ibis options save real money for a short Métro ride, without giving up much. See the Where to Stay guide for named picks at every tier.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Cost-tier math: hotels/tickets/destinationBand/flights, TRIP_NIGHTS = 4,
//   Europe flight filter excluding originMarket "Paris" and "Moscow".
// - destinationBand.localTravelNote / .foodNote — rendered only if present.
// - No linkedExperiences cards rendered directly on this spoke.
