// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/WhereToEatSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const australianOpenWhereToEatSpokeContent = {
  intro:
    "Melbourne is Australia's food capital by reputation, and the Australian Open genuinely delivers on that reputation rather than falling back on generic stadium catering — Grand Slam Oval carries real Melbourne restaurant names, and the city itself is a short tram ride away for anyone with a rest day or a gap between sessions.",

  coffeeIntro:
    "Beyond the grounds, Melbourne's reputation as the city that built the modern flat white is real, not marketing — the café scene here genuinely earns the \"coffee capital\" claim Sydney disputes every year.",

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What's actually worth the queue on the grounds",
      body:
        "Grand Slam Oval's named restaurant stalls are worth prioritizing over the generic concession options scattered through the wider precinct — real Melbourne kitchens, not stadium catering contractors, and the quality gap is genuinely noticeable. Go early in your session window rather than right before a marquee match starts, since the best stalls draw real queues once a big match lets out.",
    },
    {
      label: "Fitting a coffee run into a match day",
      body:
        "If you're staying in East Melbourne or the CBD, a proper coffee stop before you head to Melbourne Park is genuinely realistic — most of the named laneway cafés are walkable from a CBD hotel and open well before gates do. Save a full CBD detour for a rest day rather than squeezing it into a match-day morning.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "grand-slam-oval-food-village" (foodVillage)
//   - "melbourne-coffee-food-culture-guide" (coffeeGuide)
