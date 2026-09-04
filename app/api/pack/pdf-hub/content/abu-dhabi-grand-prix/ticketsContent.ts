// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/TicketsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. DB-computed
// values (live price bands via priceBandFor) are NOT duplicated here.
//
// Note: the source's unlocked grid shows only 3 cards (Hill/West/Main) —
// the Paddock Club card was deliberately removed from this spoke 4 Sep
// 2026 (its own back-link points to the Luxury Guide, not Tickets, so a
// clickable card here created a UX disconnect) and replaced with a plain
// link to the Luxury Guide. The "What each is actually like" comparison
// table still references paddockClub.whyItsSpecial as text (not a card),
// so its lookup slug is still needed below.

export const abuDhabiGpTicketsSpokeContent = {
  intro:
    "Yas Marina Circuit sells a genuine range, from a flexible general-admission ticket up through full pit-lane hospitality — this isn't a single grandstand-vs-grandstand choice. Every ticket covers the standard 4-day (Thursday-Sunday) weekend, and every tier — GA included — comes bundled with access to the Yasalam after-race concerts.",

  // "Four real tiers" comparison table — static hardcoded content in the
  // source (STANDS const array), extracted verbatim.
  standsTable: {
    label: "The 4 tiers, compared",
    rows: [
      {
        name: "Abu Dhabi Hill (GA)",
        slug: "abu-dhabi-hill-general-admission",
        tier: "tier1",
        shows: "Open zones around the circuit — flexible, move between vantage points",
        seating: "General admission, unreserved",
        exposure: "No cover — open zones",
      },
      {
        name: "West Grandstand",
        slug: "west-grandstand-yas-marina",
        tier: "tier3",
        shows: "Turns 6-7 — the circuit's main braking/overtaking zone",
        seating: "Reserved seat",
        exposure: "Fully covered",
      },
      {
        name: "Main Grandstand",
        slug: "main-grandstand-yas-marina",
        tier: "tier3",
        shows: "Grid, pit lane, start & podium — the whole arc of the event",
        seating: "Reserved seat",
        exposure: "Fully covered",
      },
      {
        name: "F1 Paddock Club & Hero Seats",
        slug: "f1-paddock-club-yas-marina",
        tier: "tier4",
        shows: "Pit-lane hospitality, garage access, pit-lane walks",
        seating: "Hospitality tier — table seating, not a fixed grandstand view",
        exposure: "Fully covered",
      },
    ],
  },

  circuitMapImage: "abu-dhabi-grand-prix-grandstand-map.jpg",

  buyOfficialOnlyWarning: {
    label: "Where to actually buy your ticket",
    body:
      "Buy directly from the official source first. Every F1 ticket ultimately traces back to the promoter, and buying direct means no markup and no risk of a fraudulent listing. If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1 Travel is a genuine authorized F1 ticket partner — named directly on Yas Marina Circuit's own official reseller list and confirmed as Singapore GP's own Authorised Partner, not a random resale site. It's rated 4.7 from over 10,000 reviews on Trustpilot, and has been in business since 2007. Steer clear of anything else claiming to be \"official\" without that kind of direct confirmation — ticket fraud is real at every high-demand Grand Prix, and a listing that looks legitimate isn't the same as one a circuit has actually named.",
    officialUrl: "https://tickets.formula1.com/en/f1-3312-abu-dhabi",
    p1TravelUrl: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-abu-dhabi",
  },

  pricingConfirmedNote: {
    label: "4-day pricing, confirmed",
    body:
      "Figures above are real 4-day pricing for this race, spanning the full grandstand range. Several mid-tier grandstands (Marina, North, South, North Straight) fall in the same price band as the tier2 range shown here — see the Venue Map guide for exactly which grandstand sits where on the circuit.",
  },

  luxuryGuideNote:
    "Paddock Club sits above all three of these as a genuinely different product — hospitality, not just a seat. It gets the full breakdown, including real booking timing and sell-out risk for the season finale, in the Luxury Guide.",

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block. Real price bands are computed inline via
  // priceBandFor(tierKey) in the source — PDF route must recompute, not
  // freeze a static number.
  verdicts: [
    {
      label: "Which tier we'd pick",
      body:
        "For a genuine first Abu Dhabi GP, West Grandstand is the sharpest pick — real, repeated racing at Turns 6-7, fully covered, and priced below Main Grandstand for a very similar quality of seat. If the start, podium, and ceremony matter more to you than the racing itself, Main Grandstand (same price band) is the right call instead — it's the one seat that covers the whole arc of the event in a single sightline. Abu Dhabi Hill is a genuinely good budget option here specifically because every tier, GA included, comes with the same Yasalam concert access — you're not trading away the headline entertainment by going cheap on the seat. We wouldn't spend the jump from GA straight into a mid-tier grandstand just for a marginally better daytime view; the real value step is moving into a genuinely covered stand (West or Main), not incrementally better GA positioning.",
      priceInterpolation: "tier1_tier3",
    },
    {
      label: "Where to actually buy",
      body:
        "Buy only through Formula1.com's official ticket portal — this is the calendar's highest-demand weekend as the season finale, and resale/social-media listings carry real risk. Tickets are digital-only, delivered via the Abu Dhabi GP Tickets app closer to race weekend.",
    },
  ],

  // "What each is actually like" table — pulls whyItsSpecial from each
  // linked experience live; not extracted as static text here.
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (unlocked grid, 3 cards only):
//   - "abu-dhabi-hill-general-admission" (hillStand)
//   - "west-grandstand-yas-marina" (westGrandstand)
//   - "main-grandstand-yas-marina" (mainGrandstand)
// - linkedExperiences lookup for whyItsSpecial text only (no card, "What
//   each is actually like" table row):
//   - "f1-paddock-club-yas-marina" (paddockClub)
