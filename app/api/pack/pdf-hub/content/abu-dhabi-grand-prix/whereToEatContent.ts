// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/WhereToEatSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const abuDhabiGpWhereToEatSpokeContent = {
  intro:
    "Yas Marina's own dining runs splurge-tier by design — this is the real range across the whole trip, from genuine fine dining on the marina to real, everyday local institutions in both Abu Dhabi and Dubai where a full meal costs a fraction of anything trackside.",

  splurge: {
    label: "Splurge — trackside fine dining",
  },

  casualMidRange: {
    label: "Casual to mid-range — the marina walk",
  },

  budget: {
    label: "Budget — real local institutions",
  },

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What to actually order",
      body:
        "At Garage, don't default to one menu — it runs as four distinct kitchen stations under one reservation: Meat Vault for prime Wagyu and USDA steaks, Nikkei House for Japanese-Peruvian dishes, Mezza Bar for Middle Eastern small plates, and Tart Van for dessert. Order across stations rather than settling into just one. Along the marina walk, Ishtar is the one worth timing deliberately — its live entertainment, including a belly dance show, is central to the venue rather than an occasional add-on, so confirm the night's show time when booking if catching the full performance matters. At Bait El Khetyar, the chicken and beef shawarma (roughly AED 10 and AED 11) are the real draw, alongside stuffed falafel and manakeesh — two people can eat well here for well under AED 150 total. At Al Mallah, take the outdoor seating on Al Dhiyafah Street specifically — it's part of the actual experience, not overflow seating, and the street-level people-watching is a real reason locals choose it.",
    },
    {
      label: "Reserving for race week specifically",
      body:
        "Garage is consistently one of the hardest reservations on Yas Island during Grand Prix weekend — book well ahead of race week rather than trying your luck with a walk-in, and request terrace seating specifically if a track view matters to you, since the venue's multiple kitchens mean not every table faces the circuit. Stars 'N' Bars, Ishtar, and Bar Du Port along the marina walk fill fastest in the two hours before and after each day's headline session — outside those windows, walk-in availability is genuinely realistic. If you want a late option after the Yasalam concerts or a late race-day evening, Al Ustad in Dubai stays open until 3:30am — most trackside splurge dining winds down long before then.\n\nThe real trade worth knowing: the marina scene is spectacular for atmosphere but genuinely expensive across the board. Bait El Khetyar and Al Mallah aren't backup options — they're a real, deliberate way to eat well for a fraction of the price on any evening you're not specifically chasing the marina view.",
    },
  ],

  sourcesFooter:
    "Sources: Google Maps ratings and reviews (Stars 'N' Bars, Bait El Khetyar), venue-published menus and hours (Garage, Ishtar, Al Mallah, Al Ustad).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "garage-w-abu-dhabi" (garage) — Splurge section
//   - "yas-marina-dining-walk" (diningWalk) — Casual to mid-range section
//   - "cheap-shawarma-abu-dhabi-dubai" (shawarma) — Budget section
