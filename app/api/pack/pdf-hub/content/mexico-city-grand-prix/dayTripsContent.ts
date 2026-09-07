// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/DayTripsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const mexicoCityGpDayTripsSpokeContent = {
  h1: "Aztec ruins, ancient pyramids, and a parade that only happens this once",

  intro:
    "Mexico City is the destination here, not a satellite town near the circuit — which means the \"day trips\" question is really about how to use the time around your race sessions well. That spans the historic center's layered Aztec-and-colonial history, a green district built around one of the world's great anthropology museums, an hour-long trip to genuinely ancient pyramids, a floating canal party, and — this year specifically — one of the country's biggest cultural celebrations happening at the same time as the race.",

  inTheCityHeading: { label: "In the city — history and culture" },
  outOfTheCityHeading: { label: "Out of the city — real day trips" },
  thisYearOnlyHeading: { label: "This year only — Día de Muertos" },

  honestLogistics: {
    label: "The honest logistics",
    body:
      "The Zócalo/Cathedral/Templo Mayor and Chapultepec/Anthropology Museum stops are both genuine half-day commitments in the city itself — don't try to do both plus the Frida Kahlo Museum in a single day. Teotihuacán is a real day trip (roughly 6 hours round trip including 3-4 hours on site) — don't treat it as a quick add-on to another plan. The Día de Muertos parade runs Saturday 31 October from roughly midday to mid-afternoon, directly inside race weekend — plan around it rather than assuming you can fit it in around a full day of track sessions with no adjustment.",
  },

  // Pro-gated verdict content — matching DayTripsSpoke.tsx's {isUnlocked}
  // block exactly.
  verdicts: [
    {
      label: "How we'd actually sequence it",
      body:
        "For a standard Friday-Sunday race weekend, Thursday (before track action starts) is the natural day for Teotihuacán — leave early to beat both the heat and the crowds, and you'll be back in the city with a full evening still ahead of you. Friday, before or after practice, is the right window for the Zócalo/Cathedral/Templo Mayor loop — it's a compact, walkable half-day that doesn't demand a full day's commitment. Saturday is the day the parade actually happens this year — build your schedule around catching part of it before or after qualifying, since it runs midday, not evening. Save Chapultepec/Anthropology Museum and the Frida Kahlo Museum for whichever day has the lightest track commitment, and treat Xochimilco as a genuine half-to-full-day commitment for whenever your schedule has real flexibility, since rushing it defeats the point.",
    },
    {
      label: "The one combination that genuinely doesn't fit",
      body:
        "Don't try to do Teotihuacán and the Día de Muertos parade on the same day. Teotihuacán alone eats most of a day including travel, and the parade demands real time on the ground to actually experience rather than catch a glimpse of in passing. Pick one per day, not both.",
    },
  ],

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups:
//   - "mexico-city-zocalo-cathedral-templo-mayor-" (zocalo)
//   - "mexico-city-chapultepec-anthropology-" (chapultepec)
//   - "mexico-city-frida-kahlo-museum-" (fridaMuseum)
//   - "mexico-city-teotihuacan-day-trip-" (teotihuacan)
//   - "mexico-city-xochimilco-" (xochimilco)
//   - "mexico-city-dia-de-muertos-" (diaDeMuertos)
