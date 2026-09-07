// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/WhereToEatSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: unlike some other events' Where to Eat spokes, French Open's
// free-tier content renders two linkedExperience cards ("what-to-eat-inside-
// roland-garros" and "everyday-parisian-eating-baguette-jambon-beurre") with
// no additional per-restaurant inline prose in the spoke file itself beyond
// the section intros — that write-up content lives in the experience rows,
// not here. Flagged below.

export const frenchOpenWhereToEatSpokeContent = {
  intro:
    "Roland-Garros food splits into two real questions: what to eat without leaving the grounds, and what Paris itself actually eats — a genuinely different, better answer than the tourist-restaurant version most visitors default to.",

  onTheGrounds: {
    label: "On the grounds",
    // FLAG: source renders the "what-to-eat-inside-roland-garros"
    // experience card here with no additional inline prose in the spoke
    // file itself.
  },

  whatParisiansActuallyEat: {
    label: "What Parisians actually eat",
    intro:
      "Skip the tourist-trap crêpe stand for a morning boulangerie stop instead — it's cheaper, better, and closer to how the city actually eats lunch.",
    // FLAG: source renders the "everyday-parisian-eating-baguette-jambon-
    // beurre" experience card here with no additional inline prose in the
    // spoke file itself.
  },

  bringingYourOwnFood: {
    label: "Bringing your own food",
    body:
      "Bringing your own food onto the grounds is explicitly permitted — a real way to manage cost across a long tournament day. Alcohol and sharp cutlery are the exceptions (see the Weather guide for the full bag-policy detail).",
  },

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book for a proper dinner",
      body:
        "La Grande Cascade or Le Pré Catelan for a genuine special-occasion night out, both in the Bois de Boulogne a short taxi from the venue — see the full Luxury Guide for the real comparison between them and Blanc. For anything less formal, the 16th arrondissement has genuine neighborhood restaurants around Auteuil worth walking to rather than settling for whatever's closest to the Métro exit.",
    },
    {
      label: "The one baguette worth a detour",
      body:
        "The 2026 Grand Prix de la Baguette winner was Fournil Didot in the 14th arrondissement — a genuine trek from Roland-Garros, but worth knowing about if chasing the officially \"best\" baguette in Paris matters to you. Closer to the venue, Boulangerie Patisserie à la Flûte Enchantée in Passy is a well-regarded, realistic stop on the way to or from a match day.",
    },
  ],

  sourcesFooter: "Sources: rolandgarros.com (on-grounds concessions), paris.fr (Grand Prix de la Baguette).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "what-to-eat-inside-roland-garros" (insideFood) — "On the grounds" section
//   - "everyday-parisian-eating-baguette-jambon-beurre" (everydayEating) —
//     "What Parisians actually eat" section
