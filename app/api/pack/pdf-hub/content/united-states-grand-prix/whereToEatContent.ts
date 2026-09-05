// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/WhereToEatSpoke.tsx), for
// the Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: unlike Abu Dhabi's Where to Eat spoke (per-tier prose written
// directly in the content module for splurge/casual/budget), US GP's
// free-tier content renders two linkedExperience cards ("us-gp-franklin-
// barbecue" and "us-gp-bbq-beyond-franklin") with no additional per-
// restaurant inline prose in the spoke file itself — that write-up content
// lives in the experience rows, not here. Flagged below.

export const usGpWhereToEatSpokeContent = {
  intro:
    "Austin's barbecue scene is genuinely one of the best in the country, and it goes deeper than the one restaurant everyone's heard of. Franklin Barbecue earns its reputation, but three other spots — all with real Michelin recognition — do the craft at an equally serious level, without the multi-hour commitment. And if you'd rather not leave the circuit at all, COTA's own food scene on race weekend is a real, serious option in its own right.",

  eatingInsideCota: {
    label: "Eating inside COTA itself",
    body:
      "The COTA Culinary Experience runs five food villages with 30+ restaurants across the circuit, built around real Austin chefs and purveyors rather than generic stadium concessions — Taste of Texas covers gourmet grab-and-go from local eateries, and the COTA Biergarten leans into the city's German heritage with sausage and schnitzel from Austin purveyors. Expect roughly US$15-25 for a meal and US$8-10 for a beer, alongside standard concessions (hot dogs, pizza, Tex-Mex) and food trucks covering Turkish, Thai, and vegan options. Everything is cashless — see the First-Timer Guide — and the COTA app is the fastest way to find the specific stand or village you want rather than wandering the Grand Plaza.",
  },

  theOneEveryoneHeardOf: {
    label: "The one everyone's heard of",
    // FLAG: source renders the "us-gp-franklin-barbecue" experience card
    // here with no additional inline prose in the spoke file itself.
  },

  threeRealAlternatives: {
    label: "Three real alternatives, same seriousness",
    // FLAG: source renders the "us-gp-bbq-beyond-franklin" experience card
    // here with no additional inline prose in the spoke file itself.
  },

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which one we'd pick in Austin",
      body:
        "If this is your first Austin trip and the Franklin mythology genuinely matters to you, do it once — the brisket is worth the wait — but pre-order online (5-pound minimum) as a group if you can't sacrifice a full morning to the line. For a race weekend where every hour matters, LeRoy and Lewis is the strongest single alternative: One Star in the Michelin Guide, genuinely different from traditional Central Texas barbecue, and a wait measured in tens of minutes rather than hours. Micklethwait and la Barbecue are both excellent, but their genuinely limited weekly hours (Micklethwait closed Mon-Wed, la Barbecue closed Mon-Tue) make them a harder fit to plan around during an already-packed race weekend.",
    },
    {
      label: "What to pick inside COTA itself",
      body:
        "Skip the generic concession lines and head for Lone Star Land, the BBQ-focused food village at one of the circuit's busiest entrances — it actually carries Micklethwait Craft Meats trackside, so you can get real, serious Austin barbecue without leaving the grounds during a session. If you want something lighter or faster between sessions, Taste of Texas is the better bet — genuine grab-and-go variety (ramen, burgers, and local favorites) rather than a single-cuisine village, so it's easier to eat quickly and get back to your seat. Save Rodeo Driveway, behind the Main Grandstand, for a slower moment — it runs noticeably more upscale (Brasserie Mon Chou Chou, Little Ola's biscuits) and rewards actually sitting down rather than grabbing food on the move.",
    },
    {
      label: "The real Franklin shortcut",
      body:
        "Order online for pickup with a 5-pound minimum — a genuine way to get Franklin's brisket without the line at all, and the minimum makes more sense split across a group traveling together for the weekend.",
    },
  ],

  sourcesFooter:
    "Sources: franklinbbq.com, Michelin Guide, bestbiteguide.com, circuitoftheamericas.com, austinfoodmagazine.com (COTA Culinary Experience food villages and vendors).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "us-gp-franklin-barbecue" (franklin) — "The one everyone's heard of" section
//   - "us-gp-bbq-beyond-franklin" (bbqBeyond) — "Three real alternatives" section
