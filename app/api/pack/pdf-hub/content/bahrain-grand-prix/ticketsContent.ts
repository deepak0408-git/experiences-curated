// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/TicketsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. DB-computed
// values (live price bands via priceBandFor) are NOT duplicated here.

export const bahrainGpTicketsSpokeContent = {
  // "4 named stands" comparison table — static hardcoded content in the
  // source (STANDS const array), extracted verbatim.
  standsTable: {
    label: "The 4 grandstands, compared",
    rows: [
      {
        name: "Main Grandstand",
        slug: "main-grandstand-sepang-start-finish",
        tier: "tier3",
        shows: "Start/finish straight, pit lane, podium",
        seating: "Reserved, covered",
        exposure: "Fully covered",
      },
      {
        name: "K1 Grandstand",
        slug: "k1-grandstand-sepang-turn-1",
        tier: "tier2",
        shows: "Turn 1 braking zone and overtakes",
        seating: "Reserved, covered",
        exposure: "Fully covered",
      },
      {
        name: "Grandstand F",
        slug: "grandstand-f-sepang-panoramic",
        tier: "tier2",
        shows: "Panoramic view across multiple corners",
        seating: "Reserved, covered",
        exposure: "Fully covered",
      },
      {
        name: "Hill Stand C2",
        slug: "hill-stand-c2-sepang-general-admission",
        tier: "tier1",
        shows: "General admission hillside viewing",
        seating: "General admission",
        exposure: "Partial canopy only",
      },
    ],
  },

  circuitMapImage: "bahrain-grand-prix-grandstand-map.jpg",

  buyOfficialOnlyWarning: {
    label: "Buy only through the official channel",
    body:
      "Official F1 ticketing for this race: tickets.formula1.com/en/f1-83069-bahrain-in-malaysia. Don't buy from resellers.",
  },

  k1BlockTip: {
    label: "K1 block-selection tip",
    body:
      "Middle blocks at K1 Grandstand can lose the Turn 2 sightline — check the specific block before booking, not just the stand name.",
  },

  // "What each is actually like" table — pulls whyItsSpecial from each
  // linked experience live; not extracted as static text here.

  // Pro-gated verdict content — matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block. Real price bands are computed inline via
  // priceBandFor(tierKey) in the source — PDF route must recompute, not
  // freeze a static number.
  verdicts: [
    {
      label: "Which stand we'd pick",
      body:
        "Main Grandstand for first-timers — full race visibility, covered, and close to facilities. K1 Grandstand if racing/overtakes matter more to you than the podium moment. Hill Stand C2 is the honest budget pick — general admission, partial cover only, but a real way into your first Sepang race weekend without the reserved-seat price.",
      priceInterpolation: "tier3", // formatMoneyRange(tier3) embedded inline in source
    },
  ],
};
