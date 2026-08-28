// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/HotelsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const bahrainGpHotelsSpokeContent = {
  intro:
    "Two-way decision: Kuala Lumpur or the airport. KL gives you the city, real dining and nightlife options, and a wider hotel selection; Sama-Sama at the airport keeps you a short hop from the circuit for a tight, circuit-focused trip.",

  klNeighborhood: {
    label: "Kuala Lumpur — KLCC / Bukit Bintang",
    body:
      "4 real hotels near KLCC/Bukit Bintang, all walkable to monorail/MRT: Mandarin Oriental, Banyan Tree, JW Marriott, Hotel Capitol.",
  },

  airbnbAlternative: {
    label: "Airbnb alternative — 3 neighborhoods",
    body:
      "Bukit Bintang/KLCC, Bangsar, and Chinatown/Petaling Street each have real transit-time tradeoffs worth checking before booking — see the specific times in the guide.",
  },

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd book",
      body:
        "Kuala Lumpur for almost everyone — the city, the food, the wider hotel selection are worth the extra transit time. Sama-Sama only makes sense for a tight, circuit-focused trip with no interest in the city itself.",
    },
  ],

  sourcesFooter: "Sources: rome2rio.com, klsentral.info, Airbnb listing data.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "staying-in-kuala-lumpur" (klGuide) — has per-hotel HotelBookingCard
//     components with real URLs: mandarinoriental.com, banyantree.com,
//     marriott.com, capitol.com.my
//   - "sama-sama-hotel" (samaSama) — samasamahotels.com
