// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/DayTripsSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Structural note (per source's own header comment): Roland-Garros sits
// inside Paris itself, so the usual "day trip to a nearby city" rule maps
// differently here — Versailles is the genuine outward day trip, while
// Village d'Auteuil and Montmartre are the two in-city neighborhood options
// for a shorter, no-travel-time rest day.

export const frenchOpenDayTripsSpokeContent = {
  intro:
    "With the tournament running two full weeks, there's real room to build a genuine non-match day into a longer trip — either a full outward day trip to Versailles, or a shorter, no-travel-time break in one of two very different Paris neighborhoods.",

  versailles: {
    label: "Versailles — a real day out",
    body:
      "RER C runs directly from central Paris to Versailles in 35-45 minutes, no change required. This is the genuine day-trip-outside-the-city option, since Roland-Garros sits inside Paris itself, unlike most events with a nearby-city day-trip anchor.",
    // FLAG: source renders the "versailles-day-trip" experience card here,
    // no additional inline prose beyond the intro above.
  },

  shorterBreakInParis: {
    label: "Or a shorter break inside Paris",
    body:
      "Village d'Auteuil sits a short walk from the venue itself — a genuine former village with hidden Art Nouveau architecture most Roland-Garros visitors never see. Montmartre is the opposite register entirely, a genuine cross-city trip to the hilltop neighborhood where modern art actually happened.",
    // FLAG: source renders two experience cards here (auteuil, montmartre),
    // no additional inline prose per neighborhood.
  },

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "When to take it",
      body:
        "An early-round weekday (rather than a weekend or a marquee second-week day) is the easiest day to give up — the Grounds Pass covers everything that matters on the days you are on-site, so missing one mid-tournament day costs the least. Avoid pulling a day around the finals weekend, when the tournament's best atmosphere is concentrated into a handful of specific days.",
    },
    {
      label: "Fitting Versailles into the trip",
      body:
        "Book Versailles timed-entry tickets in advance via en.chateauversailles.fr — slots genuinely sell out during May-June, which overlaps directly with the tournament. Plan to leave central Paris by mid-morning: the palace plus even a partial walk through the gardens is a genuine full day, and there's no realistic way to fit an afternoon session back at Roland-Garros on the same day.",
    },
  ],

  sourcesFooter: "Sources: en.chateauversailles.fr, RATP.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "versailles-day-trip" (versailles) — "Versailles — a real day out" section
//   - "village-dauteuil-neighborhood" (auteuil) — "Or a shorter break inside Paris" section
//   - "montmartre-neighborhood" (montmartre) — "Or a shorter break inside Paris" section
