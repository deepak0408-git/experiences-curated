// PILOT ONLY — proof-of-concept for the "Take it offline" PDF port to
// hub-and-spoke, scoped to one event (Wimbledon) and one spoke (Cost).
// This is the static-prose half of CostSpoke.tsx's content, hand-copied
// out of the JSX (app/event-pack/[slug]/_hub-and-spoke/spokes/wimbledon/
// CostSpoke.tsx) into plain data the PDF renderer can read without
// depending on any DOM/Tailwind markup. The DB-computed half (cost
// tables, flight ranges) is NOT duplicated here — the PDF route re-runs
// the same getSpokeData() + tripTotal() logic CostSpoke.tsx already uses,
// exactly like classic pack's PDF route does its own independent query
// rather than reusing PackView's.
//
// If this pattern is approved past the pilot, this file's shape (one
// module per event, prose keyed by spoke id) is the template for all
// 7 events × 12 spokes.

export const wimbledonCostSpokeContent = {
  intro:
    "Wimbledon is a genuinely fixed-cost trip in one sense — the Fortnight runs the same two weeks every year, so there's no shoulder-season discount to chase. The real swing in what you'll spend comes from two places: which of the three ticket routes you use (Queue, Ballot, or resale/hospitality), and whether you base yourself in SW19 or central London.",
  bookingTimingTrap: {
    label: "The real booking-timing trap",
    body:
      "The Fortnight is a fixed, short, high-demand window every year — unlike a destination with a shoulder season, there's no later date that gets cheaper. Book your hotel as soon as the following year's Championships dates are confirmed, not once you know which days you're going. SW19's own hotel stock is genuinely small, so it fills first; central London has more room to breathe but the Waterloo-adjacent properties this pack recommends still sell out for finals weekend.",
  },
  flightsNote:
    "Flying in from North America, Asia-Pacific, or further afield costs meaningfully more, so we're not folding every region into one misleading blended number here. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",
  crossLinks: {
    hotels: "See the full Where to Stay guide for the real strategic choice between SW19 and central London.",
    tickets: "See the full Ticket Guide for a real comparison of the Queue, the Ballot, and Debentures.",
  },
  // Pro-gated verdict content — only included in Full Pack mode, matching
  // CostSpoke.tsx's own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket route we'd pick",
      body:
        "The Grounds Pass alone — via the Queue — is a genuinely great first-timer day: it gets you onto the outer courts with no ballot luck required, and a resale ticket to a Show Court after 3pm is often the single best-value upgrade of the trip. The Ballot is worth entering every year regardless (it's free), but don't plan a first Wimbledon trip around winning it — the odds are long and you won't know until the previous September. Debentures and hospitality are the right call only if you want a guaranteed Centre Court seat on a specific day and can absorb the price without blinking.",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Put the money into the Village over central London if this is a genuine Wimbledon trip, not a one-day detour from a longer London stay — SW19 gives you the atmosphere and the 15-minute walk to the gates that central London can't. If Wimbledon really is one day inside a longer London trip, central London near Waterloo keeps the same fast 21-minute train without giving up a central base.",
    },
  ],
};
