// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Real factual columns sourced from singaporegp.sg official grandstand
// pages, all 16 stands, plus oversteer48.com independent section reviews —
// this table is static hardcoded content in the source (STANDS const),
// extracted verbatim, not DB-computed. Note this list intentionally does
// NOT map to the Cost spoke's tier1-4 planner data — flagged in the source
// itself as an unreconciled naming mismatch, carried through as-is here.

export const singaporeGpTicketsSpokeContent = {
  intro:
    "Sixteen named grandstands and two Walkabout tiers span Marina Bay Street Circuit, from S$608 to S$2,498 for three days. They're built around genuinely different ideas of what's worth watching, not just different price points for the same experience.",

  standsTable: {
    label: "Side by side",
    rows: [
      { name: "Turn 1", shows: "Start-line braking from 290km/h into Turns 1-3", seating: "Reserved (A2-A9, book A3-A6 for real sightlines)", exposure: "Uncovered", priceBand: "S$1,698 (3-day)" },
      { name: "Stamford", shows: "Turn 7 — bumpy braking zone, real overtaking history", seating: "Reserved (A1-A7)", exposure: "Uncovered", priceBand: "S$608 (3-day) — cheapest grandstand" },
      { name: "Padang", shows: "Turn 9-10 straight — weak racing view, strong concert proximity", seating: "Reserved (A/B sections)", exposure: "Uncovered", priceBand: "S$738 (3-day)" },
      { name: "Super Pit", shows: "Race start, lap-one jostling into Turns 1-3", seating: "Reserved", exposure: "Uncovered", priceBand: "S$2,498 (3-day) — priciest grandstand" },
      { name: "Pit", shows: "Race start straight — where most overtaking happens off the line", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,798 (3-day)" },
      { name: "Turn 2", shows: "Unrivalled view of all 20 cars into the first three corners off the line", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,798 (3-day)" },
      { name: "Pit Exit", shows: "Cars accelerating back onto the circuit after pit stops", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,698 (3-day)" },
      { name: "Raffles", shows: "Turn 5 area, near the Padang and Esplanade", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,208 (3-day)" },
      { name: "Bay", shows: "Turns 18-19 — one of the biggest stands on the F1 calendar (27,000 seats), cars diving through tight, wall-lined corners before the final straight", seating: "Reserved", exposure: "Uncovered", priceBand: "Not separately listed on singaporegp.sg — may be sold under a different name (Marina Bay/Bayfront) in 2026, confirm before booking" },
      { name: "Marina Bay", shows: "Turns 18-19 from a different angle, Singapore Flyer lit up behind the track", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,798 (3-day)" },
      { name: "Bayfront", shows: "Turns 16-18 — braking out of a high-speed straight, run past the Flyer", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,428 (3-day)" },
      { name: "Promenade", shows: "Turns 16-18 — braking out of a high-speed straight, run past the Flyer", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,428 (3-day)" },
      { name: "Skyline", shows: "Turns 17-18, right before pit entry — where drivers are most likely to make a mistake under pressure", seating: "Reserved", exposure: "Uncovered", priceBand: "S$1,568 (3-day)" },
      { name: "Republic", shows: "Turn 5's kink into the first DRS zone — includes a free Singapore Flyer ride", seating: "Reserved", exposure: "Uncovered", priceBand: "S$988 (3-day)" },
      { name: "Connaught", shows: "Turn 14 — a tight DRS-zone corner with genuine wheel-to-wheel racing", seating: "Reserved", exposure: "Uncovered", priceBand: "S$738 (3-day)" },
      { name: "Empress", shows: "Turns 11-12 — peak braking across the Anderson Bridge", seating: "Reserved", exposure: "Uncovered", priceBand: "S$738 (3-day)" },
      { name: "Zone 4 Walkabout", shows: "Standing room, roams Zone 4 viewing platforms — includes Padang Stage concerts", seating: "Standing", exposure: "Uncovered", priceBand: "S$198-548" },
      { name: "Premier Walkabout", shows: "Standing room, roams all four zones", seating: "Standing", exposure: "Uncovered", priceBand: "S$298-728" },
    ],
  },

  buyOfficialOnlyWarning: {
    label: "Buy only through official channels",
    body:
      "Buy via tickets.formula1.com or singaporegp.sg only — most 3-day grandstands and Sunday-inclusive tickets have historically sold out well before race week, so don't wait to decide once you know your tier.",
  },

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block. "What each is actually like" table pulls
  // whyItsSpecial from each linked experience live — not extracted here.
  verdicts: [
    {
      label: "Which stand we'd pick",
      body:
        "For a genuine first Singapore GP, Stamford is the right call for pure value — real racing at a corner that's caught out world champions, for a third of the top tier's price. If proximity to the start matters more, Turn 1's sections A3-A6 give the closest thing to a start-line seat on the circuit. Padang is the honest exception: buy it for the Padang Stage concerts, not the racing, its view of Turns 9-10 is genuinely weak. If the concerts matter as much as the race, Zone 4 Walkabout gets you both for the lowest price at the event.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-turn1-grandstand" (turn1)
//   - "singapore-gp-stamford-grandstand" (stamford)
//   - "singapore-gp-padang-grandstand" (padang)
//   - "singapore-gp-zone4-walkabout" (walkabout)
//   - "singapore-gp-ticket-guide" (ticketGuide)
