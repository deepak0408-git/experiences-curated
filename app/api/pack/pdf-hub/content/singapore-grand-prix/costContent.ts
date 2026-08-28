// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/CostSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Unlike Bahrain GP, Singapore has real, fully-seeded ticket-tier data
// alongside hotel/local-travel/food data — TRIP_NIGHTS = 3, Asia-Pacific
// flight filter excluding same-city Singapore (seeded $0-$0).

export const singaporeGpCostSpokeContent = {
  intro:
    "Singapore is one of the pricier stops on the F1 calendar, both for tickets and hotels, but it's also one of the most transparent: real per-tier ticket pricing is published, and the numbers below are built from that along with real hotel and local cost data, not estimates.",

  profiles: [
    { tier: "Budget", ticketTier: "tier1", ticketTierLabel: "Tier 1 Walkabout/grandstand ticket", hotelNote: "A basic, well-reviewed hotel near Chinatown" },
    { tier: "Moderate", ticketTier: "tier2", ticketTierLabel: "Tier 2 grandstand ticket", hotelNote: "A solid 3-4 star hotel, walkable or one MRT stop from the circuit" },
    { tier: "Splurge", ticketTier: "tier3", ticketTierLabel: "Tier 3 grandstand ticket", hotelNote: "An upscale hotel with real amenities near Marina Bay" },
    { tier: "Luxury", ticketTier: "tier4", ticketTierLabel: "Tier 4 hospitality ticket", hotelNote: "Trackside hotels — Ritz-Carlton, Pan Pacific, Swissotel" },
  ],

  ticketPricingBox: {
    label: "Ticket pricing — real 2026 tiers",
    body:
      "Sixteen named grandstands and two Walkabout tiers span this full range — the Ticket Guide breaks down exactly what each tier actually gets you.",
  },

  flightsNote:
    "Flying in from further afield — Europe, the Americas — costs meaningfully more, so we're not folding every region into one misleading blended number here. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",

  // Pro-gated verdict content, matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "For a genuine first Singapore GP on a real budget, Stamford Grandstand is the sharpest buy — a third of the premium pit-straight stands, with real racing at a corner that's caught out world champions. If the concerts matter as much as the race, Zone 4 Walkabout gets you both for less. The full stand-by-stand comparison lives in the Ticket Guide.",
      experienceSlug: "singapore-gp-stamford-grandstand",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "For a first Singapore GP, Chinatown is the honest value pick — two MRT stops from the circuit at roughly half Marina Bay's trackside rates, with real neighbourhood character instead of a generic budget strip. Splurge-tier only pays off if you actually want the circuit view from your room — otherwise the money is better spent on tickets or the concerts.",
      experienceSlugs: ["singapore-gp-trackside-hotels", "singapore-gp-chinatown-stay"],
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-stamford-grandstand" (stamford)
//   - "singapore-gp-trackside-hotels" (trackHotels)
//   - "singapore-gp-chinatown-stay" (chinatown)
