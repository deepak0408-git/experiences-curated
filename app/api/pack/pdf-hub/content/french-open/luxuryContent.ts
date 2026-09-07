// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/LuxurySpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased.
//
// Structural note: unlike US GP's Luxury spoke (both named hospitality
// tiers GATED, zero free-tier cards), French Open's free tier DOES render
// two free-tier experience cards (molitor hotel, luxuryDining) plus the
// off-venue tea prose — only the 3 hospitality-room price cards + the
// "hospitality" experience card sit inside {isUnlocked}. Confirmed by
// re-reading the source.
//
// The "packages" array (Le Pavillon / La Mezzanine / L'Orangerie) is real,
// static, hardcoded content in the source (not DB-computed) — extracted
// verbatim, including the literal € price-from strings, since the source
// itself hardcodes these rather than pulling from getSpokeData().

export const frenchOpenLuxurySpokeContent = {
  h1: "Three real hospitality rooms, a luxury stay, and where the trip goes off-venue",

  intro:
    "Luxury at Roland-Garros is a stack of decisions, not one purchase — where you stay and how you eat around the grounds matter as much as which hospitality room you book. The tournament runs official hospitality through Sodexo Live!, its sole sanctioned hospitality operator, across three genuinely different rooms — real cost and inclusions for each are below.",

  premiumTransit: {
    label: "Premium transit",
    body:
      "Multiple licensed operators run fixed-price chauffeur transfers between CDG or Orly and central Paris — typically from around €140 in a Mercedes E-Class, with flight tracking, meet-and-greet, and no surge pricing regardless of arrival time. Worth arranging specifically for a hospitality day or a finals weekend arrival, when you don't want a delayed RER or a taxi queue to be the thing that goes wrong.",
  },

  offVenueLuxury: {
    label: "Off-venue luxury",
    name: "Afternoon tea, Hôtel Plaza Athénée",
    googleRating: "4.6",
    googleReviewCount: "2,878",
    body:
      "Not a Roland-Garros tradition specifically — a genuine Paris luxury institution worth knowing about regardless. La Galerie serves French-style afternoon tea (pastries and confections rather than the British sandwiches-and-scones format), crafted by World Pastry Champion Angelo Musa, with a harpist accompanying each sitting. A real central-Paris alternative to a village restaurant on a rest day, from €64 per person.",
  },

  bookEarlyCallout: {
    label: "Book early — hospitality typically sells out well ahead",
    body:
      "Hospitality packages typically go on sale several months before the tournament and sell out before the event itself — finals weekend and the tournament's second week are the first to go. Book as soon as packages open, not once you've decided which days to attend.",
  },

  premiumStay: {
    label: "A premium stay",
    // DB-derived: molitor experience card rendered here (free tier).
  },

  luxuryDinner: {
    label: "A luxury dinner",
    // DB-derived: luxuryDining experience card rendered here (free tier).
  },

  // Pro-gated content, matching LuxurySpoke.tsx's own {isUnlocked && (...)}
  // block. The 3 hospitality-room price cards are static/hardcoded in the
  // source (not DB-computed).
  hospitalityRooms: [
    {
      name: "Le Pavillon",
      price: "from €350",
      detail:
        "A beach-house-styled dining room with a 500-square-metre terrace over the practice courts, built for a long, unhurried lunch between sessions. Doors 10am-5:30pm, premium Chatrier seating included.",
    },
    {
      name: "La Mezzanine",
      price: "from €380",
      detail:
        "A brighter, more informal lounge on L'Orangerie's first floor — screens showing live play, a steady rotation of canapés rather than a seated meal. The pick for staying mobile between matches.",
    },
    {
      name: "L'Orangerie — Category 1 / Category Gold",
      price: "from €430",
      detail:
        "L'Orangerie's own seating categories, both with premium Chatrier access and the full drinks/catering package built in — Category Gold sits closer to the court.",
    },
  ],

  verdicts: [
    {
      label: "Which room we'd pick",
      body:
        "Le Pavillon is the sharper choice if lunch itself is part of the point — a real seated meal with a view over the practice courts, unhurried, not catering dressed up as an event. La Mezzanine is the better call if staying mobile between matches matters more than a sit-down meal — canapés and screens rather than a table. L'Orangerie's Category Gold is the pick if a specific close seat on Chatrier is the actual priority over the room itself.",
    },
    {
      label: "A luxury day, sequenced",
      body:
        "Base yourself at Hôtel Molitor — the 10-minute walk matters more on a hospitality day, when you want a proper unwind in the hotel's own pools afterward rather than a Métro journey back into central Paris. Book Le Pré Catelan or La Grande Cascade (see the full Where to Eat guide) for the evening after a hospitality day, not the same lunch — stacking two long meals in one day undercuts both. The Plaza Athénée's afternoon tea is the sharper call for a rest day rather than a grounds day, ideally in central Paris rather than squeezed in around a match.",
    },
  ],

  sourcesFooter:
    "Sources: sodexolive-hospitality.com, sportstravelhospitality.com (hospitality tiers), transfeero.com (airport transfer pricing), dorchestercollection.com (Plaza Athénée afternoon tea).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for FREE-tier cards:
//   - "hotel-molitor-paris-luxury-stay" (molitor) — "A premium stay" section
//   - "french-open-luxury-dining-bois-de-boulogne" (luxuryDining) — "A luxury dinner" section
// - linkedExperiences lookup for a GATED card (inside isUnlocked, after the
//   3 hospitality-room price cards):
//   - "roland-garros-official-hospitality" (hospitality)
