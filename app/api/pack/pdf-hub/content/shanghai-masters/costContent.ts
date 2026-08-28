// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/CostSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased. DB-computed
// values are NOT duplicated here — TRIP_NIGHTS = 4, Asia-Pacific flight
// filter excluding Shanghai (same-city, seeded $0-$0), Doha, and Dubai
// (tagged Asia-Pacific but geographically Middle East — curator decision,
// 10 Aug 2026).

export const shanghaiMastersCostSpokeContent = {
  intro:
    "Shanghai is a genuinely mid-priced major Asian host city — cheaper than Tokyo or Singapore on daily spend, pricier than most of Southeast Asia. The real swing in this trip's cost comes from two places: your ticket tier, and whether you book before or after China's National Day Golden Week (1-7 October) drives a real, dated demand spike right before the tournament starts.",

  profiles: [
    { tier: "Budget", ticketTier: "tier1", ticketTierLabel: "Grounds Pass", hotelNote: "A basic central hotel" },
    { tier: "Moderate", ticketTier: "tier2", ticketTierLabel: "Grandstand ticket", hotelNote: "A solid 4-star hotel" },
    { tier: "Splurge", ticketTier: "tier3", ticketTierLabel: "Center Court ticket", hotelNote: "An upper-tier 4-star hotel" },
    { tier: "Luxury", ticketTier: "tier4", ticketTierLabel: "ATP House Hospitality — see the Luxury Guide", hotelNote: "Shanghai's top hotels" },
  ],

  goldenWeekTrap: {
    label: "Golden Week pricing trap",
    body:
      "China's National Day Golden Week runs 1-7 October — immediately before this tournament starts on 5 October. Hotel prices across Shanghai spike and availability tightens in that exact window, then normalize once the holiday ends. Book your hotel before Golden Week demand kicks in, not after.",
  },

  flightsNote:
    "Flying in from Europe, the Americas, or Africa costs meaningfully more, so we're not folding every region into one misleading blended number here. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",

  crossLinks: {
    hotels: "See the full Where to Stay guide for the real strategic choice between central Shanghai and near-venue Minhang.",
  },

  // Pro-gated verdict content, matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "The Grounds Pass alone is a real way to spend a full day with top-20 players — it covers Court 17's practice sessions, which can put two or three ranked players within a few hours of each other. The jump to a Grandstand ticket is worth it for one marquee session, not every day of your trip; Center Court climbs steeply as the draw narrows, so it's the sharpest buy either early (including 16 October, the Federer exhibition date) or for one specific day you want the best seat for a top match, not for every session.",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Put the money into a central Shanghai base over anything closer to Qizhong — the venue sits 27-30km out in Minhang, so proximity buys you a shorter shuttle ride, not a walkable venue, and central Shanghai gives you the real city for the two-thirds of your trip you're not at a match.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "where-to-stay-shanghai-masters" (stayGuide)
