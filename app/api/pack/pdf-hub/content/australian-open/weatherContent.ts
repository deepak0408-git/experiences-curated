// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/WeatherSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const australianOpenWeatherSpokeContent = {
  intro:
    "Melbourne's January weather genuinely swings 15-20°C in a single day — a cool 20°C morning can turn into a 38°C afternoon, then drop again by evening. This isn't exaggerated local colour; it's the real reason layering matters more here than at most other Grand Slams.",

  typicalConditions: {
    label: "Typical January conditions",
    rows: [
      { label: "Typical daily swing", value: "15-20°C between morning and afternoon" },
      { label: "Heatwave risk", value: "Real — days above 35-40°C occur most tournaments" },
      { label: "Rain", value: "Possible but not the dominant risk — heat is the bigger planning factor" },
    ],
  },

  outdoorCourtsNote: {
    label: "Outdoor courts can be directly affected by heat",
    body:
      "Rod Laver Arena and Margaret Court Arena both have retractable roofs, but the outside courts are fully exposed. On a genuine heatwave day, this is a real factor for anyone holding a Ground Pass or outer-court ticket — not just a comfort issue but something that can shape when and how long you spend outdoors.",
  },

  whatToPack: [
    { label: "Clothing", body: "Layers are non-negotiable — a light jacket or long sleeves for a cool morning, breathable clothing for a 15-20°C swing into the afternoon. A wide-brimmed hat and sunglasses for the outside courts, where there's little to no shade for hours at a time. Comfortable, broken-in walking shoes — a full day covers multiple courts and the wider precinct on foot." },
    { label: "Sun and heat", body: "Sunscreen applied before you arrive, not after — Australian UV is genuinely strong even on a mild-feeling day. A refillable water bottle: Melbourne Park has free water refill points and misting fans placed around the grounds specifically for hot sessions. On a genuine heatwave day, the tournament's own Extreme Heat Policy can pause outside-court play entirely." },
    { label: "On the grounds — what's allowed", body: "One bag per person, sized to fit under your seat — large bags, eskies, and hampers aren't permitted, so a soft day-bag is the practical choice. No outside alcohol at all, unlike some tournaments that allow a BYO allowance. Non-alcoholic drinks and food are fine in reasonable, non-glass packaging. Personal cameras are fine; professional equipment, large lenses, tripods, and drones need separate accreditation." },
    { label: "No overnight queue here", body: "Unlike Wimbledon, the Australian Open doesn't have an overnight-camping queue culture — Ground Passes are sold as standard tickets for same-day entry, not earned by waiting outside from the night before." },
  ],

  forecastBox: {
    ctaText: "10-day forecast for Melbourne on AccuWeather →",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "melbourne-january-heat-what-to-pack" (packingGuide)
