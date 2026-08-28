// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/HotelsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const shanghaiMastersHotelsSpokeContent = {
  intro:
    "No hotel in Shanghai is walking distance from Qizhong — the venue sits 27-30km southwest in Minhang District, a 45-90 minute door-to-gate journey regardless of where you stay. That means choosing where to stay is really about which strategy suits your trip, not about venue proximity.",

  moderateHotelNote: {
    label: "Real prices, 4-star tier",
    body: "A solid 4-star hotel in central Shanghai runs a real, DB-computed range outside Golden Week — see the full Cost Guide for every tier.",
  },

  goldenWeekTrap: {
    label: "Golden Week pricing trap",
    body:
      "China's National Day Golden Week (1-7 October) runs immediately before this tournament starts on 5 October. Book your hotel before that window's demand spike, not after.",
  },

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book",
      body:
        "If you're planning a Suzhou or Hangzhou day trip, book central — near Hongqiao Railway Station specifically, since that's the primary departure point for both the Suzhou and Hangzhou high-speed lines. A near-venue Minhang hotel saves you time getting to Qizhong on match days but adds a genuine cross-city trip on your day-trip morning, which is the wrong tradeoff to make on your earliest, most time-pressured day. If a day trip isn't on your itinerary, the calculation flips: a near-venue Minhang stay cuts your daily shuttle time meaningfully across a multi-day tennis-only trip, at real savings over central hotel rates.",
    },
    {
      label: "Booking timing",
      body:
        "Book before National Day Golden Week (1-7 October) demand hits, not after — this isn't a soft recommendation, it's a real, dated pricing event that spikes rates and tightens availability across Shanghai in the exact week before this tournament starts.",
    },
  ],

  splurgeNote: {
    label: "Splurging? Here's where",
    // Rendered via generic <SpokeExperienceCard>, no inline description
    // text in the spoke file — see DB-derived data note below.
  },

  sourcesFooter:
    "Sources: answers.travelchinaguide.com, tripadvisor.com Shanghai Region forum, businesstravelnews.com, chinahighlights.com Golden Week guide. Hotel tier prices from planner_hotel_tier_cost, seeded 9 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "where-to-stay-shanghai-masters" (stayGuide)
//   - "luxury-shanghai-peninsula-bulgari" (luxuryGuide)
