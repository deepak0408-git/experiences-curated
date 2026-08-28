// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/WhereToEatSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.

export const atpFinalsWhereToEatSpokeContent = {
  intro:
    "Turin is the birthplace of the Slow Food movement, and that shows up directly in the city's food identity — this isn't generic \"Italian food,\" it's a specific, deep regional cuisine with its own pasta shapes, its own chocolate tradition, and a drinking culture (vermouth, aperitivo) that started here before it spread anywhere else in Italy. Agnolotti del plin and tajarin at Scannabue, Ristorante Consorzio, or Razzo. The original bicerin at Caffè Al Bicerin, since 1763. Vermouth and a proper aperitivo buffet — Turin invented the tradition in 1786. Gianduja chocolate from a real historic chocolatier, not a tourist-shop version.",

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "How we'd sequence one food day",
      body:
        "Start with Caffè Al Bicerin mid-morning, before the day's crowds build. Save aperitivo for early evening at a Piazza San Carlo café ahead of an evening session — it fits the tournament's own schedule naturally. Book Razzo specifically if you only have one proper dinner to spend on Piedmontese food during your trip — Scannabue or Consorzio if you want two more relaxed meals instead of one tasting-menu evening. Pick up gianduja as a portable souvenir rather than trying to fit a dedicated chocolate-shop visit into an already full day.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "atp-finals-piedmontese-dining" (piedmontese)
//   - "atp-finals-caffe-bicerin" (bicerin)
//   - "atp-finals-aperitivo-vermouth" (aperitivo)
//   - "atp-finals-gianduja-chocolate" (gianduja)
