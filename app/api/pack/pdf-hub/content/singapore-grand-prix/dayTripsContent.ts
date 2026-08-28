// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/DayTripsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const singaporeGpDayTripsSpokeContent = {
  intro:
    "Most Grand Prix cities force a trade-off between racing and sightseeing. Singapore's night-race format genuinely doesn't, sessions run into the evening, which leaves real daytime for the city itself. Sentosa is a genuine day trip, an actual island you travel to and spend hours on. Marina Bay Waterfront Walk and Gardens by the Bay are both a short walk or one MRT stop from the circuit, worth folding into the same day as a session rather than treating as separate outings.",

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "How we'd sequence it",
      body:
        "Do the Waterfront Walk on your first full day, before race sessions start, it doubles as real orientation for the geography you'll navigate all weekend. Save Sentosa for a day with a later session start, and time Gardens by the Bay's 7:45pm Garden Rhapsody show specifically on an evening you have a session, it's close enough to walk straight to the circuit afterward. Don't try to combine Universal Studios and a relaxed beach day in one Sentosa visit if you also have a session that evening, the park alone is a full day.",
    },
  ],

  sourcesFooter:
    "Sources: gardensbythebay.com.sg (Gardens hours, Garden Rhapsody times), sentosa.gov.sg, rome2rio.com, headout.com, thrillark.com (Sentosa transit and Universal Studios detail), marinabaysands.com, singaporeflyerticket.com, trawell.in, holidify.com (Waterfront Walk landmarks, Spectra show). Verified 3 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-gardens-by-the-bay" (gardens)
//   - "singapore-gp-sentosa" (sentosa)
//   - "singapore-gp-waterfront-walk" (waterfront)
