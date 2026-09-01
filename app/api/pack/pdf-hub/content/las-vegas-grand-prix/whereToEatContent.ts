// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/WhereToEatSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const lasVegasGpWhereToEatSpokeContent = {
  h1: "A fine-dining weekend and a locals' weekend, ten minutes apart",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Las Vegas gives you two genuinely different dining weekends depending on where you eat. The Strip runs some of the best-credentialed restaurants in the world, minutes from the circuit. Fremont Street, ten minutes downtown, runs on a completely different food economy — where locals actually eat, at a fraction of Strip prices.",

  // 2 experience cards, generic <SpokeExperienceCard>, no inline copy beyond
  // the card itself:
  // - "las-vegas-gp-bellagio-caesars-dining" (bellagioCaesars) — fine dining (Le Cirque, Restaurant Guy Savoy)
  // - "las-vegas-gp-fremont-downtown-dining" (fremontDining) — Fremont Street / downtown dining (Le Thai)

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "How we'd actually plan the two nights",
      body:
        "Book Le Cirque or Restaurant Guy Savoy for a night without a session immediately after — qualifying night or the evening before the race — since both are genuine multi-course experiences, not quick pre-race meals. Save the Fremont Street trip for Thursday or Friday, when the Strip's own merchandise and race-week crowds haven't peaked yet and a downtown detour is easiest to fit in.",
    },
    {
      label: "Book Strip restaurants weeks ahead for race weekend",
      body:
        "Both Le Cirque and Restaurant Guy Savoy see genuine demand spikes from F1 visitors specifically during race weekend — reservations that would be easy to get on a normal week can book out. Le Thai on Fremont Street doesn't take reservations for smaller parties, so plan for a possible wait on weekend nights instead.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "las-vegas-gp-bellagio-caesars-dining" (bellagioCaesars)
//   - "las-vegas-gp-fremont-downtown-dining" (fremontDining)
