// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/DayTripsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const australianOpenDayTripsSpokeContent = {
  intro:
    "The Australian Open runs across two weeks, and unlike a single-day fixture, that genuinely leaves room for a day away from tennis — or several short ones. What you choose depends entirely on how much time you actually have between sessions.",

  experienceSlugs: [
    "great-ocean-road-twelve-apostles-daytrip",
    "yarra-valley-melbourne-wine-daytrip",
    "st-kilda-beaches-melbourne-park",
    "federation-square-cbd-laneways",
    "melbourne-laneways-coffee-city-day",
  ],

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which one we'd pick, and when",
      body:
        "The Great Ocean Road is a genuine 12-hour commitment — it needs a full day with no session booked at all, so pick a day in the tournament's first week when the schedule is dense enough that missing one full day's play doesn't cost you a specific match you wanted to see. Yarra Valley is a shorter, more forgiving half-day-plus trip if you'd rather keep an evening session on the table. St Kilda, Federation Square, and a laneways-and-coffee CBD morning all work as genuine same-day additions — a sunset penguin colony, a street-art laneway walk, or an hour in Melbourne's famous coffee culture before or after a session, not a day trip that competes with the tennis at all.",
    },
    {
      label: "Booking around your tickets",
      body:
        "If you already know which days you're holding reserved seats for, book the Great Ocean Road or Yarra Valley tour on a day session you're skipping entirely, not around a night session — both trips return to Melbourne in the early evening, which leaves a night session genuinely reachable afterward if the timing works, but building your day-trip choice around protecting your best ticket is the safer plan.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards, see experienceSlugs above.
