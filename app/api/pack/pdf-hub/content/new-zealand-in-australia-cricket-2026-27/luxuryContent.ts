// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/LuxurySpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased. Notable: only 3 of 4 cities have a hospitality product —
// Perth's genuine gap is stated honestly, not filled in, matching the
// source's own "we won't invent one" stance.

export const nzAustraliaLuxurySpokeContent = {
  intro:
    "Luxury on this tour is a stack of decisions across three different cities, not one single purchase — each of the three legs with real hospitality products (Melbourne, Adelaide, Sydney) offers a genuinely different kind of premium day, and Sydney specifically has a product no other ground on this tour can match.",

  perthGapNote: {
    label: "Perth — no dedicated hospitality product found",
    body:
      "Unlike Melbourne, Adelaide, and Sydney, Perth Stadium doesn't have a distinct, publicly-documented cricket hospitality tier separate from the venue's general rooftop tour experiences — we won't invent one. If a luxury day at the series opener matters to you, the closest real option is Perth Stadium's own guided rooftop tour, which is a stadium-experience product, not match-day hospitality.",
  },

  premiumHotelNote: {
    label: "Premium hotel — one real fact beyond the Hotels guide",
    body:
      "Melbourne's splurge-tier hotel options run genuinely elevated pricing during Boxing Day week specifically — this is the one leg of the tour where paying up for a splurge-tier room during the Test itself is a real, deliberate luxury decision, not just a marginal upgrade, given how much the city's own hotel demand spikes independent of cricket.",
  },

  // Pro-gated verdict content, matching LuxurySpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which of the three is actually worth it",
      body:
        "The SCG's Members Pavilion changeroom experience is the single most distinctive product across all four venues — a genuinely rare, capped-at-12-guests heritage experience nothing else on this tour comes close to. If you can only justify one splurge across the whole series, that's the one to chase, not the bigger-capacity Invincibles Lounge. For Boxing Day specifically, an MCG corporate box is the pick if you're a group of 8 or more and want a private space for the biggest single day of the tour — for 2-4 people, Adelaide Oval's Stadium Club offers a genuinely better view-to-price tradeoff, with the Hill and cathedral spire both in your eyeline.",
    },
    {
      label: "Real contacts and current pricing",
      body:
        "MCG corporate boxes: Dynamic Business Events, 1300 660 509 — real day-1-vs-day-3 pricing gap confirmed live, book earlier in the Test for better value. Adelaide Oval Stadium Club: The Golden Ticket, 0437 490 507 — live per-day pricing runs from roughly $350 down to $195 across the five days, so a mid-week day is genuinely better value than day one. SCG Luxury tiers are Enquire-Now only with no published pricing — see the SCG Luxury experience for the real contact details.",
    },
  ],

  sourcesFooter: "See the three hospitality experiences for full sourcing and current pricing per venue.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "mcg-corporate-boxes-boxing-day" (mcgBoxes)
//   - "adelaide-oval-stadium-club-deck" (adelaideClub)
//   - "scg-luxury-invincibles-lounge-members-pavilion" (scgLuxury)
