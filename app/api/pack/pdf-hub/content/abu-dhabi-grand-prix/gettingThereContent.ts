// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/GettingThereSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. This spoke is status="public" with no {isUnlocked && (...)}
// block — no verdicts array.

export const abuDhabiGpGettingThereSpokeContent = {
  intro:
    "Abu Dhabi is one of the very few Grand Prix venues in the world where the honest advice is to check two different airports before booking flights — and which one is right for you depends entirely on where you're flying from.",

  auhRow: {
    label: "AUH — Abu Dhabi International",
    headline: "The world's closest international airport to any F1 venue",
    body:
      "Just 8km from Yas Marina Circuit — a taxi takes 10-15 minutes and costs around AED 112. If you're staying at any Yas Island hotel, a free shuttle runs from opposite Arrivals Door 3 (bring your hotel booking voucher to board).",
    facts: [
      { label: "Distance to circuit", value: "8km, ~15 min taxi" },
      { label: "Taxi fare", value: "~AED 112" },
    ],
  },

  dxbRow: {
    label: "DXB — Dubai International",
    body:
      "Roughly 77 miles and about 75 minutes' drive to Yas Marina via the E11. For many long-haul origins, DXB carries far more direct routes and better fares than AUH — the extra ground-transport time is a reasonable trade for a meaningfully better flight. Public transport (bus/metro) between DXB and the circuit runs 3.5+ hours — fine for a leisurely arrival day, not realistic for race day itself.",
    facts: [
      { label: "Distance to circuit", value: "~77 miles, ~75 min drive via E11" },
      { label: "Self-drive/taxi", value: "$13-20 (self-drive) to $100-130 (taxi/transfer)" },
      { label: "Public transport", value: "3.5+ hours — impractical for race day" },
    ],
  },

  honestFramingCallout: {
    label: "The honest framing",
    body:
      "AUH wins on pure convenience if your routing supports it. DXB wins on route choice and often on fare — check both before booking rather than defaulting to AUH just because it's closer to the circuit. For a lot of long-haul origins, the extra 75 minutes of ground transport from Dubai is a small price for a meaningfully better flight.",
  },

  appsRow: {
    label: "Essential apps for the trip",
    items: [
      { name: "Careem or Uber", body: "Both operate widely across Abu Dhabi and Dubai — genuinely useful for airport transfers and getting around either city, and typically cheaper than a street-hailed taxi for a comparable ride." },
      { name: "Abu Dhabi GP Tickets app", body: "Your ticket is digital-only and delivered here closer to race weekend — install it before you travel rather than scrambling at the gate." },
      { name: "Darb (Abu Dhabi toll/parking) or RTA Dubai", body: "If you're self-driving or renting a car at any point, the relevant emirate's official app handles toll top-ups and parking payment — worth having installed before you pick up a rental." },
    ],
  },

  sourcesFooter:
    "Sources: Abu Dhabi Airports (AUH distance/transfer data), Dubai Airports (DXB distance/transfer data), Google Maps drive-time estimates (E11 route).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "auh-vs-dxb-getting-there" (airportGuide)
