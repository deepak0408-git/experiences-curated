// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/HotelsSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased.

export const nzAustraliaHotelsSpokeContent = {
  intro:
    "This series asks a different accommodation question in every city. Perth splits between walking to the ground and basing in the CBD. Adelaide is a genuine choice between proximity to the Oval and North Adelaide's quieter character. Melbourne runs into the city's single highest hotel-demand week of the year. Sydney splits between Paddington's village feel and a CBD hotel with harbour access. None of the four cities share the same tradeoff, so treat each leg as its own decision rather than applying one rule across all four.",

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book, city by city",
      body:
        "Perth: base in the CBD near the InterContinental unless a resort day between sessions genuinely matters to you — the train from Perth Stadium station removes almost all the walkability advantage Crown Towers otherwise has. Adelaide: North Adelaide for a quieter, more residential stay if you're there for more than the match days; City for walkable access to everything else the trip needs. Melbourne: East Melbourne (Pullman East Melbourne, across the road from the MCG) over the CBD (Sofitel Melbourne on Collins) — Melbourne's December weather is the most changeable of the four cities, and being a short walk from the ground matters more than being close to Collins Street's restaurants if a session gets interrupted or the heat spikes. Book the moment your dates are fixed regardless of which you pick — this is the one leg where waiting costs you real money, not just choice. Sydney: Paddington for the village feel and proximity to the SCG itself; the CBD if harbour access and Sydney's wider sights matter more to your trip than being close to the ground.",
    },
    {
      label: "The Boxing Day pricing trap",
      body:
        "Melbourne's hotel demand peaks during Boxing Day week regardless of cricket — it's the city's busiest week of the summer, driven by the post-Christmas domestic travel rush as much as the Test. Book this leg's accommodation earliest of all four, even before you've decided on the other three.",
    },
    {
      label: "Booking timing across the series",
      body:
        "Melbourne first, by a real margin — book that leg before anything else. Sydney's Fourth Test sits in the first week of January, overlapping the tail end of Australia's own summer holiday travel season, so treat it as a secondary priority, not an afterthought. Perth and Adelaide carry the least competing demand of the four and can reasonably wait until closer to your trip.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "where-to-stay-perth-first-test" (perth)
//   - "where-to-stay-adelaide-city-vs-north" (adelaide)
//   - "where-to-stay-melbourne-boxing-day" (melbourne)
//   - "where-to-stay-sydney-fourth-test" (sydney)
