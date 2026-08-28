// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/WhereToEatSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const singaporeGpWhereToEatSpokeContent = {
  intro:
    "A hawker centre is Singapore's everyday food hall format — dozens of independent stalls, each usually specializing in one dish, sharing communal seating under one roof (or, for Satay Street, one closed-off stretch of road). It's the real, default way most Singaporeans actually eat out, not a tourist invention, and several sit close enough to Marina Bay Street Circuit to work as an actual pre or post-session stop. Ranked here by how honestly each one holds up against its own reputation, not just by name recognition — the most photogenic option and the most locally-recommended one aren't the same place.",

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd send you first",
      body:
        "After a night session specifically, Makansutra Gluttons Bay is the right call, it's built for exactly this rhythm, open till 2-3am — don't confuse it with Satay by the Bay, which closes hours earlier. For an authentic hawker meal earlier in the day, Maxwell Food Centre and Tian Tian beat Lau Pa Sat on genuine local recommendation, even though Lau Pa Sat's setting is more photogenic. If you do go to Lau Pa Sat's Satay Street, stalls 7 and 8 are worth trying first — a repeated tip in visitor reviews, though not one we've independently verified stall-by-stall.",
    },
  ],

  venueDetails: [
    { name: "Maxwell Food Centre", body: "Tian Tian's Michelin Bib Gourmand chicken rice — the hawker centre locals actually recommend over Lau Pa Sat, on genuine quality-for-price, not just atmosphere." },
    { name: "Bayfront hawkers", body: "Two distinct venues, different hours: Makansutra Gluttons Bay runs late (till 2-3am) for post-session eating, Satay by the Bay closes at 10pm and suits a daytime Gardens visit instead — don't mix the two up on race night." },
    { name: "Lau Pa Sat", body: "1894 cast-iron national monument, Satay Street runs till 3am, 5-10 min walk from the circuit. Genuinely the most photogenic of the three, but honestly the most tourist-priced — go for the setting and the satay, not for a bargain." },
  ],

  sourcesFooter:
    "Sources: Michelin Guide official listings (guide.michelin.com), Google Maps (live ratings, linked from each venue's own experience page), esplanade.com (Makansutra hours/stalls), gardensbythebay.com.sg (Satay by the Bay hours/stalls), laupasat.sg (history). Verified 7 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-lau-pa-sat" (lauPaSat)
//   - "singapore-gp-maxwell-food-centre" (maxwell)
//   - "singapore-gp-bayfront-hawkers" (bayfront)
