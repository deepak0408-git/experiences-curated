// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/DayTripsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: the source spoke's closing line ("For the exact hour-by-hour
// version of this... see the Trip Schedule") is a cross-link sentence that
// only makes sense on the web — per skill §5, drop this from the PDF, don't
// carry it over as an orphaned floating sentence.

export const lasVegasGpDayTripsSpokeContent = {
  h1: "Two real ways to see Nevada beyond the Strip's neon",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Race weekend runs entirely on the Strip, but Las Vegas sits inside a genuinely dramatic desert landscape — both of these are real half-day trips, not novelty detours, and both are less than 45 minutes from the circuit.",

  // 2 experience cards, generic <SpokeExperienceCard>, no inline copy beyond
  // the card itself:
  // - "las-vegas-gp-red-rock-canyon" (redRock)
  // - "las-vegas-gp-hoover-dam" (hooverDam)

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which day we'd actually build this into",
      body:
        "Both trips fit best on the day before practice starts, or a genuine rest morning if your ticket only covers Friday and Saturday — neither needs a full day, so don't sacrifice a session to fit one in. Red Rock Canyon requires a Recreation.gov timed-entry reservation for the Scenic Drive between 8am and 5pm through the entire November race window — book that slot before you land, not on the morning of.",
    },
    {
      label: "Neither requires a rental car if you're on a schedule",
      body:
        "A guided tour with hotel pickup covers both destinations without the reservation logistics of driving yourself — a real option if race-week road closures make you wary of driving anywhere near the Strip on your own.",
    },
  ],

  // Cross-link sentence dropped from PDF per skill §5 (web-only,
  // "See the Trip Schedule" — orphaned/contextless in a static PDF):
  // "For the exact hour-by-hour version of this, sequenced against real
  // race session times, see the Trip Schedule."
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "las-vegas-gp-red-rock-canyon" (redRock)
//   - "las-vegas-gp-hoover-dam" (hooverDam)
