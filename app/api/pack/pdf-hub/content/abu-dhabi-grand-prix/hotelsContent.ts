// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/HotelsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const abuDhabiGpHotelsSpokeContent = {
  intro:
    "Where to stay for Abu Dhabi's season finale is a genuine three-way call, not a default. Yas Island itself puts you within realistic walking distance of the circuit gates, at real luxury-to-mid-range price points. Central Abu Dhabi's Corniche gives you the actual city — restaurants, the waterfront, Abu Dhabi Mall — at the cost of a real daily commute. And Dubai, roughly 90 minutes away via the E11, opens up genuinely better value at every tier, especially budget, if the trip is really about a wider UAE holiday.",

  yasIsland: {
    label: "Yas Island — real walking distance to the gates",
  },

  centralAbuDhabi: {
    label: "Central Abu Dhabi — the city, at the cost of a commute",
  },

  dubai: {
    label: "Basing out of Dubai instead",
  },

  airbnbAlternative: {
    label: "Prefer an Airbnb or serviced apartment instead?",
    intro:
      "Hotels aren't the only option — Abu Dhabi and Dubai both have a real short-let market, and for a multi-night trip a self-catered apartment can genuinely beat a hotel room on space and price. If you're searching Airbnb or a serviced-apartment platform rather than booking a hotel directly, these are the areas worth filtering for:",
    neighborhoods: [
      {
        name: "Al Reem Island, Abu Dhabi",
        body:
          "A genuinely residential high-rise district a short drive from both downtown Abu Dhabi and Yas Island — a real mid-point base with a large serviced-apartment stock, at rates meaningfully below Yas Island's own hotels.",
      },
      {
        name: "Business Bay / Downtown Dubai",
        body:
          "The same area as Park Regis above — the largest Airbnb stock in Dubai, walkable to Burj Khalifa and Dubai Mall, roughly 90 minutes from Yas Marina via the E11.",
      },
      {
        name: "Al Barsha / Al Quoz, Dubai",
        body:
          "A genuinely cheaper, more residential alternative to Downtown/Marina, still on the Dubai Metro Red Line — the trade is character and proximity to Downtown's own attractions for a real price cut.",
      },
    ],
  },

  // Pro-gated verdict + booking-card content, matching HotelsSpoke.tsx's
  // own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which base we'd pick",
      body:
        "For a genuine first Abu Dhabi GP, Yas Island itself is the right call if your trip is fully race-focused — the walk-to-gates convenience across a 4-day weekend, plus the Thursday pit-lane walk perk if you stay at the W, is worth the premium over almost any other option. Crowne Plaza is the honest mid-range answer, not the W — real Yas Island proximity without ultra-luxury pricing, plus bundled theme-park access that pays off on a non-race day. If the trip is really about the wider UAE, base in Dubai instead: the value gap at every tier is real, and 90 minutes each way is a genuine but manageable commitment across a 4-day weekend, not a dealbreaker.",
    },
  ],

  bookingCards: {
    label: "Booking windows & timing",
    cards: [
      {
        name: "W Abu Dhabi",
        note:
          "Book directly via marriott.com specifically to confirm the circuit-facing tower — the two towers face genuinely different things, and race-week rates run well above standard nightly rates given demand. Book as early as the calendar allows.",
      },
      {
        name: "Crowne Plaza Yas Island",
        note:
          "Book via ihg.com or a major booking platform, and confirm circuit-facing vs. golf/Gulf-facing room type explicitly — not every room category includes the track view.",
      },
      {
        name: "Beach Rotana",
        note:
          "Book via rotana.com. Pad your race-day commute time honestly — the ~20-25 min drive to Yas Island extends meaningfully during race-day congestion around the circuit's approach roads.",
      },
      {
        name: "Atlantis The Royal",
        note:
          "Book via atlantis.com and confirm current race-weekend rates well ahead — December is one of Dubai's own peak tourism months on top of GP demand, and this specific property (not the older Atlantis The Palm next door) is the one with the Sky Pool.",
      },
    ],
  },

  sourcesFooter:
    "Sources: marriott.com, ihg.com, rotana.com, atlantis.com (official hotel booking channels and room-type confirmation), Google Maps drive-time estimates (Yas Island and Dubai commute figures).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "w-abu-dhabi-yas-island" (wAbuDhabi) — Yas Island section
//   - "crowne-plaza-yas-island" (crownePlaza) — Yas Island section
//   - "beach-rotana-corniche-abu-dhabi" (beachRotana) — Central Abu Dhabi section
//   - "atlantis-the-royal-dubai" (atlantis) — Dubai section
//   - "park-regis-business-bay-dubai" (parkRegis) — Dubai section
//   - "ibis-deira-creekside-dubai" (ibisDeira) — Dubai section
