// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/CostSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// TRIP_NIGHTS = 4. Real, genuinely unusual Luxury-profile computation:
// Melbourne's seeded hotel data has no "luxury" tier row, so the source
// reuses the splurge hotel's HIGH end (not full low-high range) for both
// ends of the Luxury profile's hotel component, paired with AO Reserve
// Week 2 "from" pricing converted AUD->USD at 0.70152 (US$1,017-1,753) —
// not a seeded planner ticket tier. This is a real, deliberate, founder-
// directed exception (27 Aug 2026), not an extraction error — flagged
// here, not silently normalized to the standard per-tier pattern. Flight
// range uses a specific East/South Asia city cluster, not a blanket
// "Asia-Pacific" region filter (Sydney short-hop and Doha/Dubai long-haul
// both excluded as real but misleadingly wide outliers).

export const australianOpenCostSpokeContent = {
  intro:
    "Melbourne runs cheaper than Sydney on most day-to-day spend, and the Australian Open itself has one of the most accessible entry-level ticket prices of any Grand Slam — a grounds pass costs a fraction of a reserved seat. The real swing in this trip's cost comes from two places: which ticket tier you buy, and how far into the tournament's two weeks you're there for, since finals-week pricing climbs sharply as the draw narrows.",

  profiles: [
    { label: "Budget", ticketTier: "tier1", hotelNote: "A basic central hotel", ticketNote: "Grounds Pass" },
    { label: "Moderate", ticketTier: "tier2", hotelNote: "A solid 4-star hotel", ticketNote: "Grandstand ticket" },
    { label: "Splurge", ticketTier: "tier3", hotelNote: "An upper-tier hotel", ticketNote: "Show Court Reserved seat" },
  ],

  // Real, deliberate exception — see header comment. Not a seeded ticket
  // tier; a fixed USD figure converted from AO Reserve's own AUD pricing.
  luxuryProfile: {
    label: "Luxury",
    hotelNote: "A luxury hotel",
    ticketNote: "AO Reserve, Week 2 (from)",
    ticketLowUsd: 1017,
    ticketHighUsd: 1753,
    usesHotelHighEndOnly: true,
  },

  flightsNote:
    "Sydney is a short domestic hop (well under US$250 round-trip), and Gulf hubs like Doha and Dubai run closer to US$2,100-2,600 — both real, just different enough that folding them into the number above would be misleading. Flying in from Europe, the Americas, or Africa costs meaningfully more too. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",

  flightRangeNote:
    "round-trip, economy, from East or South Asia (Tokyo, Seoul, Shanghai, Singapore, Mumbai, and similar).",

  // Pro-gated verdict content, matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "A Ground Pass for most of your trip, plus one Grandstand or Show Court Reserved seat for a specific match you actually want to see, is the sharpest combination for a first Australian Open — the grounds pass alone gets you a full day of outside-court tennis, often with top-20 players warming up close enough to hear, and a single reserved seat gets you the real arena atmosphere without paying for it every day. Prices climb hard as the draw narrows: a reserved seat is cheapest in the first week, and the Show Court tier especially is worth timing for a specific round rather than buying blind for \"whichever day.\"",
    },
    {
      label: "The cheapest week most people skip",
      body:
        "Opening Week (11-16 Jan) runs a separate, dramatically cheaper Ground Pass — AU$10, against AU$49 for the main-draw early-bird rate — covering qualifying matches and open practice at the National Tennis Centre. If your trip has any flexibility at all, arriving during Opening Week and staying through the first few days of the main draw stretches your budget further than committing every day to main-draw pricing.",
    },
    {
      label: "Day vs. night sessions — the cost actually flips",
      body:
        "Most first-timers assume night sessions cost more across the board. They don't. In the early rounds, a Rod Laver Arena or Margaret Court Arena night ticket is typically priced below the equivalent day session, since a marquee match isn't guaranteed that early. That relationship flips hard from the quarterfinals onward, when night sessions are reliably built around the tournament's biggest remaining names and carry a real premium over a day ticket for the same round. If budget is the priority, an early-week night session is often the better buy than the equivalent day session.",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Put the money into proximity to Melbourne Park over anything else — East Melbourne puts you a genuine walk from the gates, which matters more here than in most host cities because Melbourne's January weather can swing 15-20°C in a single day, and a short walk back to a hotel room beats a longer tram ride if a session gets interrupted or the heat spikes.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "where-to-stay-melbourne-boxing-day" (stayGuide)
